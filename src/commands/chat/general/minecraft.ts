import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../../../custom/classes/bot/slash.js";
import { RenderCrops } from "../../../custom/interfaces/RenderCrops.js";
import { RenderTypes } from "../../../custom/interfaces/RenderTypes.js";
import { fetchSkinRender } from "../../../functions/fetchSkinRender.js";
import { Colors } from "../../../custom/enums/colors.js";

export default new SlashCommand({
  data: {
    name: "mcskin",
    description: "lookup a minecraft user by name",
    options: [
      {
        name: "name",
        description: `Java: {username} | Bedrock: .{username}`,
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "render",
        description: "The render type",
        type: ApplicationCommandOptionType.String,
        autocomplete: true,
        required: true,
      },
      {
        name: "cape",
        description: "Show the cape on the skin render",
        type: ApplicationCommandOptionType.Boolean,
        required: false,
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
  autocomplete: async ({ client, interaction, option }) => {
    if (option.name === "render") {
      return Object.keys(RenderTypes)
        .filter((choice) => choice.startsWith(option.value))
        .map((choice) => ({ name: choice, value: choice }));
    }
  },
  execute: async ({ client, interaction }) => {
    /*
    Notes: Maybe add buttons to have options to get the 3 different types: 
    Full,
    Bust,
    Face,
    Head
    */

    const name = interaction.options.getString("name");
    const render = interaction.options.getString("render");
    const cape = interaction.options.getBoolean("cape") || false;

    const skin = await fetchSkinRender(name, {
      crop: RenderCrops.Full,
      type: RenderTypes[render],
      model: {
        capeEnabled: cape,
      },
    });

    if (!skin.success) {
      interaction.reply({
        content: "Sorry, There was a problem getting this skin",
      });
      return;
    } else {
      const { url } = skin;

      const embed = new EmbedBuilder()
        .setImage(url)
        .setColor(Colors.Normal)
        .setFooter({ text: `${name.includes(".") ? "Bedrock" : "Java"}` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }
  },
});