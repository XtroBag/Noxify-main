import { Message } from "discord.js";
import { TextCommand } from "../../../types/classes/text.js";
import { messageCache } from "../../../functions/messageCache.js";

export default new TextCommand({
    data: {
        name: 'text',
        description: 'have the bot ask you questions',
        usage: 'text',
        ownerOnly: false,
        category: 'general'
    },
    async run(_client, message, _args) {
        const questions = [
            "How was you're day?",
            "What's you're favorite coding language?",
            "Who is you're favorite marvel character?",
            "Do you have a favorite color?"
        ]

        let collectorCounter = 0;
        let endCounter = 0;

        const filter = (m: Message) => m.author.id === message.author.id;

        const appStart = await message.channel.send(questions[collectorCounter++])

        messageCache.add({
            replyMessageId: appStart.id,
            userMessageId: message.id
          })

        const collector = appStart.channel.createMessageCollector({
            filter: filter
        });

        collector.on('collect', () => {
            if (collectorCounter < questions.length) {
                appStart.channel.send(questions[collectorCounter++]);
            } else {
                collector.stop('fulfilled')
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'fulfilled') {
                let index = 1;
                const log = collected.map((msg) => {
                    return `${index++}) ${questions[endCounter++]}\n-> ${msg.content}`
                }).join("\n\n")

                console.log(log)
            }


        });

    },
})