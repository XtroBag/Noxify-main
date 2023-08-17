import { EmbedBuilder, codeBlock } from "discord.js";
import { TextClass } from "../../../types/classes/text.js";
import { inspect } from "util";
import { messageCache } from "../../../functions/messageCache.js";

export default new TextClass({
  data: {
    name: "eval",
    description: "Run code in chat",
    usage: "eval <code>",
    ownerOnly: true,
    category: 'owner'
  },
  // @ts-ignore
  async run(client, message, args) {
    if (!args[0]) return message.reply({ content: "Please provide some code" })

    if (args[0].includes('process.env.token')) {
      return message.reply({ content: "Stop trying to access the token" })
    }

    const embed = new EmbedBuilder().setTitle("Evaluating...");
    const msg = await message.reply({ embeds: [embed] });

    messageCache.add({
      replyMessageId: msg.id,
      userMessageId: message.id
    })

    try {
      const data = await eval(args.join(" ").replace(/```/g, ""));
      let output = data;
      if (typeof data !== "string") {
        output = inspect(data);
      }
      embed.setTitle("Code Executed");
      embed.setDescription(codeBlock('js', output));
      await msg.edit({ embeds: [embed] });
    } catch (e) {
      embed.setTitle("An Error has occured")
      embed.setDescription(codeBlock('js', e))
      return await msg.edit({ embeds: [embed] });
    }
  },
});
