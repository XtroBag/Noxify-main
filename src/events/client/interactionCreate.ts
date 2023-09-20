import { Event } from "../../types/classes/event.js";
import { Handler } from "../../types/classes/handler.js";

export default new Event({
  name: "interactionCreate",
  async execute(client, interaction) {
    await new Handler({ bot: client }).setHandler(interaction);
  },
});
