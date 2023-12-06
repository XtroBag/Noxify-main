import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { MessageContextMenu } from "../../custom/classes/bot/messagecontextmenu.js";

export default new MessageContextMenu({ 
    data: new ContextMenuCommandBuilder()
    .setName('delete')
    .setType(ApplicationCommandType.Message),
    run: async ({ client, interaction }) => {

        await interaction.targetMessage.delete()
        interaction.reply({ content: `Message has been deleted!`, ephemeral: true })
    }
})