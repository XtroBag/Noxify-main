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
      }
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
    interaction: ChatInputCommandInteraction<"cached">
  ) => {
    // const change = interaction.options.getBoolean("edit");
    const reason = interaction.options.getString("reason");


      // await client.db.guild.update({
      //   where: {
      //     id: interaction.guildId,
      //   },
      //   data: {
      //     afk: {
      //       update: {
      //         where: {
      //           userID: interaction.user.id,
      //         },
      //         data: {
      //           reason: reason,
      //         },
      //       },
      //     },
      //   },
      // });

      await client.db.guild.update({
        where: {
          guildID: interaction.guildId,
        },
        data: {
          afk: {
            create: {
              reason: reason,
              userID: interaction.user.id,
            },
          },
        },
      });

      await interaction.reply({ content: "Added you to the afk array" })
    
  },
});
