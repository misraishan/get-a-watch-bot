// Bot invite
// https://discord.com/api/oauth2/authorize?client_id=1036515690674405407&permissions=10737469504&scope=bot

import { ActivityType, Client, Events, PresenceData } from "discord.js";
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { getTime } from "./features/getTime";
import { getTimeStamp } from "./features/timestamps";
import { setTimezone } from "./features/timezones";
import { tzAutocomplete } from "./autocomplete";
import { setReminder } from "./features/reminders/setReminder";
import { setUpcomingReminders } from "./features/reminders/upcomingReminders";
import { commands, info } from "./features/misc";

config();

export const client = new Client({ intents: [] });

export const db = new PrismaClient();

(async () => {
  await client.login(process.env.TOKEN);
})();

async function refreshPresence() {
  const total = client.guilds.cache.size;
  
  const presence: PresenceData = {
    activities: [
      {
        name: `${total} servers`,
        type: ActivityType.Watching,
      },
    ],
  };
  client.user?.setPresence(presence);
}

client.on("ready", () => {
  console.log("Ready at time " + Date.now() + "!");
  setUpcomingReminders();
  refreshPresence();
});

client.on("guildCreate", () => {
  refreshPresence();
});

client.on("guildDelete", () => {
  refreshPresence();
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "timezone") setTimezone(interaction);

    if (interaction.commandName == "time") getTime(interaction);

    if (interaction.commandName == "timestamp") getTimeStamp(interaction);

    if (interaction.commandName == "reminder") setReminder(interaction);
    
    if (interaction.commandName == "info") info(interaction);

    if (interaction.commandName == "commands") commands(interaction);
  } else if (interaction.isAutocomplete()) {
    if (interaction.options.get("timezone")) tzAutocomplete(interaction);
  }
});
