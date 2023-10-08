import { Event } from "../../custom/classes/bot/event.js";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ComponentType,
  EmbedBuilder,
} from "discord.js";
import { Colors } from "../../enums/colors.js";

/*
    [NOTES]:
    Make the system use a database report channel the bot can make and the report feature from this will send a report in that channel
    Make my own custom (alert/warning) emoji to use and the bot will create that when it joins servers and if someone tries to delete it a prompt will show confirming the system wont work without it. (Or make system work around it)
    Make sure to go over permissions needed and check and also test everything
    */

export default new Event({
  name: "messageReactionAdd",
  once: false,
  async execute(client, reaction, user) {
      if (reaction.message.member.permissions.has("Administrator")) {
        if (reaction.emoji.name === "❌") {
          const embed = new EmbedBuilder()
            .setDescription("Pick a operation to run on this message")
            .setColor(Colors.Normal);

          const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setLabel("Delete")
              .setCustomId("delete-button")
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setLabel("Report")
              .setCustomId("report-button")
              .setStyle(ButtonStyle.Secondary)
          );

          const message = await reaction.message.reply({
            embeds: [embed],
            components: [row],
          });

          const collector = message.createMessageComponentCollector({
            componentType: ComponentType.Button,
            filter: ({ user }) => user.id === reaction.message.member.id,
          });

          collector.on("ignore", async (i) => {
            i.reply({
              embeds: [
                new EmbedBuilder().setDescription(
                  "This interaction is not for you"
                ),
              ],
            });
          });

          collector.on("collect", async (i) => {
            if (i.customId === "delete-button") {
              if (reaction.message.deletable) {
                await reaction.message.delete();

               await i.reply({ content: 'message was deleted', ephemeral: true})
              }
            }

            if (i.customId === "report-button") {
              const data = await client.db.guild.findUnique({
                where: {
                  guildID: reaction.message.guildId,
                },
              });

              // make report button disable after one time use so no spamming

              const channel = await reaction.message.guild.channels.fetch(
                data.logsID
              );

              if (channel.type === ChannelType.GuildText) {
                channel.send({
                  embeds: [
                    new EmbedBuilder()
                      .setTitle('Message Reported')
                      .setDescription(`A message has reported a message`)
                      .addFields([
                        {
                          name: "Reporter:",
                          value: `<@${reaction.message.member.id}>`,
                          inline: true
                        },
                        {
                          name: 'Link:',
                          value: `${reaction.message.url}`,
                          inline: true
                        }
                      ]),
                  ],
                });
              }

              i.reply({ content: 'message report was sent to staff', ephemeral: true })
            }
          });
        }
      } else {
        reaction.message.reply({
          content: "you do not have permissions to use this feature",
        });
      }
    
  },
});
