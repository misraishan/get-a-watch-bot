import { Timer } from "@prisma/client";
import { inlineCode, codeBlock } from "discord.js";
import { db, client } from "../..";

const remindersId = new Set();
let currentReminder: NodeJS.Timeout;
export async function setUpcomingReminders() {
  let timestamps = null;
  try {
    timestamps = await db.timer.findMany({
      where: {
        end: {
          gte: Math.floor(Date.now() / 1000),
          lte: Math.floor(Date.now() / 1000) + 86400,
        },
        isActive: true,
      },
    });
  } catch (error) {
    console.log(error);
  }

  if (timestamps) {
    for (const reminder of timestamps) {
      remindersId.add(reminder.id);
      if (reminder.end * 1000 - Date.now() <= 3600000) {
        setReminderTimer(reminder);
      }
    }
  }

  currentReminder = setTimeout(setUpcomingReminders, 3600000);
}

async function setReminderTimer(reminder: Timer) {
  setTimeout(async () => {
    try {
      await client.users.fetch(reminder.userId).then((user) => {
        user.send(
          `Your reminder ${inlineCode(reminder.name)} is now!\n${
            reminder.message ? codeBlock(reminder.message) : ""
          }`
        );
      });

      await db.timer.update({
        where: {
          id: reminder.id,
        },
        data: {
          isActive: false,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }, reminder.end * 1000 - Date.now());
}

export async function newReminderRefresh(reminder: Timer) {
  if (reminder.end * 1000 - Date.now() <= 3600000) {
    clearTimeout(currentReminder);
    setUpcomingReminders();
  }
}
