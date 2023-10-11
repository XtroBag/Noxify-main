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
          filter: ({ user }) => user.id === interaction.member.id,
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
                      row.components[0].setDisabled(true);

                      updatereply.edit({ components: [row], embeds: [embed] });
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

                    button.deferUpdate();
                  }
                }
              }
              break;

            case "question-prompt-button":
              {
                try {
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
                    .addComponents(labelPrompt, descriptionPrompt);

                  await button.showModal(modal);

                  const response = await button.awaitModalSubmit({
                    time: 60_000,
                    filter: ({ user }) => user.id === interaction.user.id,
                  });

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
                filter: ({ user }) => user.id === interaction.user.id,
              });

              const menu = data.ticketmenus.find(
                (menu) => menu.creatorID === interaction.user.id
              );

              const result = menu.questions.map((data) => {
                return {
                  label: data.label,
                  description: data.description,
                  value: data.questionID, // set this as the id maybe                                          // *******************************
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
                  filter: ({ user }) => user.id === interaction.user.id,
                });

                collector.on("collect", async (menu) => {
                  if (menu.customId === "string-select-menu") {
                    const choice = menu.values[0];

                    const data = await client.db.guild.findUnique({
                      where: {
                        guildID: interaction.guildId,
                      },
                      include: {
                        ticketmenus: { include: { questions: true } },
                      },
                    });

                    const response = data.ticketmenus.find((menu) =>
                      menu.questions.find(
                        (question) => question.questionID === choice
                      )
                    );

                    if (response) {
                      // make sure to then create a private channel with staff roles and just the user after user picks
                      const ticket = await menu.guild.channels.create({
                        name: `<@${menu.user.username}'s-ticket`,
                        type: ChannelType.GuildText,
                        reason: `This channel was created to help ${menu.user.username}`,
                        permissionOverwrites: [
                          { allow: [], deny: [], id: interaction.guildId },
                        ],
                      });

                      const row =
                        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                          new StringSelectMenuBuilder()
                            .setCustomId("admin-panel")
                            .setPlaceholder("Ticket admin panel options")
                            .addOptions([
                              {
                                label: "Close Ticket",
                                emoji: "❌",
                                description: "Close this ticket",
                                value: "close",
                              },
                              {
                                label: "Edit Perms",
                                emoji: "🔒",
                                description:
                                  "Change who can see/join this ticket",
                                value: "edit",
                              },
                            ])
                        );

                      const ticketchannel = await ticket.send({
                        embeds: [
                          new EmbedBuilder()
                            .setDescription("Ticket Panel")
                            .setColor(Colors.Normal),
                        ],
                        components: [row],
                      });

                      const collector =
                        ticketchannel.createMessageComponentCollector({
                          componentType: ComponentType.StringSelect,
                          filter: ({ user }) => user.id === interaction.user.id,
                        });

                      collector.on("collect", async (menu) => {
                        if (menu.customId === "admin-panel") {
                          switch (menu.values[0]) {
                            case "close":
                              await ticket.delete();
                              // make trasncript system start here
                              break;

                            case "edit":
                              menu.update({
                                embeds: [
                                  new EmbedBuilder()
                                    .setDescription("edit channels permissions")
                                    .setColor(Colors.Normal),
                                ],
                              }); // make a way to change permissions with a list of the perms/roles a admin can pick
                              break;
                          }
                        }
                      });

                      collector.on("ignore", async (menu) => {
                        menu.reply({ content: "This menu is not for you" });
                      });

                      // make the system to ask questions inside channel (from reconix [youtube]) HERE AND BELOW:

                      const questions = [
                        "What is the problem today?",
                        "What can we do too help you?",
                      ];

                      let collect = 0;
                      let end = 0;

                      await ticket.send({
                        embeds: [
                          new EmbedBuilder()
                            .setDescription(questions[collect++])
                            .setColor(Colors.Normal),
                        ],
                      });


                      // THIS REQUIRES [MESSAGECONTENT] TO WORK!!!
                      const questionCollector = ticket.createMessageCollector({
                        filter: ({ author }) => author.bot === false
                      });

                      questionCollector.on("collect", () => {
                        if (collect < questions.length) {
                          ticket.send({
                            embeds: [
                              new EmbedBuilder()
                                .setDescription(questions[collect++])
                                .setColor(Colors.Normal),
                            ],
                          });
                        } else {
                          questionCollector.stop("fulfilled");
                        }
                      });

                      questionCollector.on("end", async (collected, reason) => {
                        if (reason === "fulfilled") {
                          let index = 1;

                          const mapped = collected.map((msg) => {
                            return new EmbedBuilder()
                            .addFields([
                                 {
                                   name: `(${index++}) ${questions[end++]}`,
                                   value: msg.content, // need intent for this
                                   inline: true,
                                 },
                               ])
                               .setColor(Colors.Normal)
                          })

                          console.log(mapped)


                          await ticket.send({ embeds: mapped });
                        }
                      });

                      menu.update({
                        embeds: [
                          new EmbedBuilder()
                            .setDescription(
                              `ticked has been made: ${ticket.url}`
                            )
                            .setColor(Colors.Normal),
                        ],
                        components: [],
                      });
                    } else {
                      menu.editReply({
                        content: "A problem has occured during ticket creation",
                      });
                    }
                  }
                });
              }

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
