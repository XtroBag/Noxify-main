import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { MessageContextMenu } from "../../types/classes/messagecontext.js";

export default new MessageContextMenu({ 
    data: new ContextMenuCommandBuilder()
    .setName('mock')
    .setType(ApplicationCommandType.Message),
    run: async (client, menu) => {
        const deleted = await menu.targetMessage.delete()

        console.log(deleted)

        // menu.reply({ content: menu.targetMessage.content })
    }
})