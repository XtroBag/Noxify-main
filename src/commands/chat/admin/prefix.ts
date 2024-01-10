import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../../../Custom/Classes/Bot/Slash.js";
import { Colors } from "../../../Custom/Enums/Colors.js";

export default new SlashCommand({
  data: {
    name: "prefix",
    description: "Set a prefix for text commands",
    options: [
      {
        name: "symbol",
        description: "pick a symbol to use for text commands",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
  opt: {
    userPerms: ["Administrator"],
    botPerms: [],
    cooldown: 3,
    ownerOnly: false,
    disabled: false,
  },
  execute: async ({ client, interaction }) => {
    const symbol = interaction.options.getString("symbol") ?? '';
    
    const database = await client.db.guild.findUnique({
      where: {
        guildID: interaction.guildId,
      },
    });

    if (symbol.length > 3) {
      return await interaction.reply({
        embeds: [new EmbedBuilder().setDescription(`Prefix needs to be less then 3 characters long`).setColor(Colors.Normal)]
      })
    }

    if (database?.prefix !== symbol) {
      // prefix updated
      await client.db.guild.update({
        where: {
          guildID: interaction.guildId,
        },
        data: {
          prefix: symbol,
        },
      });

     return await interaction.reply({
        embeds: [
          new EmbedBuilder().setDescription(`New Prefix: \`\`${symbol}\`\``).setColor(Colors.Normal),
        ],
      });
    } else {
      // prefix not updated
     return await interaction.reply({
        embeds: [
          new EmbedBuilder().setDescription(
            `Prefix is already that symbol pick something else`
          ).setColor(Colors.Normal)
        ],
      });
    }
  },
});
