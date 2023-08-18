import { messageCache } from "../../../functions/messageCache.js";
import { TextCommand } from "../../../types/classes/text.js";

export default new TextCommand({
    data: {
        name: 'meme',
        description: 'get random memes',
        usage: 'meme',
        ownerOnly: false,
        category: 'fun'
    },
   async run(_client, message, _args) {
      const reply = await message.reply({ content: 'Meme command works!'})

      messageCache.add({
        replyMessageId: reply.id,
        userMessageId: message.id
      })
    },
})