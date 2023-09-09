// import { messageCache } from "../../../functions/messageCache.js";
import { TextCommand } from "../../../types/classes/text.js";

export default new TextCommand({
  data: {
    name: "prefix",
    description: "change the bot prefix",
    usage: "prefix <prefix>",
    beta: false,
    ownerOnly: false,
    category: "admin",
  },
  async run(client, message, args) {
    const updated = args[0];

    // gotta test this once i get (message content) intent from discord should update prefix
    client.db.guild.updateMany({
      where: {
        guildId: message.guildId,
      },
      data: {
        prefix: updated,
      },
    });
  },
});
