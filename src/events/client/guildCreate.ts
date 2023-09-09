import chalk from "chalk";
import { Event } from "../../types/classes/event.js";
import "dotenv/config";

export default new Event({
  name: "guildCreate",
  once: false,
  async execute(client, guild) {
    if (guild.available) {
      await client.db.guild.create({ 
        data: {
          name: guild.name,
          id: guild.id
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
