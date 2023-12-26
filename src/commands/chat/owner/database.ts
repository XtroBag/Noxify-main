import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  codeBlock,
} from "discord.js";
import { SlashCommand } from "../../../Custom/Classes/Bot/Slash.js";
import { Colors } from "../../../Custom/Enums/Colors.js";

export default new SlashCommand({
  data: {
    name: "database",
    description: "check a guild inside the database",
    options: [
      {
        name: "model",
        description: "show the models inside",
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: "Guild",
            value: "guild",
          },
          {
            name: "Afk",
            value: "afk",
          },
        ],
      },
      {
        name: "id",
        description: "search for a certain guild",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],
  },
  opt: {
    userPerms: [],
    botPerms: [],
    cooldown: 3,
    ownerOnly: true,
    disabled: false,
  },
  execute: async ({ client, interaction }) => {
    const id = interaction.options.getString("id");
    const model = interaction.options.getString("model");

    /*
    IMPROVE: Make this have a system where it will make more embed pages and list with buttons
    */

    if (!id) {
      if (model === "Afk") {
        const embed = new EmbedBuilder()
          .setDescription(
            codeBlock(
              "json",
              JSON.stringify(await client.db.afk.findMany(), null, 2)
            )
          )
          .setColor(Colors.Normal);

        await interaction.reply({
          embeds: [embed],
        });
      } else if (model === "Guild") {
        const embed = new EmbedBuilder()
          .setDescription(
            codeBlock(
              "json",
              JSON.stringify(await client.db.guild.findMany(), null, 2)
            )
          )
          .setColor(Colors.Normal);

        await interaction.reply({
          embeds: [embed],
        });
      }
    } else {
      if (model === "Afk") {
        const embed = new EmbedBuilder()
          .setDescription(
            codeBlock(
              "json",
              JSON.stringify(
                await client.db.afk.findUnique({
                  where: { guildID: id },
                }),
                null,
                2
              )
            )
          )
          .setColor(Colors.Normal);

        await interaction.reply({
          embeds: [embed],
        });
      } else if (model === "Guild") {
        const embed = new EmbedBuilder()
          .setDescription(
            codeBlock(
              "json",
              JSON.stringify(
                await client.db.guild.findMany({
                  where: { guildID: id },
                }),
                null,
                2
              )
            )
          )
          .setColor(Colors.Normal);

        await interaction.reply({
          embeds: [embed],
        });
      }
    }
  },
});
