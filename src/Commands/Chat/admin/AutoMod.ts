import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { SlashCommand } from "../../../Custom/Classes/Bot/Slash.js";
import { Colors } from "../../../Custom/Enums/Colors.js";

export default new SlashCommand({
  data: {
    name: "automod",
    description: "Setup automod rules & features",
    options: [],
  },
  opt: {
    userPerms: ["Administrator"],
    botPerms: [],
    cooldown: 3,
    ownerOnly: false,
    disabled: false,
  },
  execute: async ({ client, interaction }) => {
    /*
    CURRENT ISSUES:
    There can sometimes be a "unknown interaction" error while hitting certain buttons on the "bypass" & "filter" page
    */

    // the main embed
    const main = new EmbedBuilder()
      .setColor(Colors.Normal)
      .setDescription("Setup and modify rules for your guild");

    // the button action row
    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId("add-rule")
        .setLabel("Add")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("list-rules")
        .setLabel("List")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("remove-rule")
        .setLabel("Remove")
        .setStyle(ButtonStyle.Danger)
    );

    // first main interaction reply
    const response = await interaction.reply({
      embeds: [main],
      components: [row],
    });


  },
});
