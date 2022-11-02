import { Routes, SlashCommandBuilder } from "discord.js";
import { REST } from "@discordjs/rest";
import { config } from "dotenv";

const commands = [

  // Command to get time
  new SlashCommandBuilder()
    .setName("timestamp")
    .setDescription("Gives you the formatted time in the specified timezone")
    .addStringOption((opt) => {
      return opt
        .setName("time")
        .setDescription("The time you want to get the time for")
        .setRequired(true)
    })
    .addStringOption((opt) => {
      return opt
        .setName("date")
        .setDescription("The date you want to get the time for")
        .setRequired(true)
    })
    .addStringOption((opt) => {
      return opt
        .setName("timezone")
        .setDescription("The timezone you want to get the time for")
        .setRequired(false) // Uses default timzeone for user if exists in db, else uses UTC
    })
    .addBooleanOption((opt) => {
      return opt
        .setName("public")
        .setDescription("Whether the time should be in a public message or not")
        .setRequired(false)
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
  new SlashCommandBuilder()
    .setName("remind")
    .setDescription("Remind the user when a speimage.pngimage.pngimage.pngcific time is hit.")
    .addStringOption((opt) => {
      return opt
        .setName("time")
        .setDescription("Write the time you want to be reminded.")
        .setRequired(true)
        .setAutocomplete(true);
    })
    .addStringOption((opt) => {
      return opt
        .setName("date")
        .setDescription("Write the date you want to be reminded.")
        .setRequired(true)
        .setAutocomplete(true);
    })
    .addStringOption((opt) => {
      return opt
        .setName("message")
        .setDescription("Write the message you want to be reminded.")
        .setRequired(true)
        .setAutocomplete(true);
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
        .setRequired(false)
    }),
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
