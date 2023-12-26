import { Event } from "../../Custom/Classes/Bot/Event.js";
import "dotenv/config";
import { config } from "../../Config/Config.js";
import { ChannelType, EmbedBuilder } from "discord.js";
import { cache } from "../../Custom/Interfaces/Text.js";
import { Colors } from "../../Custom/Enums/Colors.js";

export default new Event({
  name: "messageCreate",
  once: false,
  async execute(client, message) {
    if (message.author.bot) return;
    if (message.channel.type === ChannelType.GuildText) {
      if (
        !message.guild.members.me
          .permissionsIn(message.channel)
          .has("SendMessages")
      ) {
        return;
      }
    }

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
        }** ${data.mentions > 0 ? "times" : "times at all"}`,
        flags: ["SuppressNotifications"],
      });

      await client.db.afk.delete({
        where: {
          guildID: message.guildId,
          userID: message.member.id,
        },
      });
    }

    // // -------------------------------------------------------------------

    const database = await client.db.guild.findUnique({
      where: {
        guildID: message.guildId,
      },
    });

    if (!database.prefix) return;

    if (message.mentions.members.has(client.user.id)) {
      const embed = new EmbedBuilder()
        .setColor(Colors.Normal)
        .setDescription(`Prefix: \`\`${database.prefix}\`\` `);

      message.reply({ embeds: [embed] });
    }
    if (!message.content.startsWith(database.prefix)) return;

    const args = message.content
      .slice(database.prefix.length)
      .trim()
      .split(/ +/g);

    const name = args.shift().toLowerCase();
    const command =
      client.textCommands.get(name) ||
      client.textCommands.find(
        (a) => a.data.aliases && a.data.aliases.includes(name)
      );

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
      command.run({ client, message, args, cache });
    } catch (error) {
      console.log(error);
      return message.reply({ content: "Something went wrong!" });
    }
  },
});
