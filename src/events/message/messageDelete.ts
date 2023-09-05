import { Event } from "../../types/classes/event.js";
import { cache } from "../../functions/messageCache.js";
import "dotenv/config";

export default new Event({
  name: "messageDelete",
  once: false,
  async execute(client, message) {
    if (message.author.bot) return;

  const messagesCache = [...cache].find(({ messageID }) => messageID === message.id);

  if (messagesCache) {
    const clientMessage = await message.channel.messages.fetch(messagesCache.replyMessageID)

   await clientMessage?.delete().catch(() => null)

  }

  },
});
