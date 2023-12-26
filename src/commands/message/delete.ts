import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { MessageContextMenu } from "../../Custom/Classes/Bot/MessageContextMenu.js";

export default new MessageContextMenu({
  data: new ContextMenuCommandBuilder()
    .setName("delete")
    .setType(ApplicationCommandType.Message),
  run: async ({ client, interaction }) => {
    if (interaction.memberPermissions.has("ManageMessages")) {
      await interaction.targetMessage.delete();
      interaction.reply({
        content: `Message has been deleted!`,
        ephemeral: true,
      });
    } else {
     await interaction.reply({ content: `You are missing permissions to delete messages`})
    }
  },
});
