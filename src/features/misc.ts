import consola from "consola";
import {
  ChatInputCommandInteraction,
  CacheType,
  EmbedBuilder,
} from "discord.js";

export async function info(
  interaction: ChatInputCommandInteraction<CacheType>
) {
  // Create an embed with the information about the bot
  const embed = new EmbedBuilder()
    .setTitle("Get a Watch Bot")
    .setDescription(
      "A bot that helps you keep track of timezones and reminders"
    )
    .addFields(
      {
        name: "Invite",
        value:
          "[Invite the bot](https://discord.com/api/oauth2/authorize?client_id=1036515690674405407&permissions=10737469504&scope=bot)",
      },
      {
        name: "Source Code",
        value:
          "[View the source code](https://github.com/hayhay404/get-a-watch-bot)",
      },
      {
        name: "Support Server",
        value: "[Join the support server](https://discord.gg/wRvPsZG5r7)",
      },
      {
        name: "Commands",
        value: "/commands",
      }
    )
    .setColor("Purple")
    .setFooter({
      text: "Made with ❤️ by HayHay#2575",
    });

  // Reply with the embed
  try {
    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.log(error);
  }
}

export async function commands(
  interaction: ChatInputCommandInteraction<CacheType>
) {
  const embed = new EmbedBuilder()
    .setTitle("Commands")
    .setDescription("A list of all the commands")
    .addFields(
      {
        name: "/commands",
        value: "Shows a list of all the commands (you are here)",
      },
      {
        name: "/info",
        value: "Shows information about the bot",
      },
      {
        name: "/time",
        value:
          "Shows the current time in a timezone or for another user who has set their timezone",
      },
      {
        name: "/timezone",
        value: "Sets your timezone",
      },
      {
        name: "/timestamp",
        value:
          "Converts a time and date in your local timezone to a discord dynamic timestamp",
      },
      // {
      //   name: "/reminder",
      //   value: "Sets a reminder\nThe bot will DM you when the reminder is due",
      // }
    )
    .setColor("Purple")
    .setFooter({
      text: "Made with ❤️ by HayHay#2575",
    });

  try {
    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    await interaction.reply({
      content:
        "This err msg should never appear... DM <@749490210508898325> with a screenshot...",
      ephemeral: true,
    });
    consola.error("Time is (in func info): " + Date.now() + error);
  }
}
