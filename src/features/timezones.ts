import { ChatInputCommandInteraction, CacheType } from "discord.js";
import { db } from "..";

export async function setTimezone(
  interaction: ChatInputCommandInteraction<CacheType>
) {
  const value: string = interaction.options.get("timezone")?.value as string;
  await interaction.reply("Successfully set your timezone to " + value + "!");

  try {
    const user = interaction.user;
    await db.user.upsert({
      where: {
        id: user.id,
      },
      update: {
        timezone: value,
      },
      create: {
        id: user.id,
        timezone: value,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
