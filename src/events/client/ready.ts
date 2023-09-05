import { Event } from "../../types/classes/event.js";
import { OptionsEntry } from "../../types/typings.js";
import { ActivityType } from "discord.js";
import { config } from "../../../config/config.js";
import chalk from "chalk";
import "dotenv/config";

export default new Event({
  name: "ready",
  once: true,
  async execute(client) {
    let options: OptionsEntry[] = [
      {
        name: "test 1",
        state: "TypeScript 🎭",
        type: ActivityType.Listening,
        status: "online",
      },
      {
        name: "test 2",
        state: "with Potions 🧪",
        type: ActivityType.Playing,
        status: "online",
      },
      {
        name: "XtroBag",
        state: "Coded in Typescript",
        type: ActivityType.Custom,
        status: "idle",
      },
    ];

    if (config.disabled.slash || config.disabled.text === true) {
      options = [
        {
          name: "Commands Disabled",
          state: "Commands Disabled",
          type: ActivityType.Custom,
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
            state: options[i % options.length].state,
            type: options[i % options.length].type,
          },
        ],
        status: options[i % options.length].status,
      });

      i++;
    }, 10000);

    //--------------------------------------------------

    console.log(
      chalk.blue(`[Client]`) + chalk.white(` Logged in as ${client.user.tag}`)
    );

    try {
      await client.db.$connect();
      console.log(
        chalk.cyan(`[Database]`) +
          chalk.white(` Connected to Prisma`)
      );
    } catch (err) {
      console.error(err);
      await client.db.$disconnect();
    }
  },
});
