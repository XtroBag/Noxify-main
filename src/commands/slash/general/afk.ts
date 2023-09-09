import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
} from "discord.js";
import { SlashCommand } from "../../../types/classes/slash.js";

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
      {
        name: "edit",
        description: "Choose too edit you're afk reason",
        type: ApplicationCommandOptionType.Boolean,
        required: true
      },
    ],
  },
  opt: {
    userPermissions: ["SendMessages"],
    botPermissions: ["SendMessages"],
    cooldown: 3,
    ownerOnly: false,
    disabled: true,
  },
  execute: async (
    client,
    interaction: ChatInputCommandInteraction<"cached">
  ) => {
    const change = interaction.options.getBoolean("edit");
    const reason = interaction.options.getString("reason");

    if (change === true) {
      await client.db.guild.update({
        where: {
          id: interaction.guildId,
        },
        data: {
          afkMembers: {
            update: {
              where: {
                userID: interaction.user.id,
              },
              data: {
                reason: reason,
              },
            },
          },
        },
      });

      await interaction.reply({ content: 'set you afk in this guild' })
    } else {
      await client.db.guild.update({
        where: {
          id: interaction.guildId,
        },
        data: {
          afkMembers: {
            create: {
              reason: reason,
              userID: interaction.user.id,
            },
          },
        },
      });

      await interaction.reply({ content: "Updated the reason for why you're afk" })
    }
  },
});
