import { TextCommand } from "../../../types/classes/text.js";
import { cache } from "../../../functions/messageCache.js";

export default new TextCommand({
  data: {
    name: "test",
    description: "test the new args system",
    usage: "test <mention> -log <true/false>",
    ownerOnly: true,
    category: "owner",
    option: {
      name: "mention",
      required: false,
    }, // the <option> for text commands is the thing you would use after using the cmd name like "test <user-mention> -log <true/false>"
  },
  arguments: [
    {
      name: "log",
      type: "boolean",
      label: "Pick if you want the command to console log",
      required: false,
      default: false,
    },
  ],
  async run(client, message, arugments) {
    // i wanna access my "arugments" data by either simply doing (arugment.name) | (arugment.type) | (arugment.info) | (arugment.default) - EXAMPLE
    // but when i type "arugments" currently it's an array and i don't wanna .map() it to access them. just wanna do what is above.

    const response = await message.reply({ content: "command worked!" });

    cache.add({ replyMessageID: response.id, messageID: message.id });
  },
});
