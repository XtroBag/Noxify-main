import { EmbedBuilder, codeBlock } from "discord.js";
import { inspect } from "util";
import { TextCommand } from "../../../Custom/Classes/Bot/Text.js";
import { Colors } from "../../../Custom/Enums/Colors.js";

export default new TextCommand({
  data: {
    name: "eval",
    description: "run some code from the chat",
    usage: "?eval",
    ownerOnly: true,
    category: 'Owner',
    aliases: ["ev"],
  },
  run: async (client, message, args, cache) => {
    if (!args[0]) return message.reply({ content: "Please provide some code" })

    const embed = new EmbedBuilder().setTitle("Evaluating...");
    const msg = await message.reply({ embeds: [embed] });
    try {
      const data = await eval(args.join(" ").replace(/```/g, ""));
      let output = data;
      if (typeof data !== "string") {
        output = inspect(data);
      }
      embed.setTitle("Code Executed");
      embed.setDescription(codeBlock("js", output));
      embed.setColor(Colors.Normal);
      await msg.edit({ embeds: [embed] });
    } catch (e) {
      embed.setTitle("An Error has occured");
      embed.setDescription(codeBlock("js", e));
      embed.setColor(Colors.Normal);
      await msg.edit({ embeds: [embed] });
    }

    cache.add({
      messageID: message.id,
      replyID: msg.id,
    });
  },
});
