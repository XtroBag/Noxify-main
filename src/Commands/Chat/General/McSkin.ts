import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { SlashCommand } from "../../../Custom/Classes/Bot/Slash.js";
import { RenderCrops } from "../../../Custom/Enums/RenderCrops.js";
import { RenderTypes } from "../../../Custom/Enums/RenderTypes.js";
import { fetchSkinRender } from "../../../Functions/FetchSkinRender.js";
import { Colors } from "../../../Custom/Enums/Colors.js";

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
        .setFooter({
          text: `${name.includes(".") ? "Bedrock Edition" : "Java Edition"}`,
        })
        .setTimestamp();

      const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
        Object.keys(RenderCrops)
          .filter((name) => name !== "Default" && name !== "Processed")
          .map((type) =>
            new ButtonBuilder()
              .setCustomId(type)
              .setLabel(type)
              .setStyle(ButtonStyle.Secondary)
          )
      );

      await interaction.reply({ embeds: [embed], components: [buttons] });
    }
  },
});
