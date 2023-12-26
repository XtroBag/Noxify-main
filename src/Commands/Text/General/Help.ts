import { TextCommand } from "../../../Custom/Classes/Bot/Text.js";

export default new TextCommand({
  data: {
    name: "help",
    description: "get information about the text commands",
    usage: "?help",
    ownerOnly: false,
    category: "General",
    aliases: [],
  },
  run: async ({ client, message, args, cache }) => {
    const reply = await message.reply({ content: "testing" });


    cache.add({
        messageID: message.id,
        replyID: reply.id,
      })

  },
});
