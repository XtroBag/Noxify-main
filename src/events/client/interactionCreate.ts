import { Event } from "../../custom/classes/bot/event.js";
import { Handler } from "../../custom/classes/bot/handler.js";

export default new Event({
  name: "interactionCreate",
  async execute(client, interaction) {
    await new Handler(client).setHandler(interaction);
  },
});
