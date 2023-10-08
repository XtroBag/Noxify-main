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
import { disableButtons } from "../../functions/disableComponents.js";

/*
    [NOTES]:
    Make the system use a database report channel the bot can make and the report feature from this will send a report in that channel
    Make my own custom (alert/warning) emoji to use and the bot will create that when it joins servers and if someone tries to delete it a prompt will show confirming the system wont work without it. (Or make system work around it)
    Make sure to go over permissions needed and check and also test everything
    Maybe make system check if there is already a channel with that name before creating a new one when joining servers
    I might make a noxify category for the channels to be made under
    */

export default new Event({
  name: "messageReactionAdd",
  once: false,
  async execute(client, reaction, user) {
    if (reaction.emoji.name === "❌") {
      const embed = new EmbedBuilder()
        .setDescription("Click the button below to report this message")
        .setColor(Colors.Normal);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel("Report")
          .setCustomId("report-button")
          .setStyle(ButtonStyle.Secondary)
      );

      const message = await reaction.message.reply({
        embeds: [embed],
        components: [row],
        flags: ['SuppressNotifications']
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
        if (i.customId === "report-button") {
          const data = await client.db.guild.findUnique({
            where: {
              guildID: reaction.message.guildId,
            },
          });

          const button = disableButtons(message);
          i.update({ components: button });

          const channel = await reaction.message.guild.channels.fetch(
            data.logsID
          );

          if (channel.type === ChannelType.GuildText) {
            channel.send({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Message Reported")
                  .setDescription(`A user has reported a message`)
                  .addFields([
                    {
                      name: "Reporter:",
                      value: `<@${reaction.message.member.id}>`,
                      inline: true,
                    },
                    {
                      name: "Message:",
                      value: `${reaction.message.url}`,
                      inline: true,
                    },
                  ]),
              ],
            });
          }
        }
      });
    }
  },
});
