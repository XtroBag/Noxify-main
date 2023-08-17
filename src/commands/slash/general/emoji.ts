import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
} from "discord.js";
import { SlashCommand } from "../../../types/classes/slash.js";

export default new SlashCommand({
  data: {
    name: "emoji",
    description: "add a emoji to the server",
    options: [
      {
        name: "emoji",
        description: "the emoji file you wanna upload",
        type: ApplicationCommandOptionType.Attachment,
        required: true,
      },
      {
        name: "name",
        description: "the name you want to set for the emoji",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
  opt: {
    userPermissions: ["ManageGuildExpressions"],
    botPermissions: ["SendMessages", "ManageGuildExpressions"],
    cooldown: 3,
    ownerOnly: false,
    disabled: false,
  },
  execute: async (client, interaction: ChatInputCommandInteraction<'cached'>) => {
    const emoji = interaction.options.getAttachment("emoji");
    const name = interaction.options.getString("name");

    const file = emoji.url
      .substring(emoji.url.lastIndexOf(".") + 1)
      .toLowerCase();

    if (file === "png" || file === "jpg" || file === "gif") {
      await interaction.guild.emojis
        .create({
          attachment: emoji.url,
          name: name,
        })
        .catch(() => {
          return;
        });

      await interaction.reply({
        embeds: [
          client.embeds.slashResponse(
            { description: `Added the emoji \`\`${name}\`\` to the server` },
            interaction
          ),
        ],
      });
    } else {
      await interaction.reply({
        embeds: [
          client.embeds.errorResponse(
            { description: "Wrong type of file has been uploaded" },
            interaction
          ),
        ],
      });
    }
  },
});
