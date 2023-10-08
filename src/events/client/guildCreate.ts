import chalk from "chalk";
import { Event } from "../../custom/classes/bot/event.js";
import "dotenv/config";
import { ChannelType } from "discord.js";

export default new Event({
  name: "guildCreate",
  once: false,
  async execute(client, guild) {
    if (guild.available) {
      // make sure bot has permissions to "create channels" or manage channels
      const logs = await guild.channels.create({
        name: 'noxify-logs',
        type: ChannelType.GuildText,
        nsfw: false,
        reason: 'This is the main channel for all noxify logs'
      })

      await client.db.guild.create({ 
        data: {
         guildName: guild.name,
         guildID: guild.id,
         logsID: logs.id,
         mode: false
        }
      })

      console.log(
        chalk.gray('[System]') + chalk.white(" Successfully") +
        chalk.green(` joined`) + chalk.white(` the server ${guild.name}`)
      );
    } else {
      return;
    }
  },
});
