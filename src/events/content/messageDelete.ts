import { Event } from "../../Custom/Classes/Bot/Event.js";
import { cache } from "./MessageCreate.js";

export default new Event({
  name: "messageDelete",
  once: false,
  async execute(client, message) {
    const messageCache = [...cache].find(
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
