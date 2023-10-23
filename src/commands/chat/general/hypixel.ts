import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../../../custom/classes/bot/slash.js";
import { MCUser, hypixel } from "../../../functions/mojang.js";
import { Colors } from "../../../custom/enums/colors.js";
import { Emojis } from "../../../custom/enums/emojis.js";

/*
  TODO: maybe make embed page system to show stats of each game
*/

export default new SlashCommand({
  data: {
    name: "hypixel",
    description: "lookup hypixel information abuot",
    options: [
      {
        name: "name",
        description: "the name of the minecraft user",
        type: ApplicationCommandOptionType.String,
        required: true
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
    await interaction.deferReply();

    const name = interaction.options.getString("name");

    try {
      const user = await MCUser(name)
      const player = await hypixel.getPlayer(user.name, { guild: true });

      const embed = new EmbedBuilder()
        .setTitle(`${player.nickname}'s information`)
        .setDescription("Welcome to this profile")
        .setThumbnail(`https://mc-heads.net/avatar/${user.name}`)
        .setFields([
          {
            name: "General:",
            value: `
            Rank: \`\`${player.rank}\`\`
            Online: ${player.isOnline ? 'yes' : 'no'}
            PlusColor: ${player.plusColor || "Normal"}
            Karma: ${player.karma}
            Level: ${Math.trunc(player.level)}
            Chat: ${player?.channel || "ALL"}
            Joined: <t:${Math.floor(player.firstLoginTimestamp / 1000)}:d>
            RecentlyPlayed: ${player?.recentlyPlayedGame?.name ?? "None"}
            `,
          },
        ])
        .setColor(Colors.Normal)
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

    } catch (err) {
      interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `${Emojis.Wrong} Can't find a user with that name`
          )
          .setColor(Colors.Error),
      ],
    });
    }




  }
})
