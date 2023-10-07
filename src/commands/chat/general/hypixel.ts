import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../../../custom/classes/bot/slash.js";
import { getHead, minecraftUser } from "../../../functions/mcinfo.js";
import { Client } from "hypixel-api-reborn";
import { Colors } from "../../../enums/colors.js";

export default new SlashCommand({
  data: {
    name: "hypixel",
    description: "lookup hypixel information abuot",
    options: [
      {
        name: "name",
        description: "the name of the minecraft user",
        type: ApplicationCommandOptionType.String,
      },
    ],
  },
  opt: {
    userPermissions: ["SendMessages"],
    botPermissions: ["SendMessages"],
    cooldown: 3,
    ownerOnly: false,
    disabled: false,
  },
  execute: async (client, interaction) => {
    const name = interaction.options.getString("name");
    const user = await minecraftUser(name);

    /*
        maybe make embed page system to show stats of each game
    */

    const hypixel = new Client('6588e21a-da30-45b2-b859-de65a89499e7')

    const player = await hypixel.getPlayer(user.name, { guild: true });

    const embed = new EmbedBuilder()
    .setTitle(`${player.nickname}'s information`)
    .setDescription('Welcome to this profile')
    .setThumbnail(getHead(user.name))
    .setFields([
        {
            name: 'General:',
            value: `
            Rank: \`\`${player.rank}\`\`
            plusColor: ${player.plusColor || 'Normal'}
            Karma: ${player.karma}
            Level: ${Math.trunc(player.level)}
            Chat: ${player.channel.toLowerCase()}
            Joined: <t:${Math.floor(player.firstLoginTimestamp / 1000)}:d>
            RecentlyPlayed: ${player.recentlyPlayedGame.name}
            `
        }
    ])
    .setColor(Colors.Normal)
    .setTimestamp()
    
    interaction.reply({ embeds: [embed] })


  },
});
