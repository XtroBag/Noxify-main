import { ApplicationCommandOptionType, EmbedBuilder, codeBlock } from "discord.js";
import { SlashCommand } from "../../../custom/classes/bot/slash.js";
import { MCUser } from "../../../functions/mojang.js";
import { Colors } from "../../../custom/enums/colors.js";
import { Emojis } from "../../../custom/enums/emojis.js";

export default new SlashCommand({
  data: {
    name: "minecraft",
    description: "lookup a minecraft user by name",
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
    userPerms: [],
    botPerms: [],
    cooldown: 3,
    ownerOnly: false,
    disabled: false,
  },
  execute: async ({ client, interaction }) => {

    const name = interaction.options.getString("name");

    try {
      const user = await MCUser(name)

     await interaction.reply({ content: codeBlock('json', JSON.stringify(user, null, 2))})
     

    } catch (err) {
      interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `${Emojis.Wrong} Can't find a user with that name`
          )
          .setColor(Colors.Error),
      ],
    });
    }

  }
})
