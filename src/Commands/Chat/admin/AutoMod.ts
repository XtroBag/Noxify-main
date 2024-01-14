import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { SlashCommand } from "../../../Custom/Classes/Bot/Slash.js";
import { Colors } from "../../../Custom/Enums/Colors.js";
import { map } from "../../../Buttons/AutoMod/AddRule.js";

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
    // the main embed
    const main = new EmbedBuilder()
      .setColor(Colors.Normal)
      .setDescription("Setup and modify rules for your guild");

    // the button action row
    const buttons = new ActionRowBuilder<ButtonBuilder>().setComponents(
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

    map.set("mainPage", buttons);

    // first main interaction reply
    await interaction.reply({
      embeds: [main],
      components: [buttons],
    });
  },
});
