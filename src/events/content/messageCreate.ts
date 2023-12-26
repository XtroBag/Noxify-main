import { EmbedBuilder, TextChannel } from "discord.js";
import { Event } from "../../Custom/Classes/Bot/Event.js";
import { Colors } from "../../Custom/Enums/Colors.js";
import { cache } from "../../Custom/Interfaces/Text.js";


export default new Event({
    name: 'messageCreate',
    once: false,
    async execute(client, message) {
        if (message.author.bot) return;
        if (!message.guild.members.me.permissionsIn(message.channel as TextChannel).has('SendMessages')) return;

        const guild = await client.db.guild.findUnique({
          where: {
            guildID: message.guildId,
          },
        });

        if (!guild) {
          await client.db.guild
            .create({
              data: {
                guildName: message.guild.name,
                guildID: message.guildId,
                prefix: ".",
              },
            })
        }


        // if there is a server that failed to create a database document on join it will create one here with the default prefix (and fail once) and then will continue working okay.
        // need to find a way to fix it from crashing the first time it detects the server not having a prefix.

        const prefix = guild.prefix;

        if (message.mentions.members.has(client.user.id)) {
            const prefixEmbed = new EmbedBuilder()
            .setDescription(`Prefix: \`\`${prefix}\`\``)
            .setColor(Colors.Normal)

            message.reply({ embeds: [prefixEmbed] })
        }

        if (!message.content.startsWith(prefix)) return;

        const args = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);

        const name = args.shift().toLowerCase();
        const command = client.textCommands.get(name) || client.textCommands.find((a) => a.data.aliases && a.data.aliases.includes(name))

        if (!command) {
            return message.reply({ 
                content: "That doesn't exist as a command"
            })
        }
        
        try {
            command.run({ client, message, args, cache })
        } catch (err) {
            console.log(err)
        }
    }   

})