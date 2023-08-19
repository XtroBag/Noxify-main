// import { messageCache } from "../../../functions/messageCache.js";
import { TextCommand } from "../../../types/classes/text.js";

export default new TextCommand({
    data: {
        name: 'prefix',
        description: 'change the bot prefix',
        usage: 'prefix <prefix>',
        beta: false,
        ownerOnly: false,
        category: 'admin'
    },
   async run(_client, message, args) {
        
    },
})