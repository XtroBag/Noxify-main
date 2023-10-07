import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { MessageContextMenu } from "../../custom/classes/bot/messagecontextmenu.js";

export default new MessageContextMenu({ 
    data: new ContextMenuCommandBuilder()
    .setName('delete')
    .setType(ApplicationCommandType.Message),
    run: async (client, menu) => {

        await menu.targetMessage.delete()
        menu.reply({ content: `Message has been deleted!`, ephemeral: true })
    }
})