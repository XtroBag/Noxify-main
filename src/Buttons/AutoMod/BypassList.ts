import {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { Button } from "../../Custom/Classes/Bot/Button.js";

export default new Button({
  data: {
    customId: "bypass-list",
  },
  run: async ({ client, interaction, map }) => {
    const modal = new ModalBuilder()
      .setCustomId("bypass-modal")
      .setTitle("Bypass Words")
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId("bypass-words")
            .setLabel("Pick words with a comma to seperate")
            .setStyle(TextInputStyle.Paragraph)
        )
      );

    await interaction.showModal(modal);

    const response = await interaction.awaitModalSubmit({
      time: 3000000,
      filter: ({ user }) => user.id === interaction.user.id,
    });

    if (response.customId === "bypass-modal") {
      /*const words =*/ response.fields.getTextInputValue("bypass-words");

      // send words data into the database object

      map.get("keywordButtons").components[0].setDisabled(true);

      response.deferUpdate();
      interaction.editReply({ components: [map.get("keywordButtons")] });
    }
  },
});
