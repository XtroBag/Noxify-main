import { ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction } from "discord.js";
import { SlashCommand } from "../../../types/classes/slash.js";


export default new SlashCommand({ 
    data: { 
        name: 'timeout',
        description: 'timeout a user in the server',
        type: ApplicationCommandType.ChatInput,
        options: [{ 
            name: 'member',
            description: 'the member to timeout in the server',
            type: ApplicationCommandOptionType.User
        }]
     },
     opt: {
        userPermissions: ['MuteMembers'],
        botPermissions: ["SendMessages", 'MuteMembers'],
        cooldown: 3,
        ownerOnly: false,
        disabled: false,
      },
     execute: async (client, interaction: ChatInputCommandInteraction<'cached'>) => {
        const member = interaction.options.getMember('member')

        console.log(member)
        
     }
})