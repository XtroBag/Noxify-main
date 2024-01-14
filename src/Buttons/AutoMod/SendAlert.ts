import { ActionRowBuilder, ButtonStyle, ChannelSelectMenuBuilder, ChannelType, ComponentType, EmbedBuilder } from "discord.js";
import { Button } from "../../Custom/Classes/Bot/Button.js";
import { Colors } from "../../Custom/Enums/Colors.js";
  import { map } from "./AddRule.js";

export default new Button({
  data: {
    customId: "send-alert",
  },
  run: async ({ client, interaction }) => {

   const response = await interaction.update({
      components: [
        new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
          new ChannelSelectMenuBuilder()
          .setCustomId('custom')
          .setChannelTypes([ChannelType.GuildText])
        ),
      ],
      embeds: [new EmbedBuilder().setColor(Colors.Normal).setDescription('Please select the actions to take on execution')]
    });

    const menu = await response.awaitMessageComponent({
        componentType: ComponentType.ChannelSelect,
        filter: ({ user }) => user.id === interaction.user.id,
      });

      /* const value = */menu.values.toString()
      // put channel id into database

     map.get('finishedButtons').components[1].setDisabled(true).setStyle(ButtonStyle.Success)
     menu.update({ components: [map.get("finishedButtons")] });
  },
});
