import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../../../Custom/Classes/Bot/Slash.js";
import { BadgeEmoji } from "../../../Custom/Enums/Badges.js";
import { Colors } from "../../../Custom/Enums/Colors.js";

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
    userPerms: [],
    botPerms: [],
    cooldown: 3,
    ownerOnly: false,
    disabled: false,
  },
  execute: async ({ client, interaction }) => {
    const member = interaction.options.getMember('search');
    const user = interaction.options.getUser('search');

    if (!member) {
        const embed = new EmbedBuilder()
        .setAuthor({ name: user.globalName, iconURL: user.avatarURL({ extension: 'png' })})
        .setDescription('This embed is for users and this user is not inside the guild')
        .setColor(Colors.Normal)

        await interaction.reply({ embeds: [embed] });
    }

    if (member.user.bot) {
        // if the member (searched person) is a bot do this
        const verified = member.user.flags.has('VerifiedBot');

        const embed = new EmbedBuilder()
        .setAuthor({ name: `${member.user.username}`, iconURL: user.avatarURL({ extension: 'png' })})
        .setDescription(`
            Name: ${member.user.username}
            Verified: ${verified ? BadgeEmoji.VerifiedBot : 'Normal bot tag here' }
            `)
        .setColor(Colors.Normal)

        await interaction.reply({ embeds: [embed] });

    } else {
        // if the member (searched person) is not a bot do this
    }
  },
});
