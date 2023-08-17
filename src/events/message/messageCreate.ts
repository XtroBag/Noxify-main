import { Event } from "../../types/classes/event.js";
import "dotenv/config";
import { Config } from "../../../config/config.js";

export default new Event({
  name: "messageCreate",
  once: false,
  // @ts-ignore
  async execute(client, message) {
    if (message.author.bot) return;

    // message commands execution code

    // make prefix system work again with prisma

    const prefix = Config.prefix;

    if (!message.content.startsWith(prefix)) return;
    if (Config.globallyDisabled === true) {
      return message.reply({
        content:
          "All commands are globally disabled currently, Try again later!",
        flags: "SuppressNotifications",
      });
    } else {
      if (!message.content.startsWith(prefix)) return;

      const args = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);

      const name = args.shift().toLowerCase();

      const command = client.text.get(name);

      if (!command) {
        return message.reply({
          content: "This command doesn't exist",
          flags: "SuppressNotifications",
        });
      }

      if (command.data.ownerOnly && Config.ownerID !== message.author.id) {
        return message.reply({
          content: "Sorry, this command can only be used by the bot owner.",
          flags: "SuppressNotifications",
        });
      }

      try {
        command.run(client, message, args)
      } catch (error) {
        console.log(error);
        return message.channel.send("Something went wrong!");
      }
    }

  }
});
