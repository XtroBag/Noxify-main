import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  TimestampStyles,
  time,
} from "discord.js";
import { SlashCommand } from "../../../types/classes/slash.js";
import { Emojis } from "../../../../config/config.js";

export default new SlashCommand({
  data: {
    name: "afk",
    description: "set yourself afk inside the guild",
    options: [
      {
        name: "reason",
        description: "The reason you are going afk in the server",
        type: ApplicationCommandOptionType.String,
        required: true,
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
  execute: async (
    client,
    interaction: ChatInputCommandInteraction<'cached'>
  ) => {
    const reason = interaction.options.getString("reason");

    const data = await client.db.afk.findUnique({
      where: {
        guildID_userID: {
          // try and fix this weird shit going on with the "guildID_userID" to be their own thing.
          guildID: interaction.guild.id,
          userID: interaction.member.id,
        },
      },
    });

    if (data) {
      return interaction.reply({
        embeds: [
          client.embeds.general(
            { description: `${Emojis.Wrong} You are already afk in this server` },
          ),
        ],
      });
    } else {
      await client.db.afk.create({
        data: {
          guildID: interaction.guild.id,
          userID: interaction.member.id,
          reason: reason,
          timestamp: time(interaction.createdAt, TimestampStyles.RelativeTime),
          mentions: 0
        },
      });

      await interaction.reply({
        embeds: [
          client.embeds.general(
            { description: `${Emojis.Correct} Added you too the database` },
          ),
        ],
      });
    }
  },
});
