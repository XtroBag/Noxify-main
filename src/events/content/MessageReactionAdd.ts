import { config } from "../../Config/Config.js";
import { Event } from "../../Custom/Classes/Bot/Event.js";

export default new Event({
  name: "messageReactionAdd",
  once: false,
  async execute(client, reaction, user) {
    if (user.id === config.ownerID) {
      if (reaction.emoji.name === "🩹") {
        await reaction?.message.delete().catch(() => {});
      }
    } else {
      return;
    }
  },
});
