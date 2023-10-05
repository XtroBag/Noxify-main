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
        guildID: message.guildId,
        userID: message.member.id,
      },
    });

    if (data) {
      message
        .reply({
          content: `Welcome back <@${data.userID}> you were mentioned **${
            data.mentions
          }** ${data.mentions > 0 ? "times" : "time"}`,
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
          guildID: message.guildId,
          userID: message.member.id,
        },
      });
    }

    const filtered = message.mentions.users.filter(
      (u) => !u.bot && u.id !== message.member.id
    );

    for (const user of filtered.values()) {
      const updated = await client.db.afk.findUnique({
        where: {
          guildID: message.guildId,
          userID: user.id,
        },
      });

      if (!updated) return;

      message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`<@${updated.userID}> is currently AFK`)
            .addFields([
              {
                name: "Information:",
                value: `
              ${Emojis.Blank} userID: ${updated.userID}
              ${Emojis.Blank} Reason: ${updated.reason}
              ${Emojis.Blank} Timestamp: ${updated.timestamp}
              `,
                inline: false,
              },
            ]),
        ],
      });

      await client.db.afk.update({
        where: {
          guildID: message.guildId,
          userID: message.member.id,
        },
        data: {
          mentions: {
            increment: 1,
          },
        },
      });
    }

    // database prefix command don't work in DM's because guildId doesn't exists in dms
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

      if (command.data.ownerOnly && config.ownerID !== message.member.id) {
        return message.reply({
          content: "Sorry, this command can only be used by the bot owner.",
          flags: "SuppressNotifications",
        });
      }

      if (command.data.beta === true) {
        if (config.betaTesters.includes(message.member.id)) {
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
