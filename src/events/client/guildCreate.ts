import chalk from "chalk";
import { Event } from "../../Custom/Classes/Bot/Event.js";
import "dotenv/config";

export default new Event({
  name: "guildCreate",
  once: false,
  async execute(client, guild) {
    if (guild.available) {
      await client.db.guild.create({
        data: {
          guildName: guild.name,
          guildID: guild.id,
          prefix: '.',
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
