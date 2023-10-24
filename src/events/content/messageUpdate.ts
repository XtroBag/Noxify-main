import { EmbedBuilder } from "discord.js";
import { Event } from "../../custom/classes/bot/event.js";
import { messagesCache } from "../../custom/types/msgcache.js";
import { Colors } from "../../custom/enums/colors.js";

export default new Event({
  name: "messageUpdate",
  once: false,
  async execute(client, oldMSG, newMSG) {
    const guild = await client.db.guild.findUnique({
      where: {
        guildID: newMSG.guildId,
      },
    });

    const prefix = guild.prefix;

    const args = newMSG.content.slice(prefix.length).trim().split(/ +/);
    const name = args.shift().toLowerCase();
    // const cmd = client.textCommands.get(name)

    if (oldMSG.content !== newMSG.content) {
      if (newMSG.content === `${prefix}${name}`) {
        const messageCache = [...messagesCache].find(
          ({ messageID }) => messageID === newMSG.id
        );
        const response = await newMSG.channel.messages.fetch(
          messageCache.replyID
        );

        await response.edit({
          embeds: [
            new EmbedBuilder()
              .setDescription("Content was changed")
              .setColor(Colors.Normal),
          ],
        });
      }
    }
  },
});
