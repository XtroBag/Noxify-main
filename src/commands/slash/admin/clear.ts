import { SlashCommand } from "../../../types/classes/slash.js";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChatInputCommandInteraction,
} from "discord.js";

export default new SlashCommand({
  data: {
    name: "clear",
    description: "clear messages from the channel",
    type: ApplicationCommandType.ChatInput,
    options: [
      {
        name: "amount",
        description: "the amount of messages you wanna delete",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
    ],
  },
  opt: {
    botPermissions: ["ManageChannels", "ManageMessages"],
    userPermissions: ["ManageMessages"],
    cooldown: 5,
    disabled: false,
    ownerOnly: false,
  },

  execute: async (
    client,
    interaction: ChatInputCommandInteraction<"cached">
  ) => {
    const amount = interaction.options.getNumber("amount");

    if (amount > 100) {
      return await interaction.reply({
        content: "you cannot delete more then 100 messages at a time",
      });
    }

   const deleted = await interaction.channel.bulkDelete(amount)

   return await interaction.reply({ content: `Removed ${deleted.size} messages from this channel`})
  },
});
