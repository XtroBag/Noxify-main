import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { MessageContextMenu } from "../../types/classes/messagecontext.js";

export default new MessageContextMenu({ 
    data: new ContextMenuCommandBuilder()
    .setName('delete')
    .setType(ApplicationCommandType.Message),
    run: async (client, menu) => {

        await menu.targetMessage.delete()
        menu.reply({ content: `Message has been deleted!`, ephemeral: true })
    }
})