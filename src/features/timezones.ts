import { ChatInputCommandInteraction, CacheType } from "discord.js";
import { db } from "..";
import { tzList } from "../autocomplete";
import consola from "consola"

export async function setTimezone(
  interaction: ChatInputCommandInteraction<CacheType>
) {
  const value: string = interaction.options.get("timezone")?.value as string;
  const isInList = tzList.filter((tz: string) =>
    tz.toLowerCase().includes(value.toLowerCase())
  );

  if (isInList.length === 0) {
    await interaction.reply({
      content: "Please provide a valid timezone!",
      ephemeral: true,
    });
    return;
  }

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

    await interaction.reply("Successfully set your timezone to " + value + "!");
  } catch (error) {
    await interaction.reply({
      content:
        "An error occurred while setting your timezone!\nIf this is an error, dm <@749490210508898325> with a screenshot",
      ephemeral: true,
    });
    consola.error("Time is (in func setTZ): " + Date.now() + error);
  }
}
