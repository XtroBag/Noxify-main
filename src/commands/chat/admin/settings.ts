import {
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { SlashCommand } from "../../../custom/classes/bot/slash.js";
import { ActionRowBuilder } from "@discordjs/builders";
import { Colors } from "../../../custom/enums/colors.js";

export default new SlashCommand({
  data: {
    name: "settings",
    description: "Settings for the guild to edit",
    options: [],
  },
  opt: {
    userPerms: ['Administrator'],
    botPerms: [],
    cooldown: 3,
    ownerOnly: false,
    disabled: false,
  },
  execute: async ({ client, interaction }) => {
    const mainembed = new EmbedBuilder()
      .setDescription("Select Systems you wanna be enabled")
      .setColor(Colors.Normal);

    const mainmenu =
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents([
        new StringSelectMenuBuilder()
          .setCustomId("settings-menu")
          .setPlaceholder("pick settings to be enabled")
          .setOptions([
            new StringSelectMenuOptionBuilder()
              .setLabel("Text Commands")
              .setDescription("Enable text commands for the guild to use")
              .setValue("txt-cmds"),
          ]),
      ]);

    const reply = await interaction.reply({
      embeds: [mainembed],
      components: [mainmenu],
    });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      filter: ({ user }) => user.id === interaction.user.id,
    });

    collector.on("collect", async (menu) => {
      switch (menu.customId) {
        case "settings-menu":
          const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId("enable-button")
              .setLabel("Enable")
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId("disable-button")
              .setLabel("Disable")
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setCustomId("back-button")
              .setLabel("Back")
              .setStyle(ButtonStyle.Secondary)
          );

          const buttonPress = await menu.update({ components: [buttons] });

          const collector = buttonPress.createMessageComponentCollector({
            componentType: ComponentType.Button,
            filter: ({ user }) => user.id === interaction.user.id,
          });

          collector.on("collect", async (button) => {
            switch (button.customId) {
              case "enable-button":
                buttons.components[1].setDisabled(false);
                buttons.components[0].setDisabled(true);

                button.update({ components: [buttons] });
                break;

              case "disable-button":
                buttons.components[0].setDisabled(false);
                buttons.components[1].setDisabled(true);

                button.update({ components: [buttons] });
                break;

              case "back-button": 
             /*const updated =*/ await button.update({ embeds: [mainembed], components: [mainmenu] })

            // const collector = updated.createMessageComponentCollector({
            //   componentType: ComponentType.StringSelect,
            //   filter: ({ user }) => user.id === interaction.user.id,
            //  })

            //  collector.on('collect', async (menu) => {
            //     if (menu.customId === 'settings-menu') {
                  
            //     }
            //  })
              break;
            }
          });
          break;
      }
    });
  },
});
