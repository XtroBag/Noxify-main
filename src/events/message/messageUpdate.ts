import { Event } from "../../types/classes/event.js";
import "dotenv/config";

export default new Event({
  name: "messageUpdate",
  once: false,
  async execute(client, oldMessage, newMessage) {
    if (oldMessage.author.bot) return;

    // maybe code system like labs core when a user edits their msg (command) it will re-run the same command with updated response
  },
});
