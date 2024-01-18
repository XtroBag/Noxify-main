import {
  ActionRowBuilder,
  ChannelSelectMenuBuilder,
  ChannelType,
  ComponentType,
  EmbedBuilder,
  RoleSelectMenuBuilder,
} from "discord.js";
import { Button } from "../../Custom/Classes/Bot/Button.js";
import { Colors } from "../../Custom/Enums/Colors.js";

export default new Button({
  data: {
    customId: "finished-action-types",
  },
  run: async ({ client, interaction, map }) => {
    const channelSelect =
      new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
        new ChannelSelectMenuBuilder()
          .setCustomId("exempt-channels")
          .setChannelTypes([ChannelType.GuildText])
          .setPlaceholder("Select channels to be exempt from automod")
          .setMaxValues(25)
      );

    const roleSelect =
      new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
        new RoleSelectMenuBuilder()
          .setCustomId("exempt-roles")
          .setPlaceholder("Select roles to be exempt from automod")
          .setMaxValues(20)
      );

    const response = await interaction.update({
      components: [channelSelect, roleSelect],
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.Normal)
          .setDescription("Please select roles and channels that can bypass"),
      ],
    });

    const channelMenu = await response.awaitMessageComponent({
      componentType: ComponentType.ChannelSelect,
      filter: ({ user }) => user.id === interaction.user.id,
    });

    if (channelMenu.customId === "exempt-channels") {
      // const channels = channelMenu.values;
      // save "channels" to the database

      channelSelect.components[0].setDisabled(true);
      await channelMenu.update({ components: [channelSelect, roleSelect] });
    }

    const roleMenu = await response.awaitMessageComponent({
      componentType: ComponentType.RoleSelect,
      filter: ({ user }) => user.id === interaction.user.id,
    });

    if (roleMenu.customId === "exempt-roles") {
      // const roles = roleMenu.values;
      // save "roles" to the database

      roleSelect.components[0].setDisabled(true);
     await roleMenu.update({ components: [channelSelect, roleSelect] })

    }

    await interaction.editReply({ components: [map.get('mainPage')] });
    // data to save into the database for the automod rule

    // go back to the main menu here.
  },
});
