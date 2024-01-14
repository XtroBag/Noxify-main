import {
  AutoModerationRuleTriggerType,
  APISelectMenuOption,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ComponentType,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { Button } from "../../Custom/Classes/Bot/Button.js";
import { Colors } from "../../Custom/Enums/Colors.js";

export const map = new Map<string, ActionRowBuilder<ButtonBuilder>>();

export default new Button({
  data: {
    customId: "add-rule",
  },
  run: async ({ client, interaction }) => {
    const options = Object.keys(AutoModerationRuleTriggerType)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({ label: key, value: key } as APISelectMenuOption));

    const prompt = await interaction.update({
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.Normal)
          .setDescription("Please select a trigger type for automod"),
      ],
      components: [
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("trigger-type")
            .setOptions(options)
            .setMaxValues(1)
            .setMinValues(1)
        ),
      ],
    });

    const menu = await prompt.awaitMessageComponent({
      componentType: ComponentType.StringSelect,
      filter: ({ user }) => user.id === interaction.user.id,
    });

    const type = menu.values.toString();

    switch (type) {
      case "Keyword":
        // database call with trigger type value
        client.db.guild.update({
          where: {
            guildID: interaction.guildId,
          },
          data: {
            /* Data to update here */
          },
        });

        const buttons = new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder()
            .setCustomId("bypass-list")
            .setLabel("Bypass")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("filter-list")
            .setLabel("Filter")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("finished")
            .setLabel("Finish")
            .setStyle(ButtonStyle.Secondary)
        );

        map.set("keywordButtons", buttons);

        await menu.update({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Normal)
              .setDescription("Use the buttons to setup more information"),
          ],
          components: [buttons],
        });

        // continue by making the different button files for each button above. ✅
        // then setup modals inside those buttons file to listen for each response. ✅
        // and next make the buttons disable after the button was clicked to show the user is done. ✅
        // but then continue with rest... etc 

        break;

      case "KeywordPreset":
        break;

      case "Spam":
        break;

      case "MentionSpam":
        break;
    }
  },
});
