import {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { Button } from "../../Custom/Classes/Bot/Button.js";

export default new Button({
  data: {
    customId: "filter-list",
  },
  run: async ({ client, interaction, map }) => {
    const modal = new ModalBuilder()
      .setCustomId("filter-modal")
      .setTitle("Filter Words")
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId("filter-words")
            .setLabel("Pick words with a comma to seperate")
            .setStyle(TextInputStyle.Paragraph)
        )
      );

    await interaction.showModal(modal);

    const response = await interaction.awaitModalSubmit({
      time: 3000000,
      filter: ({ user }) => user.id === interaction.user.id,
    });

    if (response.customId === "filter-modal") {
      /*const words =*/ response.fields.getTextInputValue("filter-words");

      // send words data into the database object

      map.get("keywordButtons").components[1].setDisabled(true);

      response.deferUpdate();
      interaction.editReply({ components: [map.get("keywordButtons")] });
    }
  },
});
