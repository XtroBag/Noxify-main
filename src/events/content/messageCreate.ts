import { config } from "../../../config/config.js";
import { Event } from "../../custom/classes/bot/event.js";
import "dotenv/config";

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

    const tagged = message.mentions.users.map((msg) => msg.id);

    if (tagged.length > 0) {
      tagged.forEach(async (id) => {
        const data = await client.db.afk.findUnique({
          where: {
            guildID: message.guildId,
            userID: id,
          },
        });

        if (data) {
          message.reply({ content: `The user <@${id}> is currently afk` });

          await client.db.afk.update({
            where: {
              guildID: message.guildId,
              userID: id,
            },
            data: {
              mentions: {
                increment: 1,
              },
            },
          });
        } else return;
      });
    }

    if (data) {
      message.reply({
        content: `Welcome back <@${data.userID}> you were mentioned **${
          data.mentions
        }** ${data.mentions > 0 ? "times" : ""}`,
        flags: ["SuppressNotifications"],
      });

      await client.db.afk.delete({
        where: {
          guildID: message.guildId,
          userID: message.member.id,
        },
      });
    }

    const guild = await client.db.guild.findUnique({
      where: {
        guildID: message.guildId,
      },
    });

    const prefix = guild.prefix;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const name = args.shift().toLowerCase();
    const command = client.textCommands.get(name);

    if (!command) {
      return message.reply({
        content: "This command doesn't exist",
        flags: "SuppressNotifications",
      });
    }

    if (
      command.data.ownerOnly === true &&
      config.ownerID !== message.author.id
    ) {
      return message.reply({
        content: "Sorry, this command can only be used by the bot owner.",
        flags: "SuppressNotifications",
      });
    }

    try {
      command.run(client, message, args);
    } catch (error) {
      console.log(error);
      return message.channel.send("Something went wrong!");
    }
  },
});
