import { Event } from "../../types/classes/event.js";
import { cache } from "../../utils/messageCache.js";
import "dotenv/config";

export default new Event({
  name: "messageUpdate",
  once: false,
  async execute(client, oldMessage, newMessage) {
    if (oldMessage.author.bot) return;

    // maybe code system like labs core when a user edits their msg (command) it will re-run the same command with updated response
    // small changes to work with a edit

    const messagesCache = [...cache].find(
      ({ messageID }) => messageID === oldMessage.id
    );

    if (messagesCache) {
      const clientMessage = await newMessage.channel.messages.fetch(
        messagesCache.replyMessageID
      );

      await clientMessage?.edit("Command call was editied").catch(() => null);
    }
  },
});
