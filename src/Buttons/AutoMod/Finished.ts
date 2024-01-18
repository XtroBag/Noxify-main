import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { Button } from "../../Custom/Classes/Bot/Button.js";
import { Colors } from "../../Custom/Enums/Colors.js";

export default new Button({
  data: {
    customId: "finished",
  },
  run: async ({ client, interaction, map }) => {

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("block-message")
        .setLabel("Block")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("send-alert")
        .setLabel("Alerts")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
      .setCustomId("timeout-member")
      .setLabel('Timeout')
      .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
      .setCustomId("finished-action-types")
      .setLabel('Finish')
      .setStyle(ButtonStyle.Secondary)
    )

    map.set("finishedButtons", buttons);

    await interaction.update({
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.Normal)
          .setDescription("Please select the actions to take on execution"),
      ],
      components: [buttons],
    });
  },
});
