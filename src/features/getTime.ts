import { ChatInputCommandInteraction, CacheType } from "discord.js";
import moment from "moment";
import { db } from "..";

export async function getTime(interaction: ChatInputCommandInteraction<CacheType>) {
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
            await interaction.reply("" + user.username + " has not set their timezone yet!");
        }
    } else {
        const time = moment().tz(timezone).format(tzFormat);
        await interaction.reply("The time in " + timezone + " is " + time + "!");
    }
}