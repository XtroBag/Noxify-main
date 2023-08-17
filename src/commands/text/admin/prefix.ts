// import { messageCache } from "../../../functions/messageCache.js";
import { TextClass } from "../../../types/classes/text.js";

export default new TextClass({
    data: {
        name: 'prefix',
        description: 'change the bot prefix',
        usage: 'prefix <prefix>',
        ownerOnly: false,
        category: 'admin'
    },
   async run(_client, message, args) {
        
    },
})