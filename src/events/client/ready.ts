import { Event } from "../../types/classes/event.js";
// import { connect } from "mongoose";
import "dotenv/config";
import { ActivityType, PresenceStatusData } from "discord.js";
import { Config } from "../../../config/config.js";
import chalk from "chalk";

export default new Event({
  name: "ready",
  once: true,
  async execute(client) {
    type OptionsEntry = {
      name: string;
      type:
        | ActivityType.Watching
        | ActivityType.Listening
        | ActivityType.Playing
        | ActivityType.Streaming
        | ActivityType.Competing;
      status: PresenceStatusData;
    };

    let options: OptionsEntry[] = [
      {
        name: "TypeScript 🎭",
        type: ActivityType.Listening,
        status: "online",
      },
      {
        name: "with Potions 🧪",
        type: ActivityType.Playing,
        status: "online",
      },
    ];

    if (Config.globallyDisabled === true) {
      options = [
        {
          name: "All Disabled Cmds",
          type: ActivityType.Watching,
          status: "dnd",
        },
      ];
    }

    let i = 0;
    setInterval(() => {
      client.user.setPresence({
        activities: [
          {
            name: options[i % options.length].name,
            type: options[i % options.length].type,
          },
        ],
        status: options[i % options.length].status,
      });

      i++;
    }, 6000);

    //--------------------------------------------------

    console.log(
      chalk.blue(`[Client]`) +
        chalk.white(` Logged in as ${client.user.tag}`)
    )

    try {
      await client.db.$connect();
      console.log(chalk.cyan(`[Database]`) + chalk.white(` Connected to Prisma and MongoDB`))
    } catch (err) {
      console.error(err);
      await client.db.$disconnect()
    }
  },
});
