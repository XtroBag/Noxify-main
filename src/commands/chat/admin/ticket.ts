import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  ChannelType,
  ComponentType,
  EmbedBuilder,
  ModalBuilder,
  StringSelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle,
  codeBlock,
} from "discord.js";
import { SlashCommand } from "../../../custom/classes/bot/slash.js";
import { Colors } from "../../../enums/colors.js";

export default new SlashCommand({
  data: {
    name: "ticketmenu",
    description: "set yourself afk inside the guild",
    options: [
      {
        name: "option",
        description: "Select a action you need below",
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: "Create",
            value: "create",
          },
          {
            name: "Delete",
            value: "delete",
          },
        ],
        required: true,
      },
    ],
  },
  opt: {
    userPermissions: ["Administrator"], // maybe double think about this perm
    botPermissions: ["ManageChannels"],
    cooldown: 3,
    ownerOnly: false,
    disabled: false,
  },
  execute: async (client, interaction) => {
    /*
    
    UPDATE: 
    how the system finds the data by something else because i want more then 1 user to create a menu for a server
    make it so you can also save a emoji for the choice in the database but make sure to check if it's custom and deny adding if it is.

    */

    const option = interaction.options.getString("option");

    switch (option) {
      case "create":
        const embed = new EmbedBuilder()
          .setTitle("TicketMenu Setup")
          .setDescription(
            "Below you can use the buttons to setup a new ticketmenu"
          )
          .setColor(Colors.Normal);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setLabel("Create")
            .setCustomId("create-prompt-button")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setLabel("Question")
            .setCustomId("question-prompt-button")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setLabel("Finish")
            .setCustomId("finish-prompt-button")
            .setStyle(ButtonStyle.Success)
        );

        const reply = await interaction.reply({
          embeds: [embed],
          components: [row],
        });

        const collector = reply.createMessageComponentCollector({
          componentType: ComponentType.Button,
          filter: ({ user }) => user.id === interaction.member.id
        });

        collector.on("collect", async (button) => {
          switch (button.customId) {
            case "create-prompt-button":
              {
                const data = await client.db.guild.findUnique({
                  where: {
                    guildID: interaction.guildId,
                  },
                  include: { ticketmenus: { include: { questions: true } } },
                });

                if (
                  data?.ticketmenus.find(
                    (menu) => menu.creatorID === interaction.user.id
                  )?.questions.length > 25
                ) {

                  row.components[0].setDisabled(true);
                  row.components[1].setDisabled(true);

                  // maybe change this to have the same edit and stuff system as ones below instead of disabling buttons

                  button.update({
                    embeds: [
                      new EmbedBuilder()
                        .setTitle("TicketMenu Setup")
                        .setDescription(
                          codeBlock(
                            "prolog",
                            "Please remove some questions before adding new ones"
                          )
                        )
                        .setColor(Colors.Normal),
                    ],
                    components: [row],
                  });
                } else {
                  function menuID(length: number) {
                    for (
                      var s = "";
                      s.length < length;
                      s +=
                        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(
                          (Math.random() * 62) | 0
                        )
                    );
                    return s;
                  }

                  const id = menuID(7);

                  //-----------------------------------------------------------------------------------------------

                  if (
                    data.ticketmenus.find(
                      (menu) => menu.creatorID === interaction.user.id
                    )
                  ) {
                   
                    const updatereply = await button.update({
                        embeds: [
                          new EmbedBuilder()
                            .setDescription(
                              "You have a menu created already try adding question"
                            )
                            .setColor(Colors.Normal),
                        ],
                        components: [],
                      });

                      setTimeout(() => {
                        row.components[0].setDisabled(true)

                        updatereply.edit({ components: [row], embeds: [embed]})
                     }, 4000);

                  } else {
                    await client.db.guild.update({
                      where: {
                        guildID: interaction.guildId,
                      },
                      data: {
                        ticketmenus: {
                          create: {
                            creatorID: interaction.user.id,
                            menuID: id,
                          },
                        },
                      },
                    });
                  }
                }
              }
              break;

            case "question-prompt-button":
              {
                try {
                  const valuePrompt =
                    new ActionRowBuilder<TextInputBuilder>().addComponents(
                      new TextInputBuilder()
                        .setLabel("name")
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(100)
                        .setCustomId("value-prompt")
                        .setRequired(true)
                    );

                  const labelPrompt =
                    new ActionRowBuilder<TextInputBuilder>().addComponents(
                      new TextInputBuilder()
                        .setLabel("label")
                        .setMaxLength(100)
                        .setStyle(TextInputStyle.Short)
                        .setCustomId("label-prompt")
                        .setRequired(true)
                    );

                  const descriptionPrompt =
                    new ActionRowBuilder<TextInputBuilder>().addComponents(
                      new TextInputBuilder()
                        .setLabel("description")
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(100)
                        .setCustomId("description-prompt")
                        .setRequired(true)
                    );

                  const modal = new ModalBuilder()
                    .setTitle("question")
                    .setCustomId("ticket-question-modal")
                    .addComponents(valuePrompt, labelPrompt, descriptionPrompt);

                  await button.showModal(modal);

                  const response = await button.awaitModalSubmit({
                    time: 60_000,
                    filter: ({ user }) => user.id === interaction.user.id,
                  });

                  const value =
                    response.fields.getTextInputValue("value-prompt");
                  const label =
                    response.fields.getTextInputValue("label-prompt");
                  const description =
                    response.fields.getTextInputValue("description-prompt");

                  await response.deferUpdate();

                  await client.db.guild.update({
                    where: {
                      guildID: interaction.guildId,
                    },
                    data: {
                      ticketmenus: {
                        update: {
                          where: {
                            creatorID: interaction.user.id,
                          },
                          data: {
                            questions: {
                              create: {
                                label: label,
                                description: description,
                                value: value,
                              },
                            },
                          },
                        },
                      },
                    },
                  });
                } catch (err) {
                  const msg = await button.editReply({
                    embeds: [
                      new EmbedBuilder()
                        .setDescription(
                          "You did not answer in time **try again**"
                        )
                        .setColor(Colors.Normal),
                    ],
                    components: [],
                  });

                  setTimeout(() => {
                    msg.edit({ embeds: [embed], components: [row] });
                  }, 4000);
                }
              }
              break;

            case "finish-prompt-button":
              const data = await client.db.guild.findUnique({
                where: {
                  guildID: interaction.guildId,
                },
                include: {
                  ticketmenus: {
                    include: { questions: { include: { ticketmenu: true } } },
                  },
                },
              });

              const logs = await client.channels.fetch(data.logsID);

              if (logs.isTextBased()) {
                const menu = data.ticketmenus.find(
                  (menu) => menu.creatorID === interaction.user.id
                );

                logs.send({
                  embeds: [
                    new EmbedBuilder()
                      .setDescription(
                        `A new ticket menu has been created
                        MenuID: ${menu.menuID}
                        Creator: <@${menu.creatorID}>
                      `
                      )
                      .setColor(Colors.Normal),
                  ],
                });
              }

              const channelselect =
                new ActionRowBuilder<ChannelSelectMenuBuilder>().setComponents(
                  new ChannelSelectMenuBuilder()
                    .setCustomId("picked-channel")
                    .setPlaceholder("Pick a channel")
                    .setChannelTypes(ChannelType.GuildText)
                    .setMinValues(0)
                    .setMaxValues(1)
                );

              const channelmenu = await button.update({
                embeds: [
                  new EmbedBuilder()
                    .setDescription(
                      "What channel would you like to send this ticket menu to?"
                    )
                    .setColor(Colors.Normal),
                ],
                components: [channelselect],
              });

              const channelresponse = await channelmenu.awaitMessageComponent({
                componentType: ComponentType.ChannelSelect,
                filter: ({ user }) => user.id === interaction.user.id
              });

              const menu = data.ticketmenus.find(
                (menu) => menu.creatorID === interaction.user.id
              );

              const result = menu.questions.map((data) => {
                return {
                  label: data.label,
                  desciption: data.description,
                  value: data.value,
                };
              });

              const value = channelresponse.values[0];

              const channel = await client.channels.fetch(value);

              if (channel.isTextBased()) {
                channel.send({
                  components: [
                    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                      new StringSelectMenuBuilder()
                        .setCustomId("string-select-menu")
                        .addOptions(result)
                    ),
                  ],
                });

                const collector = channel.createMessageComponentCollector({
                  componentType: ComponentType.StringSelect,
                  filter: ({ user }) => user.id === interaction.user.id
                 })

                 collector.on('collect', async (menu) => {
                    if (menu.customId === 'string-select-menu') {
                      console.log(menu.values[0])

                      // will need to listen for the max amount of questions they can set and do something for either one

                      menu.deferUpdate();
                    }
                 })
                
              }
              // make sure to then create a private channel with staff roles and just the user after user picks

              channelresponse.update({
                embeds: [
                  new EmbedBuilder()
                    .setDescription("setup complete!")
                    .setColor(Colors.Normal),
                ],
                components: [],
              });

              break;
          }
        });

        collector.on("ignore", async (button) => {
          button.reply({ content: "This interaction does not belong to you" });
        });

        break;

      case "delete":
        // use this for the command delete choice to delete a ticketmenu inside of database
        break;
    }
  },
});
