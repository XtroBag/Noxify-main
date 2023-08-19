import { TextCommand } from "../../../types/classes/text.js";
// import { messageCache } from "../../../functions/messageCache.js";

export default new TextCommand({
  data: {
    name: "test",
    description: "test the new args system",
    usage: "test",
    ownerOnly: true,
    category: 'owner'
  },
  arguments: [{ name: 'lang', type: 'boolean', label: 'set the language of the codeblock', required: true, default: false }],

  async run(client, message, args) {
    // i wanna access my "arugments" data by either simply doing (args.name) | (args.type) | (args.info) | (args.default) - EXAMPLE
    // but when i type "args" currently it's an array and i don't wanna .map() it to access them. just wanna do what is above.

    

    
  },
});
