import dayjs from "dayjs";
import {
  ChatInputCommandInteraction,
  CacheType,
  time as djsTime,
} from "discord.js";
import { db } from "../..";
import DayJSTimezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { newReminderRefresh } from "./upcomingReminders";
dayjs.extend(utc);
dayjs.extend(DayJSTimezone);

export async function setReminder(
  interaction: ChatInputCommandInteraction<CacheType>
) {
  const currentDate = new Date();
  const time = interaction.options.get("time")?.value as string;
  const date = interaction.options.get("date")?.value as number;
  const month = interaction.options.get("month")?.value
    ? (interaction.options.get("month")?.value as number)
    : currentDate.getMonth() + 1;
  const year = interaction.options.get("year")?.value
    ? (interaction.options.get("year")?.value as number)
    : currentDate.getFullYear();
  let timezone = interaction.options.get("timezone")?.value as string;
  const name = interaction.options.get("name")?.value as string;
  const message = interaction.options.get("message")?.value
    ? (interaction.options.get("message")?.value as string)
    : null;

  try {
    if (!timezone) {
      const user = await db.user.findUnique({
        where: {
          id: interaction.user.id,
        },
      });
      if (!user) {
        await interaction.reply({
          content:
            "Please provide a timezone or update your own with /timezone.",
          ephemeral: true,
        });
        return;
      }
      timezone = user?.timezone;
    }

    const timestampDate = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    let timestamp: number;
    let formattedTimestamp;
    try {
      timestamp = dayjs
        .tz(`${year}-${month}-${date} ${time}`, timezone)
        .valueOf();
      formattedTimestamp = timestampDate.format(timestamp);
    } catch (error) {
      console.warn(error);
      await interaction.reply({
        content: "Invalid date or time!",
        ephemeral: true,
      });
      return;
    }

    if (timestamp >= Date.now() + 7889238000) {
      await interaction.reply({
        content: "Valid reminders are within 3 months from now.",
        ephemeral: true,
      });
      return;
    }

    const timer = timestamp - Date.now();
    if (timer < 0) {
      await interaction.reply({
        content: "Invalid date or time!",
        ephemeral: true,
      });
      return;
    }

    const userTimers = await db.timer.findMany({
      where: {
        userId: interaction.user.id,
        AND: {
          isActive: true,
        },
      },
    });

    if (userTimers.length >= 10) {
      await interaction.reply({
        content: "You can only have 10 active reminders at a time!",
        ephemeral: true,
      });
      return;
    }

    try {
      const reminder = await db.timer.create({
        data: {
          userId: interaction.user.id,
          end: Math.floor(timestamp / 1000),
          start: Math.floor(Date.now() / 1000),
          message,
          name,
          timezone,
        },
      });

      newReminderRefresh(reminder);

      await interaction.reply({
        content: `Reminder set for ${formattedTimestamp}! It'll arrive in ${djsTime(
          timestamp / 1000,
          "R"
        )}.
                \nMake sure you allow DMs.`,
        ephemeral: true,
      });
    } catch (error) {
      console.warn(error);
      await interaction.reply({
        content: "An error occurred while setting your Reminder!",
        ephemeral: true,
      });
    }
  } catch (error) {
    console.log(
      `I GOT VERY LAZY HERE AND JUST WRAPPED THE ENTIRE SET REMINDER FUNCTION IN A TRY CATCH BLOCK...
      \n\nIF SOMETHING WENT WRONG, IT'S SOMEWHERE HERE I THINK
      \n\n\n\nI'M SORRY!`
    );
    console.log(error);
  }
}
