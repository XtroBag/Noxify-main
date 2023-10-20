import { Event } from "../../custom/classes/bot/event.js";

export default new Event({
  name: "messageReactionAdd",
  once: false,
  async execute(client, reaction, user) {
  },
});
