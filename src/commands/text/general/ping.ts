import { EmbedBuilder } from "discord.js";
import { TextCommand } from "../../../custom/classes/bot/text.js";
import { messagesCache } from "../../../custom/types/msgcache.js";

export default new TextCommand({
  data: {
    name: "ping",
    description: "test the bots ping from the gateway",
    usage: "?ping",
    ownerOnly: false,
  },
  run: async (client, message, args) => {
    const reply = await message.reply({
      embeds: [new EmbedBuilder().setDescription(`Ping: ${client.ws.ping}`)],
    });

    messagesCache.add({
      messageID: message.id,
      replyID: reply.id,
    });
  },
});
