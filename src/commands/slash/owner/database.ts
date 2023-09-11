import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  // EmbedBuilder,
  // codeBlock,
} from "discord.js";
import { SlashCommand } from "../../../types/classes/slash.js";
// import { Colors } from "../../../../config/config.js";

export default new SlashCommand({
  data: {
    name: "database",
    description: "check a guild inside the database",
    options: [
      {
        name: "id",
        description: "search for a certain guild",
        type: ApplicationCommandOptionType.String,
        required: true
      },
    ],
  },
  opt: {
    userPermissions: ["SendMessages"],
    botPermissions: ["SendMessages"],
    cooldown: 3,
    ownerOnly: true,
    disabled: false,
  },
  execute: async (
    client,
    interaction: ChatInputCommandInteraction<"cached">
  ) => {
    // const id = interaction.options.getString("id");

    // const embed = new EmbedBuilder()
    //   .setDescription(
    //     codeBlock("json",
    //       JSON.stringify(
    //         await client.db.guild.findUnique({
    //           where: {
    //             guildID: id,
    //           },
    //           include: {
    //             afk: true
    //           }
    //         }),
    //         null, 
    //         2
    //       )
    //     )
    //   )
    //   .setColor(Colors.Normal);

    // await interaction.reply({
    //   embeds: [embed],
    // });
  },
});
