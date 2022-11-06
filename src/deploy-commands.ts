import { Routes, SlashCommandBuilder } from "discord.js";
import { REST } from "@discordjs/rest";
import { config } from "dotenv";

const months = [
  {
    name: "january",
    value: "january",
  },
  {
    name: "february",
    value: "february",
  },
  {
    name: "march",
    value: "march",
  },
  {
    name: "april",
    value: "april",
  },
  {
    name: "may",
    value: "may",
  },
  {
    name: "june",
    value: "june",
  },
  {
    name: "july",
    value: "july",
  },
  {
    name: "august",
    value: "august",
  },
  {
    name: "september",
    value: "september",
  },
  {
    name: "october",
    value: "october",
  },
  {
    name: "november",
    value: "november",
  },
  {
    name: "december",
    value: "december",
  },
];

const formatOptions = [
  {
    name: "Hours:Minutes",
    value: "t",
  },
  {
    name: "Hours:Minutes:Seconds",
    value: "T",
  },
  {
    name: "Date/Month/Year",
    value: "d",
  },
  {
    name: "Date Month Year",
    value: "D",
  },
  {
    name: "Date Month Year Hours:Minutes",
    value: "f",
  },
  {
    name: "Day, Date Month Year Hours:Minutes",
    value: "F",
  },
  {
    name: "Relative Time",
    value: "R",
  }
];

const commands = [
  // Command to get time
  new SlashCommandBuilder()
    .setName("timestamp")
    .setDescription("Gives you the formatted time in the specified timezone")
    .addStringOption((opt) => {
      return opt
        .setName("time")
        .setDescription("The time you want to format")
        .setRequired(true);
    })
    .addIntegerOption((opt) => {
      return opt
        .setName("date")
        .setDescription("The date you want to get the time for")
        .setRequired(true);
    })
    .addStringOption((opt) => {
      return opt
        .setName("format")
        .setDescription("The format you want to get the time in")
        .setRequired(true)
        .addChoices(...formatOptions);
    })
    .addStringOption((opt) => {
      return opt
        .setName("month")
        .setDescription("The month you want to get the time for (default current month)")
        .setRequired(false)
        .addChoices(...months);
    })
    .addIntegerOption((opt) => {
      return opt
        .setName("year")
        .setDescription(
          "The year you want to get the time for (uses current year by default)"
        )
        .setRequired(false);
    })
    .addStringOption((opt) => {
      return opt
        .setName("timezone")
        .setDescription(
          "The timezone you want to get the time for (uses your default timezone if set)"
        )
        .setRequired(false) // Uses default timzeone for user if exists in db, else uses UTC
        .setAutocomplete(true);
    })
    .addBooleanOption((opt) => {
      return opt
        .setName("public")
        .setDescription(
          "Whether the time should be in a public message or not (ephemeral or not)"
        )
        .setRequired(false);
    }),

  // Command to set timezone
  new SlashCommandBuilder()
    .setName("timezone")
    .setDescription("Set your timezone.")
    .addStringOption((opt) => {
      return opt
        .setName("timezone")
        .setDescription("Write your timezone.")
        .setRequired(true)
        .setAutocomplete(true);
    }),

  // Command to remind the user when a specific time is hit
  // Input: Time, Date, Month, Year, Timezone, Message
  new SlashCommandBuilder()
    .setName("reminder")
    .setDescription(
      "Remind the user when a specific time is hit."
    )
    .addStringOption((opt) => {
      return opt
        .setName("time")
        .setDescription("The time you want to format")
        .setRequired(true);
    })
    .addIntegerOption((opt) => {
      return opt
        .setName("date")
        .setDescription("The date you want to get the time for")
        .setRequired(true);
    })
    .addStringOption((opt) => {
      return opt
        .setName("name")
        .setDescription("The name of the reminder")
        .setRequired(true);
    })
    .addStringOption((opt) => {
      return opt
        .setName("month")
        .setDescription("The month you want to get the time for (default current month)")
        .setRequired(false)
        .addChoices(...months);
    })
    .addIntegerOption((opt) => {
      return opt
        .setName("year")
        .setDescription(
          "The year you want to get the time for (uses current year by default)"
        )
        .setRequired(false);
    })
    .addStringOption((opt) => {
      return opt
        .setName("message")
        .setDescription("Write the message you want to be reminded.")
        .setRequired(false);
    })
    .addStringOption((opt) => {
      return opt
        .setName("timezone")
        .setDescription("Write your timezone.")
        .setRequired(false)
        .setAutocomplete(true);
    }),

  new SlashCommandBuilder()
    .setName("time")
    .setDescription("Get the time in a specific timezone or user.")
    .addStringOption((opt) => {
      return opt
        .setName("timezone")
        .setDescription("Write your timezone.")
        .setRequired(false)
        .setAutocomplete(true);
    })
    .addUserOption((opt) => {
      return opt
        .setName("user")
        .setDescription("Write the user you want to get the time for.")
        .setRequired(false);
    }),

    new SlashCommandBuilder()
    .setName("reset")
    .setDescription("Removes your timezone and timers from the database.")
    .addStringOption((opt) => {
      return opt
        .setName("confirm")
        .setDescription("Type 'confirm' to confirm.")
        .setRequired(true);
    }),

    new SlashCommandBuilder()
    .setName("info")
    .setDescription("Get information about the bot."),
    
    new SlashCommandBuilder()
    .setName("commands")
    .setDescription("Get a list of all commands.")
];

config();
const token: string = process.env.TOKEN as string;
const rest = new REST({ version: "10" }).setToken(token);
(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID as string),
      { body: [] }
    );

    try {
      console.log("Started refreshing application (/) commands.");
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID as string),
        { body: commands }
      );
      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error(error);
    throw Error("Could not delete commands.");
  }
})();
