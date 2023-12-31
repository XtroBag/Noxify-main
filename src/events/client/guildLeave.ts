import chalk from "chalk";
import { Event } from "../../Custom/Classes/Bot/Event.js";
import "dotenv/config";

export default new Event({
  name: "guildDelete",
  once: false,
  async execute(client, guild) {
    if (guild.available) {
      await client.db.guild.delete({
        where: {
          guildID: guild.id,
        },
      });

      console.log(
        chalk.gray("[System]") +
          chalk.white(" Successfully") +
          chalk.red(` left`) +
          chalk.white(` the server ${guild.name}`)
      );
    } else {
      return;
    }
  },
});
