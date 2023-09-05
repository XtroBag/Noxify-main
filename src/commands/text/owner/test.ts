import { TextCommand } from "../../../types/classes/text.js";
import { cache } from "../../../utils/messageCache.js";

export default new TextCommand({
  data: {
    name: "test",
    description: "test the new args system",
    usage: "test <mention> -log <true/false>",
    ownerOnly: false,
    beta: true,
    arguments: [
      {
        name: "mention",
        required: false,
      },
    ],
    expansions: {
      flag: "-",
      exps: [
        {
          name: "log",
          type: "boolean",
          label: "Decide to log this command to the console",
          required: false,
        },
      ],
    },
  },

  async run(client, message, args) {
    const response = await message.reply({ content: "command worked!" });
    
    cache.add({ replyMessageID: response.id, messageID: message.id });
  },
});

// const name = args[0]

// i wanna access my "arugments" data by either simply doing (arugment.name) | (arugment.type) | (arugment.info) | (arugment.default) - EXAMPLE
// but when i type "arugments" currently it's an array and i don't wanna .map() it to access them. just wanna do what is above.
