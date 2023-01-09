import {
  ChatInputCommandInteraction,
  CacheType,
  inlineCode,
  EmbedBuilder,
} from "discord.js";
import { db } from "..";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import advance from "dayjs/plugin/advancedFormat";
import consola from "consola";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advance);

export async function getTime(
  interaction: ChatInputCommandInteraction<CacheType>
) {
  const user = interaction.options.get("user")?.user;
  const timezone = interaction.options.get("timezone")?.value as string;
  const tzFormat = "dddd, MMMM D — hh:mm a";
  const embed = new EmbedBuilder();

  if (!user && !timezone) {
    await interaction.reply({
      content: "Please provide a user or a timezone!",
      ephemeral: true,
    });
    return;
  }

  try {
    if (user) {
      const userTimezone = await db.user.findUnique({
        where: {
          id: user.id,
        },
      });

      if (userTimezone) {
        embed
          .setAuthor({
            name: user.tag,
            iconURL: user.avatarURL() || user.defaultAvatarURL,
          })
          .setTitle(`Time in ${userTimezone.timezone.split("/")[1]}`)
          .setDescription(
            inlineCode(dayjs().tz(userTimezone.timezone).format(tzFormat))
          )
          .setFields([
            {
              name: "Timezone",
              value: `${inlineCode(
                dayjs().tz(userTimezone.timezone).format("z")
              )} or ${inlineCode(userTimezone.timezone)}`,
            },
          ])
          .setColor("Purple");
      } else {
        await interaction.reply(
          "" + user.username + " has not set their timezone yet!"
        );
        return;
      }
    } else {
      embed
        .setTitle(`Time in ${timezone.split("/")[1]}`)
        .setDescription(inlineCode(dayjs().tz(timezone).format(tzFormat)))
        .setFields([
          {
            name: "Timezone",
            value: `${inlineCode(
              dayjs().tz(timezone).format("z")
            )} or ${inlineCode(timezone)}`,
          },
        ])
        .setColor("Purple");
    }

    await interaction.reply({ embeds: [embed] });
    return;
  } catch (error) {
    await interaction.reply({
      content:
        "An error occurred while getting the time!\nIf this is an error, dm <@749490210508898325> with a screenshot or join the support server",
      ephemeral: true,
    });
    consola.error("Time is (in func getTime): " + Date.now() + error);
    return;
  }
}
