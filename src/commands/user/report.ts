import {
  ActionRowBuilder,
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { UserContextMenu } from "../../Custom/Classes/Bot/UserContextMenu.js";


export default new UserContextMenu({
  data: new ContextMenuCommandBuilder()
    .setName("Report")
    .setType(ApplicationCommandType.User),
  run: async ({ client, interaction }) => {
    const reason = new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setLabel("Reason")
        .setPlaceholder("Explain what this user has done")
        .setStyle(TextInputStyle.Short)
        .setCustomId("report-reason")
        .setRequired(true)
    );

    const offender = new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setLabel("Offender ID")
        .setPlaceholder("Please enter the offenders ID here")
        .setStyle(TextInputStyle.Short)
        .setCustomId("report-offender")
        .setRequired(true)
    );

    const modal = new ModalBuilder()
      .setTitle("Report user")
      .setCustomId("report-modal")
      .setComponents(reason, offender);

    await interaction.showModal(modal);
  },
});
