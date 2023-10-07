import {
  ApplicationCommandOptionType,
  TimestampStyles,
  time,
} from "discord.js";
import { SlashCommand } from "../../../custom/classes/bot/slash.js";
import { Emojis } from "../../../enums/emojis.js";

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
  execute: async (client, interaction) => {
    const reason = interaction.options.getString("reason");
  
    const data = await client.db.afk.findUnique({ 
      where: {
        guildID: interaction.guildId,
        userID: interaction.member.id
      }
    })

    if (data) {
       interaction.reply({
        content: `${Emojis.Wrong} You are already afk in this server`
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
        content: `${Emojis.Correct} Added you too the database`
      });
    }
  },
});
