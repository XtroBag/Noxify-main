import { Event } from "../../custom/classes/bot/event.js";
import { messagesCache } from "../../custom/types/msgcache.js";

export default new Event({
  name: "messageDelete",
  once: false,
  async execute(client, message) {
    const messageCache = [...messagesCache].find(
      ({ messageID }) => messageID === message.id
    );

    if (messageCache) {
      const clientMessage = await message.channel.messages
        .fetch(messageCache.replyID)
        .catch(() => null);

      clientMessage?.delete().catch(() => null);
    }
  },
});
