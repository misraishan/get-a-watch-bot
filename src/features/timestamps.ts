import {
  ChatInputCommandInteraction,
  CacheType,
  inlineCode,
  time as djstime,
} from "discord.js";
import { db } from "..";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import DayJSTimezone from "dayjs/plugin/timezone";
import consola from "consola";
dayjs.extend(utc);
dayjs.extend(DayJSTimezone);

export async function getTimeStamp(
  interaction: ChatInputCommandInteraction<CacheType>
) {
  const time = interaction.options.get("time")?.value as string;
  const date = interaction.options.get("date")?.value as number;
  const month = interaction.options.get("month")?.value as number;
  const year = interaction.options.get("year")?.value as number;
  let timezone = interaction.options.get("timezone")?.value as string;
  const ephemeral = interaction.options.get("public")?.value as boolean;

  if (month > 12 || month < 1) {
    await interaction.reply({
      content: "Please provide a valid month!",
      ephemeral: true,
    });
    return;
  }

  if (date > 31 || date < 1) {
    await interaction.reply({
      content: "Please provide a valid date!",
      ephemeral: true,
    });
    return;
  }

  if (!timezone) {
    const user = await db.user.findUnique({
      where: {
        id: interaction.user.id,
      },
    });
    if (!user) {
      await interaction.reply({
        content: "Please provide a timezone!",
        ephemeral: true,
      });
      return;
    }
    timezone = user?.timezone;
  }

  if ((!time || !date) && !timezone) {
    await interaction.reply({
      content: "Please provide a time, date, and timezone!",
      ephemeral: true,
    });
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
  });

  let timestamp;
  let timestampDateFormatted;
  try {
    timestamp = dayjs
      .tz(`${yearToUse}-${monthToUse}-${date} ${time}`, timezone)
      .valueOf();
    timestampDateFormatted = timestampDate.format(timestamp);
  } catch (error) {
    console.warn(error);
    await interaction.reply({
      content: "Invalid date or time!",
      ephemeral: true,
    });
    return;
  }

  const sec = Math.floor(timestamp / 1000);
  const djsTime = djstime(sec, interaction.options.get("format")?.value as any);

  try {
    await interaction.reply({
      content: `The timestamp for ${inlineCode(
        timestampDateFormatted
      )} in ${timezone} is ${inlineCode(djsTime)}!`,
      ephemeral: !ephemeral,
    });
  } catch (error) {
    await interaction.reply({
      content:
        "An error occurred while creating the timestamp!\nIf this is an error, dm <@749490210508898325> with a screenshot",
      ephemeral: true,
    });
    consola.error("Time is (in func timestamp): " + Date.now() + error);
    return;
  }
}
