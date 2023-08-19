import { TextCommand } from "../../../types/classes/text.js";
// import { messageCache } from "../../../functions/messageCache.js";

export default new TextCommand({
  data: {
    name: "test",
    description: "test the new args system",
    usage: "test <mention> -log <true/false>",
    ownerOnly: true,
    category: "owner",
    option: {
      name: 'mention',
      required: false
    }
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
  },
});
