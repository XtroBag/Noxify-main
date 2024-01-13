import {
  APISelectMenuOption,
  ActionRowBuilder,
  AutoModerationRuleTriggerType,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  ModalBuilder,
  StringSelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { SlashCommand } from "../../../Custom/Classes/Bot/Slash.js";
import { Colors } from "../../../Custom/Enums/Colors.js";

export default new SlashCommand({
  data: {
    name: "automod",
    description: "Setup automod rules & features",
    options: [],
  },
  opt: {
    userPerms: ["Administrator"],
    botPerms: [],
    cooldown: 3,
    ownerOnly: false,
    disabled: false,
  },
  execute: async ({ client, interaction }) => {
    /*
    CURRENT ISSUES:
    There can sometimes be a "unknown interaction" error while hitting certain buttons on the "bypass" & "filter" page
    */

    // the main embed
    const main = new EmbedBuilder()
      .setColor(Colors.Normal)
      .setDescription("Setup and modify rules for your guild");

    // the button action row
    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId("add-rule")
        .setLabel("Add")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("list-rules")
        .setLabel("List")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("remove-rule")
        .setLabel("Remove")
        .setStyle(ButtonStyle.Danger)
    );

    // first main interaction reply
    const response = await interaction.reply({
      embeds: [main],
      components: [row],
    });

    // the collector to get all button data
    const collector = response.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter: ({ user }) => user.id === interaction.user.id,
    });

    // the main collector event listening to all the buttons
    collector.on("collect", async (button) => {
      switch (button.customId) {
        case "add-rule":
          await button.deferUpdate();

          // the options to set for the menu
          const options = Object.keys(AutoModerationRuleTriggerType)
            .filter((key) => isNaN(Number(key)))
            .map((key) => ({ label: key, value: key } as APISelectMenuOption));

          // send the menu to pick the rule trigger type
          const promptOne = await button.editReply({
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

          // listen for the resposne from the menu
          const firstMenu = await promptOne.awaitMessageComponent({
            componentType: ComponentType.StringSelect,
            filter: ({ user }) => user.id === interaction.user.id,
          });

          // firstMenu.values

          switch (firstMenu.values.toString()) {
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


              const keywordButtons =
                new ActionRowBuilder<ButtonBuilder>().setComponents(
                  new ButtonBuilder()
                    .setCustomId("bypass-list")
                    .setLabel("Bypass")
                    .setStyle(ButtonStyle.Success),
                  new ButtonBuilder()
                    .setCustomId("filter-list")
                    .setLabel("Filter")
                    .setStyle(ButtonStyle.Primary),
                  new ButtonBuilder()
                    .setCustomId("finished-button")
                    .setLabel("Finished")
                    .setStyle(ButtonStyle.Secondary)
                );

              const keywordUpdate = await firstMenu.update({
                embeds: [
                  new EmbedBuilder()
                    .setColor(Colors.Normal)
                    .setDescription(
                      "Use the button on what you wanna setup first"
                    ),
                ],
                components: [keywordButtons],
              });

              const collector = keywordUpdate.createMessageComponentCollector({
                componentType: ComponentType.Button,
                filter: ({ user }) => user.id === interaction.user.id,
              });

              collector.on("collect", async (interaction) => {
                if (interaction.customId === "bypass-list") {
                  const modal = new ModalBuilder()
                    .setCustomId("bypass-modal")
                    .setTitle("Bypass Words")
                    .addComponents(
                      new ActionRowBuilder<TextInputBuilder>().addComponents(
                        new TextInputBuilder()
                          .setCustomId("bypass-words")
                          .setLabel("Pick words with a comma to seperate")
                          .setStyle(TextInputStyle.Paragraph)
                      )
                    );

                  await interaction.showModal(modal);

                  const modalInteraction = await interaction.awaitModalSubmit({
                    time: 3000000,
                    filter: ({ user }) => user.id === interaction.user.id,
                  });

                  if (modalInteraction.customId === "bypass-modal") {
                    /*const words =*/ modalInteraction.fields.getTextInputValue(
                      "bypass-words"
                    );

                    // send words data into the database object

                    modalInteraction.deferUpdate();

                    keywordButtons.components[0].setDisabled(true);
                    interaction.editReply({ components: [keywordButtons] });
                  }
                } else if (interaction.customId === "filter-list") {
                  const modal = new ModalBuilder()
                    .setCustomId("filter-modal")
                    .setTitle("Filter Words")
                    .addComponents(
                      new ActionRowBuilder<TextInputBuilder>().addComponents(
                        new TextInputBuilder()
                          .setCustomId("filter-words")
                          .setLabel("Pick words with a comma to seperate")
                          .setStyle(TextInputStyle.Paragraph)
                      )
                    );

                  await interaction.showModal(modal);

                  const modalInteraction = await interaction.awaitModalSubmit({
                    time: 3000000,
                    filter: ({ user }) => user.id === interaction.user.id,
                  });

                  if (modalInteraction.customId === "filter-modal") {
                    /*const words =*/ modalInteraction.fields.getTextInputValue(
                      "filter-words"
                    );

                    modalInteraction.deferUpdate();

                    keywordButtons.components[1].setDisabled(true);
                    interaction.editReply({ components: [keywordButtons] });
                  }

                } else if (interaction.customId === "finished-button") {
                  interaction.update({ embeds: [main], components: [row] });
                }
              });

              break;

            case "KeywordPreset":
              console.log("Type: KeywordPreset");
              break;

            case "Spam":
              console.log("Type: Spam");
              break;

            case "MentionSpam":
              console.log("Type: MentionSpam");
              break;
          }

          // make and save data to database then then on "automodrulecreateevent" was fired then tell database to delete it since it was created.

          break;

        case "list-rules":
          // show data about how many rules are currently in the guild setup and other information
          break;

        case "remove-rule":
          break;
      }
    });
  },
});
