import { ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction } from "discord.js";
import { SlashCommand } from "../../../types/classes/slash.js";
import ms from "ms";


export default new SlashCommand({
    data: {
        name: 'timeout',
        description: 'timeout a user in the server',
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: 'member',
                description: 'the member to timeout in the server',
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: 'time',
                description: 'the amount of time for the user to be muted',
                type: ApplicationCommandOptionType.String,
                choices: [
                    { name: '5 Minutes', value: `${ms('5m')}` },
                    { name: '10 Minutes', value: `${ms('10m')}` },
                    { name: '15 Minutes', value: `${ms('15m')}` },
                    { name: '30 Minutes', value: `${ms('30m')}` },
                    { name: '1 Hour', value: `${ms('1h')}` }
                ],
                required: true
            }
        ]
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
        const time = interaction.options.getString('time')

       interaction.reply({ content: `Member: ${member.user.globalName}\nTime: ${time}`})

    }
})