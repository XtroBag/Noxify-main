import { Event } from "../../custom/classes/bot/event.js";
import { messagesCache } from "../../custom/types/msgcache.js";

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

    // const args = newMSG.content.slice(prefix.length).trim().split(/ +/);
    // const name = args.shift().toLowerCase();

      if (oldMSG.content !== newMSG.content) {
        // The message has been edited
    
        // Check if the edited message still starts with the command prefix
        if (newMSG.content.startsWith(prefix)) {
          const messageCache = [...messagesCache].find(
            ({ messageID }) => messageID === newMSG.id
          );
    
          const response = await newMSG.channel.messages.fetch(
            messageCache.replyID
          );

          response.edit({ content: 'test', embeds: []})
        }
      }

    }
  },
);
