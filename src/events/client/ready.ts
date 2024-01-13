import { Event } from "../../Custom/Classes/Bot/Event.js";
import { ActivityType, PresenceStatusData } from "discord.js";
import { config } from "../../Config/Config.js";
import chalk from "chalk";
import "dotenv/config";

export default new Event({
  name: "ready",
  once: true,
  async execute(client) {
    type OptionsEntry = {
      name?: string;
      state: string;
      type:
        | ActivityType.Watching
        | ActivityType.Listening
        | ActivityType.Playing
        | ActivityType.Streaming
        | ActivityType.Competing
        | ActivityType.Custom;
      status: PresenceStatusData;
    };

    let options: OptionsEntry[] = [
      {
        name: "TypeScript",
        state: "Because epic",
        type: ActivityType.Listening,
        status: "online",
      },
      {
        name: "with Potions 🧪",
        state: "inside the lab",
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

    if (config.disabled.slash === true) {
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
        chalk.cyan(`[Database]`) + chalk.white(` Connected to Prisma`)
      );
    } catch (err) {
      console.error(err);
      await client.db.$disconnect();
    }
  },
});
