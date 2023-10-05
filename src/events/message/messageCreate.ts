import { Event } from "../../types/classes/event.js";
import "dotenv/config";
import { Emojis } from "../../../config/config.js";
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
  },
});
