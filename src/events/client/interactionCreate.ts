import { Event } from "../../custom/classes/event.js";
import { Handler } from "../../custom/classes/handler.js";

export default new Event({
  name: "interactionCreate",
  async execute(client, interaction) {
    await new Handler(client).setHandler(interaction);
  },
});
