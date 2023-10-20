import { AttachmentBuilder } from "discord.js";
import { Chart } from "chart.js";
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

    const prefix = "?";

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "members") {
      const chart = new Chart("cool",{
        type: "line",
        data: {
          labels: [
            "January",
            "Febuary",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "October",
            "November",
            "December",
          ],
          datasets: [
            {
              label: "Server Members",
              data: message.guild.memberCount,
            },
          ],
        },
      });

      const image = chart.toBase64Image();

      const data = new AttachmentBuilder(image, {
        name: "chart",
        description: "a cool chart",
      });

      message.reply({ files: [data] })
    }
  },
});
