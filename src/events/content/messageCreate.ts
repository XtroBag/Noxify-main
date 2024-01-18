import { EmbedBuilder, TextChannel } from "discord.js";
import { Event } from "../../Custom/Classes/Bot/Event.js";
import { Colors } from "../../Custom/Enums/Colors.js";
import { cache } from "../../Custom/Interfaces/Text.js";
import { config } from "../../Config/Config.js";

export default new Event({
  name: "messageCreate",
  once: false,
  async execute(client, message) {
    if (message.author.bot) return;
    if (
      !message.guild.members.me
        .permissionsIn(message.channel as TextChannel)
        .has("SendMessages")
    )
      return;

    /*
    # IF FUTURE ISSUES WITH PREFIX:
    # It is being caused from the bot picking up messages from other guilds that were added before the bot was given to me and they don't have
    # a database document in the mongoDB so it will error thinking they have one being "null".
    */

    const database = await client.db.guild.findUnique({
      where: {
        guildID: message.guildId,
      },
    });

    // must update to match the one inside "guildCreate" event too the best i can
    if (database?.prefix == null) {
      await client.db.guild.create({
        data: {
          guildName: message.guild.name,
          guildID: message.guildId,
          prefix: ".",
        },
      });
    }

    const { prefix } = await client.db.guild.findUnique({
      where: {
        guildID: message.guildId,
      },
    });

    if (message.mentions.members.has(client.user.id)) {
      const prefixEmbed = new EmbedBuilder()
        .setDescription(`Prefix: \`\`${prefix}\`\``)
        .setColor(Colors.Normal);

      message.reply({ embeds: [prefixEmbed] });
    }

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);

    const name = args.shift().toLowerCase();
    const command =
      client.textCommands.get(name) ||
      client.textCommands.find(
        (a) => a.data.aliases && a.data.aliases.includes(name)
      );

    if (!command) {
      return message.reply({
        content: "That doesn't exist as a command",
      });
    }

    if (
      command.data.ownerOnly === true &&
      config.ownerID !== message.author.id
    ) {
      return message.reply({
        content: "Sorry, this command can only be used by the bot owner.",
      });
    }

    try {
      command.run({ client, message, args, cache });
    } catch (err) {
      console.log(err);
    }
  },
});
