import { Event } from "../../types/classes/event.js";
import "dotenv/config";
import { Colors, config } from "../../../config/config.js";
import { EmbedBuilder } from "discord.js";

export default new Event({
  name: "messageCreate",
  once: false,
  async execute(client, message) {
    if (message.author.bot) return;

    const prefix = config.prefix;

    if (!message.content.startsWith(prefix)) return;

    if (config.disabled.text === true) {
      return await message.reply({
        content:
          "All commands are globally disabled currently, Try again later!",
        flags: "SuppressNotifications",
      });
    } else {
      if (!message.content.startsWith(prefix)) return; // ignore the message if doesn't start with prefix "?"

      //-----------------------------------------------------------------------

      const args = message.content.slice(prefix.length).trim().split(/ +/g);

      const cmdname = args.shift().toLowerCase();

      const command = client.text.get(cmdname); 
  
      
      //----------------------------------------------------------------------------------------------------


      if (!command) {
        return message.reply({
          content: "This command doesn't exist",
          flags: "SuppressNotifications",
        });
      }

      if (command.data.ownerOnly && config.ownerID !== message.author.id) {
        return message.reply({
          content: "Sorry, this command can only be used by the bot owner.",
          flags: "SuppressNotifications",
        });
      }

      if (command.data.beta === true) {
        if (config.betaTesters.includes(message.author.id)) {
          return command.run(client, message, args);
        } else {
          return await message.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  "You're not a beta tester yet to use this early"
                )
                .setColor(Colors.Normal),
            ],
            flags: "SuppressNotifications",
          });
        }
      } else {
        try {
          return command.run(client, message, args);
        } catch (error) {
          console.log(error);
          return await message.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription("Something went wrong!")
                .setColor(Colors.Normal),
            ],
            flags: "SuppressNotifications",
          });
        }
      }
    }
  },
});
