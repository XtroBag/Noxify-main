import { EmbedBuilder } from "discord.js";
import { TextCommand } from "../../../Custom/Classes/Bot/Text.js";
import { Colors } from "../../../Custom/Enums/Colors.js";

export default new TextCommand({
  data: {
    name: "guilds",
    description: "get a guild learderboard",
    usage: "?guilds",
    ownerOnly: false,
    category: "General",
    aliases: ["tg", "tguilds"],
  },
  run: async ({ client, message, args, cache }) => {
    const guilds = client.guilds.cache
      .sort((a, b) => b.memberCount - a.memberCount)
      .first(10);

    const description = guilds
      .map((guild, index) => {
        return `\`\`${index + 1}\`\` **${guild.name}** - ${
          guild.memberCount
        } members`;
      })
      .join("\n");

    const reply = await message.reply({
      embeds: [
        new EmbedBuilder().setDescription(description).setColor(Colors.Normal),
      ],
    });

    cache.add({
      messageID: message.id,
      replyID: reply.id,
    });
  },
});
