import { EmbedBuilder } from "discord.js";
import { TextClass } from "../../../types/classes/text.js";
import { messageCache } from "../../../functions/messageCache.js";

export default new TextClass({
    data: {
        name: 'guilds',
        description: 'Check top guilds in the bot',
        usage: 'guilds',
        ownerOnly: false,
        category: 'general'
    },
   async run(client, message, _args) {
        const guilds = client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).first(10);

        const description = guilds.map((guild, index) => {
            return `\`\`${index + 1}\`\` **${guild.name}** - ${guild.memberCount} members`
        }).join('\n')

      const reply = await message.reply({ embeds: [new EmbedBuilder()
            .setTitle('Top Guilds')
            .setDescription(description)
        ]})

        messageCache.add({
            replyMessageId: reply.id,
            userMessageId: message.id
          })
    },
})