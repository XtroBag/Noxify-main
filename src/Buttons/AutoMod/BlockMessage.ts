import {
  ActionRowBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { Button } from "../../Custom/Classes/Bot/Button.js";

export default new Button({
  data: {
    customId: "block-message",
  },
  run: async ({ client, interaction, map }) => {
    const modal = new ModalBuilder()
      .setCustomId("block-custom-message")
      .setTitle("Custom Message")
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId("custom-message")
            .setLabel("Set a custom message to tell the user")
            .setStyle(TextInputStyle.Paragraph)
        )
      );

    await interaction.showModal(modal);

    const response = await interaction.awaitModalSubmit({
      time: 3000000,
      filter: ({ user }) => user.id === interaction.user.id,
    });

    if (response.customId === "block-custom-message") {
      /* const message = */ response.fields.getTextInputValue("custom-message");
      // set message into database

      map
        .get("finishedButtons")
        .components[0].setDisabled(true)
        .setStyle(ButtonStyle.Success);

      response.deferUpdate();
      interaction.editReply({ components: [map.get("finishedButtons")] });
    }
  },
});
