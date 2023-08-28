import { EmbedBuilder } from "discord.js";
import { TextCommand } from "../../../types/classes/text.js";
import { cache } from "../../../functions/messageCache.js";

export default new TextCommand({
    data: {
        name: 'guilds',
        description: 'Check top guilds in the bot',
        usage: 'guilds',
        ownerOnly: false,
        beta: false,
        category: 'general'
    },
   async run(client, message, _args) {
        const guilds = client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).first(100);

        const description = guilds.map((guild, index) => {
            return `\`\`${index + 1}\`\` **${guild.name}** - ${guild.memberCount} members`
        }).join('\n')

      const reply = await message.reply({ embeds: [new EmbedBuilder()
            .setTitle('Top Guilds')
            .setDescription(description)
        ]})

        cache.add({
            replyMessageID: reply.id,
            messageID: message.id
          })
    },
})