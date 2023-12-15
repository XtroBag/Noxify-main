import { EmbedBuilder } from "discord.js";
import { TextCommand } from "../../../Custom/Classes/Bot/Text.js";
import { Colors } from "../../../Custom/Enums/Colors.js";

export default new TextCommand({
  data: {
    name: "ping",
    description: "test the bots ping from the gateway",
    usage: "?ping",
    ownerOnly: false,
  },
  run: async (client, message, args, cache) => {
    const reply = await message.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`Ping: ${client.ws.ping}`)
          .setColor(Colors.Normal),
      ],
    });

    cache.add({
      messageID: message.id,
      replyID: reply.id,
    });
  },
});
