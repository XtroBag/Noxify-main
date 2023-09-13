import { Event } from "../../types/classes/event.js";
import "dotenv/config";
import { Colors, config, Emojis } from "../../../config/config.js";
import { EmbedBuilder } from "discord.js";

export default new Event({
  name: "messageCreate",
  once: false,
  async execute(client, message) {
    if (message.author.bot) return;
    // fix system to check if channel doesn't have perms

    const data = await client.db.afk.findUnique({
      where: {
        guildID_userID: {
          guildID: message.guildId,
          userID: message.author.id,
        },
      },
    });

    // console.log(data)

    if (data) {
      message
        .reply({
          embeds: [
            client.embeds.generalResponse(
              {
                description: `Welcome back <@${
                  data.userID
                }> you were mentioned **${data.mentions}** ${
                  data.mentions > 0 ? "times" : "time"
                }`, // might need to improve a bit
              },
              message
            ),
          ],
          flags: ["SuppressNotifications"],
        })
        .then((msg) => {
          setTimeout(async () => {
            if (msg.deletable) {
              await msg.delete().catch(() => {});
            }
          }, 6000);
        });

      await client.db.afk.delete({
        where: {
          guildID_userID: {
            guildID: message.guildId,
            userID: message.author.id,
          },
        },
      });
    }

    const filtered = message.mentions.users.filter(
      (u) => !u.bot && u.id !== message.author.id
    );
    filtered.every(async (user) => {
      const refreshed = await client.db.afk.findUnique({
        where: {
          guildID_userID: {
            guildID: message.guildId,
            userID: user.id,
          },
        },
      });

      if (!refreshed) return;
      message.reply({
        embeds: [
          client.embeds.generalResponse(
            {
              title: `<@${refreshed.userID}> is currently AFK`,
              fields: [
                {
                  name: "Information:",
                  value: `
                  ${Emojis.Blank} userID: ${refreshed.userID}
                  ${Emojis.Blank} Reason: ${refreshed.reason}
                  ${Emojis.Blank} Timestamp: ${refreshed.timestamp}
                  `,
                  inline: false,
                },
              ],
            },
            message
          ),
        ],
      });

      await client.db.afk.update({
        where: {
          guildID_userID: {
            guildID: message.guildId,
            userID: user.id,
          },
        },
        data: {
          mentions: {
            increment: 1,
          },
        },
      });
    });

    const prefix = "?";

    if (!message.content.startsWith(prefix)) return;

    if (config.disabled.text === true) {
      return await message.reply({
        content:
          "All commands are globally disabled currently, Try again later!",
        flags: "SuppressNotifications",
      });
    } else {
      if (!message.content.startsWith(prefix)) return; // ignore the message if doesn't start with prefix "?"

      //-----------------------------------------------------------------------

      const args = message.content.slice(prefix.length).trim().split(/ +/g);
      const cmdname = args.shift().toLowerCase();
      const command = client.text.get(cmdname);

      // exspansions code
      // const flag = command.data.expansions.flag

      //----------------------------------------------------------------------------------------------------

      if (!command) {
        return message.reply({
          content: "This command doesn't exist",
          flags: "SuppressNotifications",
        });
      }

      if (command.data.ownerOnly && config.ownerID !== message.author.id) {
        return message.reply({
          content: "Sorry, this command can only be used by the bot owner.",
          flags: "SuppressNotifications",
        });
      }

      if (command.data.beta === true) {
        if (config.betaTesters.includes(message.author.id)) {
          return command.run(client, message, args);
        } else {
          return await message.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  "You're not a beta tester yet to use this early"
                )
                .setColor(Colors.Normal),
            ],
            flags: "SuppressNotifications",
          });
        }
      } else {
        try {
          return command.run(client, message, args);
        } catch (error) {
          console.log(error);
          return await message.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription("Something went wrong!")
                .setColor(Colors.Normal),
            ],
            flags: "SuppressNotifications",
          });
        }
      }
    }
  },
});
