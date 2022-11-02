// Bot invite
// https://discord.com/api/oauth2/authorize?client_id=1036515690674405407&permissions=10737469504&scope=bot

import { Client, Events } from "discord.js";
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { getTime } from "./features/getTime";
import { getTimeStamp } from "./features/timestamps";
import { setTimezone } from "./features/timezones";
import { tzAutocomplete } from "./autocomplete";

config();

export const client = new Client({ intents: [] });

export const db = new PrismaClient();

async function main() {
    await client.login(process.env.TOKEN);
}

main();

client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === "timezone") setTimezone(interaction);

        if (interaction.commandName == "time") getTime(interaction);

        if (interaction.commandName == "timestamp") getTimeStamp(interaction);

    } else if (interaction.isAutocomplete()) {
        if (interaction.options.get("timezone")) tzAutocomplete(interaction);
    }
});
