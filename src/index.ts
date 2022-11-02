// Bot invite
// https://discord.com/api/oauth2/authorize?client_id=1036515690674405407&permissions=10737469504&scope=bot

import { Client, Events } from "discord.js";
import { config } from "dotenv";
import moment from "moment-timezone";
import { PrismaClient } from "@prisma/client";

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
        if (interaction.commandName === "timezone") {
            const value : string = interaction.options.get("timezone")?.value as string;
            await interaction.reply("Successfully set your timezone to " + value + "!");

            const user = interaction.user;
            await db.user.upsert({
                where: {
                    id: user.id
                },
                update: {
                    timezone: value
                },
                create: {
                    id: user.id,
                    timezone: value
                }
            });
        }
    } else if (interaction.isAutocomplete()) {
        const tzList = moment.tz.names();
        const maxResults = 20;
        const value = interaction.options.get("timezone")?.value as string;
        const results = [];
        if (value) {
            results.push(...tzList.filter((tz) => tz.toLowerCase().includes(value.toLowerCase())));
        } else {
            results.push(...tzList);
        }

        results.length = Math.min(results.length, maxResults);

		try {
			await interaction.respond(
                results.map(tz => ({ name: tz, value: tz })),
            );
		} catch (error) {
			console.error(error);
		}
    }
});

// Fill autofill option for timezone command

