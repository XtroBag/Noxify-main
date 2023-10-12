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
} from "discord.js";
import { SlashCommand } from "../../../custom/classes/bot/slash.js";
import { Colors } from "../../../enums/colors.js";
import menuID from "../../../functions/menuID.js";
import { randomUUID } from "node:crypto";

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
    const option = interaction.options.getString("option");

    switch (option) {
      case "create":
        const firstReply = await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("TicketMenu Setup")
              .setDescription(`Welcome to the TicketMenu setup!`)
              .setColor(Colors.Normal),
          ],
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setLabel("Begin")
                .setCustomId("begin-button")
                .setStyle(ButtonStyle.Success)
            ),
          ],
        });

        const collector = firstReply.createMessageComponentCollector({
          componentType: ComponentType.Button,
          filter: ({ user }) => user.id === interaction.member.id,
        });

        collector.on("collect", async (button) => {
          switch (button.customId) {
            case "begin-button":
              const { ticketmenus } = await client.db.guild.findUnique({
                where: {
                  guildID: interaction.guildId,
                },
                include: { ticketmenus: { include: { menuQuestions: true } } },
              });

              // improve this to work better when bot overloads or leaves with data from before/after
              if (
                ticketmenus.find(
                  (menu) => menu.creatorID === interaction.user.id
                )?.menuQuestions.length > 25
              ) {
                button.update({
                  embeds: [
                    new EmbedBuilder()
                      .setTitle("Error:")
                      .setDescription(
                        `You have created the max amount of questions for this menu`
                      )
                      .setColor(Colors.Error),
                  ],
                  components: [],
                });
              } else {
                const id = menuID(9);

                // FIX THIS TO ALLOW A USER TO CREATE A NEW TICKETMENU EACH TIME (to edit old one is another part of slash command later)
                if (
                  !ticketmenus.find(
                    (menu) => menu.creatorID === interaction.user.id
                  )
                ) {
                  // Create a menu inside the database with only [creatorID, menuID]
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

                const secondReply = await button.update({
                  embeds: [
                    new EmbedBuilder()
                      .setTitle("Stage #1")
                      .setDescription("Setup the questions for the menu")
                      .setColor(Colors.Normal),
                  ],
                  components: [
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                      new ButtonBuilder()
                        .setCustomId("add-question-button")
                        .setLabel("Add")
                        .setStyle(ButtonStyle.Success),
                      new ButtonBuilder()
                        .setCustomId("finished-button")
                        .setLabel("Finished")
                        .setStyle(ButtonStyle.Primary)
                    ),
                  ],
                });

                const questionmodal = new ModalBuilder()
                  .setTitle("Question")
                  .setCustomId("question-modal-submit")
                  .setComponents(
                    new ActionRowBuilder<TextInputBuilder>().addComponents(
                      new TextInputBuilder()
                        .setCustomId("modal-label")
                        .setLabel("Label")
                        .setMaxLength(100)
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                    ),
                    new ActionRowBuilder<TextInputBuilder>().addComponents(
                      new TextInputBuilder()
                        .setCustomId("modal-description")
                        .setLabel("description")
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(100)
                        .setRequired(true)
                    )
                  );

                const collector = secondReply.createMessageComponentCollector({
                  componentType: ComponentType.Button,
                  filter: ({ user }) => user.id === interaction.member.id,
                });

                collector.on("collect", async (button) => {
                  switch (button.customId) {
                    case "add-question-button":
                      try {
                        await button.showModal(questionmodal);

                        const response = await button.awaitModalSubmit({
                          time: 60_000, // set back to 60_000
                          filter: ({ user }) => user.id === interaction.user.id,
                        });

                        const label =
                          response.fields.getTextInputValue("modal-label");
                        const description =
                          response.fields.getTextInputValue(
                            "modal-description"
                          );

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
                                  menuQuestions: {
                                    create: {
                                      questionID: randomUUID(),
                                      label: label,
                                      description: description,
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
                          msg
                            .edit({
                              embeds: [
                                new EmbedBuilder()
                                  .setTitle("Stage #1")
                                  .setDescription(
                                    "Setup the questions for the menu"
                                  )
                                  .setColor(Colors.Normal),
                              ],
                              components: [
                                new ActionRowBuilder<ButtonBuilder>().addComponents(
                                  new ButtonBuilder()
                                    .setCustomId("add-question-button")
                                    .setLabel("Add")
                                    .setStyle(ButtonStyle.Success),
                                  new ButtonBuilder()
                                    .setCustomId("finished-button")
                                    .setLabel("Finished")
                                    .setStyle(ButtonStyle.Primary)
                                ),
                              ],
                            })
                            .catch((err) => {});
                        }, 4000);
                      }

                      break;

                    case "finished-button":
                      // SENDING TO LOGGING CHANNEL
                      const data = await client.db.guild.findUnique({
                        where: {
                          guildID: interaction.guildId,
                        },
                        include: {
                          ticketmenus: {
                            include: {
                              menuQuestions: { include: { ticketmenu: true } },
                            },
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

                      const thirdReply = await button.update({
                        embeds: [
                          new EmbedBuilder()
                            .setTitle("Stage #2")
                            .setDescription(
                              "Setup the questions for inside the ticket"
                            )
                            .setColor(Colors.Normal),
                        ],
                        components: [
                          new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                              .setCustomId("add-ticket-question")
                              .setLabel("Add")
                              .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                              .setCustomId("finished-ticket-button")
                              .setLabel("Finished")
                              .setStyle(ButtonStyle.Primary)
                          ),
                        ],
                      });

                      const ticketmodal = new ModalBuilder()
                        .setTitle("Ticket Question")
                        .setCustomId("ticket-modal-submit")
                        .setComponents(
                          new ActionRowBuilder<TextInputBuilder>().addComponents(
                            new TextInputBuilder()
                              .setCustomId("ticket-question")
                              .setLabel("Question")
                              .setMaxLength(100)
                              .setStyle(TextInputStyle.Short)
                              .setRequired(true)
                          )
                        );

                      const collector =
                        thirdReply.createMessageComponentCollector({
                          componentType: ComponentType.Button,
                          filter: ({ user }) =>
                            user.id === interaction.member.id,
                        });

                      collector.on("collect", async (button) => {
                        switch (button.customId) {
                          case "add-ticket-question":
                            try {
                              await button.showModal(ticketmodal);

                              const response = await button.awaitModalSubmit({
                                time: 60_000, // set back to 60_000
                                filter: ({ user }) =>
                                  user.id === interaction.user.id,
                              });

                              const prompt =
                                response.fields.getTextInputValue(
                                  "ticket-question"
                                );

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
                                        ticketQuestions: {
                                          create: {
                                            prompt: {
                                              create: {
                                                prompt: prompt,
                                              },
                                            },
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
                                msg
                                  .edit({
                                    embeds: [
                                      new EmbedBuilder()
                                        .setTitle("Stage #2")
                                        .setDescription(
                                          "Setup the questions for inside the ticket"
                                        )
                                        .setColor(Colors.Normal),
                                    ],
                                    components: [
                                      new ActionRowBuilder<ButtonBuilder>().addComponents(
                                        new ButtonBuilder()
                                          .setCustomId(
                                            "add-ticket-question-button"
                                          )
                                          .setLabel("Add")
                                          .setStyle(ButtonStyle.Success),
                                        new ButtonBuilder()
                                          .setCustomId("ticket-finished-button")
                                          .setLabel("Finished")
                                          .setStyle(ButtonStyle.Primary)
                                      ),
                                    ],
                                  })
                                  .catch((err) => {});
                              }, 4000);
                            }

                            break;

                          case "finished-ticket-button":
                            const fourthReply = await button.update({
                              embeds: [
                                new EmbedBuilder()
                                  .setDescription(
                                    "What channel would you like to send this ticket menu to?"
                                  )
                                  .setColor(Colors.Normal),
                              ],
                              components: [
                                new ActionRowBuilder<ChannelSelectMenuBuilder>().setComponents(
                                  new ChannelSelectMenuBuilder()
                                    .setCustomId("picked-channel")
                                    .setPlaceholder("Pick a channel")
                                    .setChannelTypes(ChannelType.GuildText)
                                    .setMinValues(0)
                                    .setMaxValues(1)
                                ),
                              ],
                            });


                            const channelresponse =
                              await fourthReply.awaitMessageComponent({
                                componentType: ComponentType.ChannelSelect,
                                filter: ({ user }) =>
                                  user.id === interaction.user.id,
                              });

                              

                            const menu = data.ticketmenus.find(
                              (menu) => menu.creatorID === interaction.user.id
                            );

                            if (menu.menuQuestions.length < 0) {
                              // setup a error saying to add menu questions
                              await button.editReply({ content: 'please add some menu options'})
                            } else {

                            const results = menu.menuQuestions.map((data) => {
                              return {
                                label: data.label,
                                description: data.description,
                                value: data.questionID,
                              };
                            });

                            const value = channelresponse.values[0];

                            const channel = await client.channels.fetch(value);

                            if (channel.isTextBased()) {
                              await channel.send({
                                components: [
                                  new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                                    new StringSelectMenuBuilder()
                                      .setCustomId("string-select-menu")
                                      .addOptions(results)
                                  ),
                                ],
                              });

                              const collector =
                                channel.createMessageComponentCollector({
                                  componentType: ComponentType.StringSelect,
                                  filter: ({ user }) =>
                                    user.id === interaction.user.id,
                                });

                              collector.on("collect", async (menu) => {
                                if (menu.customId === "string-select-menu") {
                                  const choice = menu.values[0];

                                  const data = await client.db.guild.findUnique(
                                    {
                                      where: {
                                        guildID: interaction.guildId,
                                      },
                                      include: {
                                        ticketmenus: {
                                          include: { menuQuestions: true },
                                        },
                                      },
                                    }
                                  );

                                  const response = data.ticketmenus.find(
                                    (menu) =>
                                      menu.menuQuestions.find(
                                        (question) =>
                                          question.questionID === choice
                                      )
                                  );

                                  if (response) {
                                    // make sure to then create a private channel with staff roles and just the user after user picks
                                    const ticket =
                                      await menu.guild.channels.create({
                                        name: `<@${menu.user.username}-ticket`,
                                        type: ChannelType.GuildText,
                                        reason: `This channel was created to help ${menu.user.username}`,
                                        permissionOverwrites: [
                                          {
                                            allow: [],
                                            deny: [],
                                            id: interaction.guildId,
                                          },
                                        ],
                                      });

                                    const ticketChannel = await ticket.send({
                                      components: [
                                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                                          new ButtonBuilder()
                                            .setCustomId("close-ticket")
                                            .setLabel("Close Ticket")
                                            .setStyle(ButtonStyle.Danger)
                                            .setEmoji("❌"),
                                          new ButtonBuilder()
                                            .setCustomId("edit-ticket-perms")
                                            .setLabel("Edit Perms")
                                            .setStyle(ButtonStyle.Secondary)
                                            .setEmoji("🔒")
                                        ),
                                      ],
                                    });

                                    const collector =
                                      ticketChannel.createMessageComponentCollector(
                                        {
                                          componentType: ComponentType.Button,
                                          filter: ({ user }) =>
                                            user.id === interaction.user.id,
                                        }
                                      );

                                    collector.on("collect", async (menu) => {
                                      switch (menu.customId) {
                                        case "close-ticket":
                                          await ticket.delete();
                                          // make trasncript system start here
                                          break;

                                        case "edit-ticket-perms":
                                          menu.update({
                                            embeds: [
                                              new EmbedBuilder()
                                                .setDescription(
                                                  "edit channels permissions"
                                                )
                                                .setColor(Colors.Normal),
                                            ],
                                          }); // make a way to change permissions with a list of the perms/roles a admin can pick
                                          break;
                                      }
                                    });

                                    collector.on("ignore", async (menu) => {});

                                    const data =
                                      await client.db.guild.findUnique({
                                        where: {
                                          guildID: interaction.guildId,
                                        },
                                        include: {
                                          ticketmenus: {
                                            include: {
                                              ticketQuestions: {
                                                include: { prompt: true },
                                              },
                                            },
                                          },
                                        },
                                      });

                                    const questions = data.ticketmenus.find(
                                      (data) =>
                                        data.ticketQuestions.find(
                                          (d) => d.prompt
                                        )
                                    );
                                    

                                    let collect = 0;
                                    let end = 0;

                                    await ticket.send({
                                      embeds: [
                                        new EmbedBuilder()
                                          .setDescription(questions[collect++])
                                          .setColor(Colors.Normal),
                                      ],
                                    });

                                    const questionCollector =
                                      ticket.createMessageCollector({
                                        filter: ({ author }) =>
                                          author.bot === false,
                                      });

                                    questionCollector.on("collect", () => {
                                      if (
                                        collect <
                                        questions.ticketQuestions.length
                                      ) {
                                        ticket.send({
                                          embeds: [
                                            new EmbedBuilder()
                                              .setTitle("Support Information")
                                              .setDescription(
                                                questions[collect++]
                                              )
                                              .setColor(Colors.Normal),
                                          ],
                                        });
                                      } else {
                                        questionCollector.stop("fulfilled");
                                      }
                                    });

                                    questionCollector.on(
                                      "end",
                                      async (collected, reason) => {
                                        if (reason === "fulfilled") {
                                          let index = 1;

                                          const mapped = collected.map(
                                            (msg) => {
                                              return {
                                                name: `(${index++}) ${
                                                  questions[end++]
                                                }`,
                                                value: msg.content,
                                                inline: false,
                                              };
                                            }
                                          );

                                          const embed = new EmbedBuilder()
                                            .setColor(Colors.Normal)
                                            .addFields(mapped)
                                            .setColor(Colors.Normal);

                                          await ticket.send({
                                            embeds: [embed],
                                          });
                                        }
                                      }
                                    );

                                  
                                await menu.deferUpdate()

                                 
                                  //  await menu.update({
                                  //     embeds: [
                                  //       new EmbedBuilder()
                                  //         .setDescription(
                                  //           `ticket has been made: ${ticket.url}`
                                  //         )
                                  //         .setColor(Colors.Normal),
                                  //     ],
                                  //     components: [],
                                  //   })
                                  }
                                }
                              });
                            }

                        
                              
                          }
                            // continue editing too the next page
                            break;
                        }
                      });

                      collector.on("ignore", async (button) => {});

                      break;
                  }
                });

                collector.on("ignore", async (button) => {});
              }
          }
        });

        collector.on("ignore", async (button) => {});

        break;

      case "delete":
        // when deleting a ticketmenu make sure to specify menuID
        break;
    }
  },
});
