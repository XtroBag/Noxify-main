import {
  Client,
  GatewayIntentBits,
  Collection,
  ClientEvents,
  Partials,
} from "discord.js";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Event } from "./event.js";
import { SlashCommand } from "./slash.js";
import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";
import { UserContextMenu } from "./usercontextmenu.js";
import { MessageContextMenu } from "./messagecontextmenu.js";

const dynamicImport = (path: string) =>
  import(pathToFileURL(path).toString()).then((module) => module?.default);

export class Noxify extends Client {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        // GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions
        // GatewayIntentBits.MessageContent,
      ],
      rest: {
        retries: 3,
        timeout: 15_000,
      },
      allowedMentions: {
        parse: ["everyone"],
      },
      partials: [Partials.Channel, Partials.Reaction],
    });
    this.slashCommands = new Collection<string, SlashCommand>();
    this.userContextMenus = new Collection<string, UserContextMenu>();
    this.messageContextMenus = new Collection<string, MessageContextMenu>();
    this.cooldown = new Collection<string, Collection<string, number>>();
    this.db = new PrismaClient();
    this.helpers = {};
  }

  private async loadModules() {
    // SlashCommands
    const commandFolderPath = fileURLToPath(
      new URL("../../../commands/chat", import.meta.url)
    );
    const commandFolders = fs.readdirSync(commandFolderPath);

    for (const folder of commandFolders) {
      const commandPath = path.join(commandFolderPath, folder);
      const commandFiles = fs
        .readdirSync(commandPath)
        .filter((file) => file.endsWith(".js"));
      for (const file of commandFiles) {
        const filePath = path.join(commandPath, file);

        const slash = (await dynamicImport(filePath)) as SlashCommand;

        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ("data" in slash && "execute" in slash) {
          this.slashCommands.set(slash.data.name, slash);
        } else {
          console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
          );
        }
      }
    }

    // UserContextMenus
    const userContextMenuFolderPath = fileURLToPath(
      new URL("../../../commands/user", import.meta.url)
    );
    const userContextMenuFolders = fs
      .readdirSync(userContextMenuFolderPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of userContextMenuFolders) {
      const filePath = path.join(userContextMenuFolderPath, file);

      const userMenu = (await dynamicImport(filePath)) as UserContextMenu;

      if ("data" in userMenu && "run" in userMenu) {
        this.userContextMenus.set(userMenu.data.name, userMenu);
      } else {
        console.log(
          `[WARNING] The menu at ${filePath} is missing a required "data" or "run" property.`
        );
      }
    }

    // MessageContextMenus
    const messageContextMenuFolderPath = fileURLToPath(
      new URL("../../../commands/message", import.meta.url)
    );
    const messageContextMenuFolders = fs.readdirSync(
      messageContextMenuFolderPath
    );

    for (const file of messageContextMenuFolders) {
      const filePath = path.join(messageContextMenuFolderPath, file);

      const messageMenu = (await dynamicImport(filePath)) as MessageContextMenu;

      if ("data" in messageMenu && "run" in messageMenu) {
        this.messageContextMenus.set(messageMenu.data.name, messageMenu);
      } else {
        console.log(
          `[WARNING] The menu at ${filePath} is missing a required "data" or "run" property.`
        );
      }
    }

    // Events
    const eventFolderPath = fileURLToPath(
      new URL("../../../events", import.meta.url)
    );
    const eventFolder = fs.readdirSync(eventFolderPath);

    const ignoreFile = "types.js";

    const filtered = eventFolder.filter((file) => file !== ignoreFile);

    for (const folder of filtered) {
      const eventPath = path.join(eventFolderPath, folder);
      const eventFiles = fs
        .readdirSync(eventPath)
        .filter((file) => file.endsWith(".js"));
      for (const file of eventFiles) {
        const filePath = path.join(eventPath, file);

        const event = (await dynamicImport(filePath)) as Event<
          keyof ClientEvents
        >;

        if ("name" in event && "execute" in event) {
          if (event.once) {
            this.once(event.name, (...args) => event.execute(this, ...args));
          } else {
            this.on(event.name, (...args) => event.execute(this, ...args));
          }
        } else {
          console.log(
            `[WARNING] The event at ${filePath} is missing a required "name" or "execute" property.`
          );
        }
      }
    }
  }

  /**
   * This is used to log into the Discord API with loading all commands and events.
   */
  start() {
    this.login(process.env.TOKEN);
    this.loadModules();
  }
}
