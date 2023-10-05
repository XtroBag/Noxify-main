import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../../../types/classes/slash.js";
import { BadgeEmojis, Colors, Emojis } from "../../../../config/config.js";

export default new SlashCommand({
  data: {
    name: "user",
    description: "lookup information about discord users/bots",
    options: [
        {
            name: 'search',
            description: 'the member/bot you wanna search for',
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ]
  },
  opt: {
    userPermissions: ["SendMessages"],
    botPermissions: ["SendMessages"],
    cooldown: 3,
    ownerOnly: false,
    disabled: false,
  },
  execute: async (client, interaction) => {
    const member = interaction.options.getMember('search');
    const user = interaction.options.getUser('search');

    if (!member) {
        const embed = new EmbedBuilder()
        .setAuthor({ name: user.globalName, iconURL: user.avatarURL({ extension: 'png' })})
        .setDescription('This embed is for users and this user is not inside the guild')
        .setColor(Colors.Normal)

       return await interaction.reply({ embeds: [embed] });
    }

    if (member.user.bot) {
        // if the member (searched person) is a bot do this
        const verified = member.user.flags.has('VerifiedBot');

        const embed = new EmbedBuilder()
        .setAuthor({ name: `${member.user.username}`, iconURL: user.avatarURL({ extension: 'png' })})
        .setDescription(`
            Name: ${member.user.username}
            Verified: ${verified ? BadgeEmojis.VerifiedBot : Emojis.Wrong }
            `)
        .setColor(Colors.Normal)

        return await interaction.reply({ embeds: [embed] });

    } else {
        // if the member (searched person) is not a bot do this
    }
  },
});
