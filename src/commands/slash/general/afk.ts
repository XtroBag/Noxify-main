import { ActionRowBuilder, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { SlashCommand } from "../../../types/classes/slash.js";

export default new SlashCommand({
  data: {
    name: "afk",
    description: "go afk globally",
  },
  opt: {
    userPermissions: ["SendMessages"],
    botPermissions: ["SendMessages"],
    cooldown: 3,
    ownerOnly: false,
    disabled: false,
  },
  execute: async (client, interaction: ChatInputCommandInteraction<'cached'>) => {

    const modal = new ModalBuilder()
    .setTitle('Go afk inside the guild')
    .setCustomId('afk-modal')
    .setComponents(
        new ActionRowBuilder<TextInputBuilder>({
            components: [
                new TextInputBuilder()
                .setLabel('Reason')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Please provide a reason')
                .setRequired(true)
                .setCustomId('afk-reason')
            ]
        })
    )

   await interaction.showModal(modal)

   // code continues in "interactionCreate.ts"

  },
});
