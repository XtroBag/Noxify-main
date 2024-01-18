import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../../../Custom/Classes/Bot/Slash.js";
import { RenderCrops } from "../../../Custom/Enums/RenderCrops.js";
import { RenderTypes } from "../../../Custom/Enums/RenderTypes.js";
import { fetchSkinRender } from "../../../Functions/FetchSkinRender.js";
import { Colors } from "../../../Custom/Enums/Colors.js";
import { UppercaseWord } from "../../../Functions/UppercaseWord.js";

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
  autocomplete: ({ client, interaction, option }) => {
    if (option.name === "render") {
      const data = Object.entries(RenderTypes).map(([key, value]) => ({
        name: key,
        value: value,
      }));

      return data;
    }
  },
  execute: async ({ client, interaction }) => {
    const name = interaction.options.getString("name");
    const render = interaction.options.getString("render");
    const cape = interaction.options.getBoolean("cape") || false;

    const type = UppercaseWord(render);

    const skin = await fetchSkinRender(name, {
      crop: RenderCrops.Full,
      type: RenderTypes[type],
      model: {
        capeEnabled: cape,
      },
    });

    if (skin.success === false) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Normal)
            .setDescription("Unable to find this user with the name provided"),
        ],
      });
    }

    if (skin.success) {
      const { url } = skin;

      const embed = new EmbedBuilder()
        .setImage(url)
        .setColor(Colors.Normal)
        .setFooter({
          text: `${name.includes(".") ? "Bedrock Edition" : "Java Edition"}`,
        })
        .setTimestamp();

      // const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      //   Object.keys(RenderCrops)
      //     .filter((name) => name !== "Default" && name !== "Processed")
      //     .map((type) =>
      //       new ButtonBuilder()
      //         .setCustomId(type + "-button")
      //         .setLabel(type)
      //         .setStyle(ButtonStyle.Secondary)
      //     )
      // );

      await interaction.reply({ embeds: [embed] });
    }
  },
});
