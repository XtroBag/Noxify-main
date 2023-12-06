import { ApplicationCommandOptionType } from "discord.js";
import { SlashCommand } from "../../../custom/classes/bot/slash.js";

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
    userPerms: ['Administrator'],
    botPerms: [],
    cooldown: 3,
    ownerOnly: false,
    disabled: false,
  },
  execute: async ({ client, interaction }) => {
    const symbol = interaction.options.getString("symbol");

    const test = new Array<boolean>(true, false, false, true, false)
    console.log(test)

    const database = await client.db.guild.findUnique({
      where: {
        guildID: interaction.guildId,
      },
      include: {
        settings: true,
      },
    });

    if (database.settings.textcmds === false) {
      interaction.reply({
        content: `Please enable text commands to use this feature`,
      });
    } else {
      if (database.prefix !== symbol) {
        // prefix updated
        await client.db.guild.update({
          where: {
            guildID: interaction.guildId,
          },
          data: {
            prefix: symbol,
          },
        });

        interaction.reply({ content: `Changed prefix: ${symbol}` });
      } else {
        // prefix not updated
        interaction.reply({
          content: "Prefix is already that symbol pick something else",
        });
      }
    }
  },
});