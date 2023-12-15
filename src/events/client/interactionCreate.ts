import { Event } from "../../Custom/Classes/Bot/Event.js";
import { Handler } from "../../Custom/Classes/Bot/Handler.js";

export default new Event({
  name: "interactionCreate",
  async execute(client, interaction) {
    await new Handler().setHandler(client, interaction);
  },
});
