import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { MessageContextMenu } from "../../Custom/Classes/Bot/MessageContextMenu.js";

export default new MessageContextMenu({ 
    data: new ContextMenuCommandBuilder()
    .setName('delete')
    .setType(ApplicationCommandType.Message),
    run: async ({ client, interaction }) => {

        await interaction.targetMessage.delete()
        interaction.reply({ content: `Message has been deleted!`, ephemeral: true })
    }
})