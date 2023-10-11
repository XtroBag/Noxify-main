import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../../../custom/classes/bot/slash.js";
import { hypixel } from "../../../functions/mcinfo.js";
import axios from "axios";
import { Emojis } from "../../../enums/emojis.js";
import { Colors } from "../../../enums/colors.js";

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

    await axios
      .get(`https://api.mojang.com/users/profiles/minecraft/${name}`)
      .then(async ({ data }) => {
        try {
          const player = await hypixel.getPlayer(data.name);

          const embed = new EmbedBuilder()
            .setTitle(`${player.nickname}'s information`)
            .setDescription("Welcome to this profile")
            .setThumbnail(`https://mc-heads.net/avatar/${data.name}`)
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

          console.log(err)

          interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `${Emojis.Wrong} Player never joined hypixel before`
                )
                .setColor(Colors.Normal),
            ],
          });
        }
      })
      .catch((err) => {
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`${Emojis.Wrong} Wasn't able to find that user`)
              .setColor(Colors.Normal),
          ],
        });

        console.log(err);
      });
  },
});
