import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  codeBlock,
} from "discord.js";
import { SlashCommand } from "../../../custom/classes/bot/slash.js";
import { Colors } from "../../../custom/enums/colors.js";

export default new SlashCommand({
  data: {
    name: "database",
    description: "check a guild inside the database",
    options: [
      {
        name: "model",
        description: "show the models inside",
        type: ApplicationCommandOptionType.String,
        required: true,
        autocomplete: true,
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
  autocomplete: async ({ client, interaction, option }) => {
    if (option.name === "model") {
      const options = ["afk", "guild"];

      return options
        .filter((choice) => choice.startsWith(option.value))
        .map((choice) => ({ name: choice, value: choice }));
    }
  },

  execute: async ({ client, interaction }) => {
    const id = interaction.options.getString("id");
    const model = interaction.options.getString("model") 

    /*
    IMPROVE: Make this have a system where it will make more embed pages and list with buttons
    */

    if (!id) {
      if (model === "afk") {
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
      } else if (model === "guild") {
        const embed = new EmbedBuilder()
          .setDescription(
            codeBlock(
              "json",
              JSON.stringify(await client.db.guild.findMany({ include: { settings: true }}), null, 2)
            )
          )
          .setColor(Colors.Normal);

        await interaction.reply({
          embeds: [embed],
        });
      }
    } else {
      if (model === "afk") {
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
      } else if (model === "guild") {
        const embed = new EmbedBuilder()
          .setDescription(
            codeBlock(
              "json",
              JSON.stringify(
                await client.db.guild.findMany({
                  where: { guildID: id }}),
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
