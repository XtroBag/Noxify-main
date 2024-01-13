import {
  Client,
  GatewayIntentBits,
  Collection,
  ClientEvents,
  Partials,
} from "discord.js";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Event } from "./Event.js";
import { SlashCommand } from "./Slash.js";
import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";
import { UserContextMenu } from "./UserContextMenu.js";
import { MessageContextMenu } from "./MessageContextMenu.js";
import "dotenv/config";
import { TextCommand } from "./Text.js";
import { Button } from "./Button.js";

const dynamicImport = (path: string) =>
  import(pathToFileURL(path).toString()).then((module) => module?.default);

export class Noxify extends Client {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        // GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
      ],
      allowedMentions: {
        parse: ["everyone"],
      },
      partials: [Partials.Channel, Partials.Reaction, Partials.Message],
    });
    this.slashCommands = new Collection<string, SlashCommand>();
    this.textCommands = new Collection<string, TextCommand>();
    this.userContextMenus = new Collection<string, UserContextMenu>();
    this.messageContextMenus = new Collection<string, MessageContextMenu>();
    this.buttons = new Collection<string, Button>();
    this.cooldown = new Collection<string, Collection<string, number>>();
    this.db = new PrismaClient();
  }

  private async loadModules() {
    // SlashCommands
    const commandFolderPath = fileURLToPath(
      new URL("../../../Commands/Chat", import.meta.url)
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

    // Text Commands
    const messageFolderPath = fileURLToPath(
      new URL("../../../Commands/Text", import.meta.url)
    );
    const messageFolders = fs.readdirSync(messageFolderPath);

    for (const folder of messageFolders) {
      const messagePath = path.join(messageFolderPath, folder);
      const commandFiles = fs
        .readdirSync(messagePath)
        .filter((file) => file.endsWith(".js"));
      for (const file of commandFiles) {
        const filePath = path.join(messagePath, file);

        const text = (await dynamicImport(filePath)) as TextCommand;

        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ("data" in text && "run" in text) {
          this.textCommands.set(text.data.name, text);
        } else {
          console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "run" property.`
          );
        }
      }
    }

    // UserContextMenus
    const userContextMenuFolderPath = fileURLToPath(
      new URL("../../../Commands/User", import.meta.url)
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
      new URL("../../../Commands/Message", import.meta.url)
    );
    const messageContextMenuFolders = fs.readdirSync(
      messageContextMenuFolderPath
    ).filter((file) => file.endsWith(".js"))

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
      new URL("../../../Events", import.meta.url)
    );
    const eventFolder = fs.readdirSync(eventFolderPath);

    for (const folder of eventFolder) {
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

    // Buttons
    const buttonFolderPath = fileURLToPath(
      new URL("../../../Buttons", import.meta.url)
    );
    const buttonFolder = fs.readdirSync(buttonFolderPath);

    for (const folder of buttonFolder) {
      const buttonPath = path.join(buttonFolderPath, folder);
      const buttonFiles = fs
      .readdirSync(buttonPath)
      .filter((file) => file.endsWith(".js"));

      for (const file of buttonFiles) {
        const filePath = path.join(buttonPath, file);

        const button = (await dynamicImport(filePath)) as Button

        if ("data" in button && "run" in button) {
          this.buttons.set(button.data.id, button);
        } else {
          console.log(
            `[WARNING] The menu at ${filePath} is missing a required "data" or "run" property.`
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

    process.on("unhandledRejection", (reason) => {
      console.log(reason);
    });
    
    process.on("uncaughtException", (err) => {
      console.log(err);
    });
  }
}
