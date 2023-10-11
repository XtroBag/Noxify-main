import chalk from "chalk";
import { Event } from "../../custom/classes/bot/event.js";
import "dotenv/config";
import { ChannelType, PermissionFlagsBits, OverwriteType } from "discord.js";

export default new Event({
  name: "guildCreate",
  once: false,
  async execute(client, guild) {
    if (guild.available) {

      const logs = await guild.channels.create({
        name: 'noxify-logs',
        type: ChannelType.GuildText,
        nsfw: false,
        reason: 'This is the main channel for all noxify logs',
        topic: `Actions from <@${client.user.id}> will be logged in this channel`,
        permissionOverwrites: [
          {
            allow: [
              PermissionFlagsBits.ManageChannels,
              PermissionFlagsBits.ManageMessages,
            ],
            type: OverwriteType.Role,
            id: guild.id,
          },
        ],
      });

      await client.db.guild.create({
        data: {
          guildName: guild.name,
          guildID: guild.id,
          logsID: logs.id,
          mode: false,
        }
      })
    
      console.log(
        chalk.gray("[System]") +
          chalk.white(" Successfully") +
          chalk.green(` joined`) +
          chalk.white(` the server ${guild.name}`)
      );
    } else {
      return;
    }
  },
});
