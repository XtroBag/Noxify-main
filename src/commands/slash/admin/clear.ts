import { SlashCommand} from "../../../types/classes/slash.js";
import { ApplicationCommandType, ChatInputCommandInteraction } from "discord.js";

export default new SlashCommand({
    data: {
        name: 'clear',
        description: 'clear messages from the channel',
        type: ApplicationCommandType.ChatInput,

    },
    opt: {
        botPermissions: ['ManageChannels', 'ManageMessages'],
        userPermissions: ['ManageMessages'],
        cooldown: 5, 
        disabled: false, 
        ownerOnly: false,
    },

    execute: async (client, interaction: ChatInputCommandInteraction<'cached'>) => {
    }

})