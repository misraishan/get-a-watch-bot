// Bot invite
// https://discord.com/api/oauth2/authorize?client_id=1036515690674405407&permissions=10737469504&scope=bot

import { AutocompleteInteraction, CacheType, ChatInputCommandInteraction, Client, Events, time as djstime, inlineCode } from "discord.js";
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
        if (interaction.commandName === "timezone") setTimezone(interaction);

        if (interaction.commandName == "time") getTime(interaction);

        if (interaction.commandName == "timestamp") getTimeStamp(interaction);

    } else if (interaction.isAutocomplete()) {
        if (interaction.options.get("timezone")) tzAutocomplete(interaction);
    }
});

async function getTime(interaction: ChatInputCommandInteraction<CacheType>) {
    const user = interaction.options.get("user")?.user;
    const timezone = interaction.options.get("timezone")?.value as string;
    const tzFormat = "hh:mm a z"

    if (!user && !timezone)
        await interaction.reply({content: "Please provide a user or a timezone!", ephemeral: true});

    if (user) {
        const userTimezone = await db.user.findUnique({
            where: {
                id: user.id
            }
        });

        if (userTimezone) {
            const time = moment().tz(userTimezone.timezone).format(tzFormat);
            await interaction.reply(`The time for <@${user.id}> is ${time} in ${userTimezone.timezone}!`);
        } else {
            await interaction.reply("The user " + user.tag + " has not set their timezone yet!");
        }
    } else {
        const time = moment().tz(timezone).format(tzFormat);
        await interaction.reply("The time in " + timezone + " is " + time + "!");
    }
}

async function setTimezone(interaction: ChatInputCommandInteraction<CacheType>) {
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

async function getTimeStamp(interaction: ChatInputCommandInteraction<CacheType>) {
    const time = interaction.options.get("time")?.value as string;
    const date = interaction.options.get("date")?.value as number;
    const month = interaction.options.get("month")?.value as number;
    const year = interaction.options.get("year")?.value as number;
    let timezone = interaction.options.get("timezone")?.value as string;
    const ephemeral = interaction.options.get("public")?.value as boolean;

    if (!timezone) {
        const user = await db.user.findUnique({
            where: {
                id: interaction.user.id
            }
        });
        if (!user) {
            await interaction.reply({content: "Please provide a timezone!", ephemeral: true});
            return;
        }
        timezone = user?.timezone;
    }

    if ((!time || !date) && !timezone) {
        await interaction.reply({content: "Please provide a time, date, and timezone!", ephemeral: true});
        return;
    }

    const now = new Date(Date.now());
    const monthToUse = month || now.getMonth() + 1;
    const yearToUse = year || now.getFullYear();

    const timestampDate = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    })

    let timestamp;
    const timestampDateFormatted = timestampDate.format(new Date(`${monthToUse}/${date}/${yearToUse} ${time}`));
    try {
        timestamp = new Date(timestampDateFormatted);
    } catch (error) {
        await interaction.reply({content: "Invalid date or time!", ephemeral: true});
        return;
    }
    
    const sec = Math.floor(timestamp.getTime() / 1000);
    const format = interaction.options.get("format")?.value as string

    const djsTime = djstime(sec, format as any);

    await interaction.reply({
        content: `The timestamp for ${inlineCode(timestamp.toDateString())} at ${time} in ${timezone} is ${inlineCode(djsTime)}!`,
        ephemeral: ephemeral
    })

}

const tzList = moment.tz.names();
async function tzAutocomplete(interaction: AutocompleteInteraction<CacheType>) {
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

