import { Client, GatewayIntentBits, Collection, ClientEvents, Partials } from 'discord.js';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Event } from './event.js';
import { SlashCommand } from './slash.js';
import { TextCommand } from '../classes/text.js';
import { client } from '../../index.js';
import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';
import { ContextMenu } from './context.js';

const dynamicImport = (path: string) => import(pathToFileURL(path).toString()).then((module) => module?.default);

export class Noxify extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.DirectMessages,
                // GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildMembers,
                // GatewayIntentBits.MessageContent,
            ],
            rest: {
                retries: 3,
                timeout: 15_000
            },
            allowedMentions: {
                parse: ['everyone']
            },
            partials: [Partials.Channel]
        });
        this.slash = new Collection<string, SlashCommand>();
        this.cooldown = new Collection<string, Collection<string, number>>();
        this.text = new Collection<string, TextCommand>();
        this.context = new Collection<string, ContextMenu>()
        this.db = new PrismaClient();
        this.helpers = {}
    };

    

    private async loadModules() {
        // SlashCommands
        const commandFolderPath = fileURLToPath(new URL('../../commands/chat', import.meta.url));
        const commandFolders = fs.readdirSync(commandFolderPath);

        for (const folder of commandFolders) {
            const commandPath = path.join(commandFolderPath, folder);
            const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const filePath = path.join(commandPath, file)

                const slash = await dynamicImport(filePath) as SlashCommand;

                // Set a new item in the Collection with the key as the command name and the value as the exported module
                if ('data' in slash && 'execute' in slash) {
                    this.slash.set(slash.data.name, slash);
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                };
            };
        };

        // ContextMenus
        const contextMenuFolderPath = fileURLToPath(new URL('../../commands/user', import.meta.url));
        const contextMenuFolders = fs.readdirSync(contextMenuFolderPath).filter(file => file.endsWith('.js'));
        
        for (const file of contextMenuFolders) {
            const filePath = path.join(contextMenuFolderPath, file)

            const menu = await dynamicImport(filePath) as ContextMenu;

            if ('data' in menu && 'run' in menu) {
                this.context.set(menu.data.name, menu)
            } else {
                console.log(`[WARNING] The menu at ${filePath} is missing a required "data" or "run" property.`)
            }
        }

        // Events
        const eventFolderPath = fileURLToPath(new URL('../../events', import.meta.url));
        const eventFolder = fs.readdirSync(eventFolderPath);

        for (const folder of eventFolder) {
            const eventPath = path.join(eventFolderPath, folder);
            const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith('.js'));
            for (const file of eventFiles) {
                const filePath = path.join(eventPath, file)

                const event = await dynamicImport(filePath) as Event<keyof ClientEvents>;

                if ('name' in event && 'execute' in event) {
                    if (event.once) {
                        this.once(event.name, (...args) => event.execute(client, ...args));
                    } else {
                        this.on(event.name, (...args) => event.execute(client, ...args));
                    }
                } else {
                    console.log(`[WARNING] The event at ${filePath} is missing a required "name" or "execute" property.`);
                };
            }
        }

        const messageFolderPath = fileURLToPath(new URL('../../commands/text', import.meta.url));
        const messageFolders = fs.readdirSync(messageFolderPath);

        for (const folder of messageFolders) {
            const messagePath = path.join(messageFolderPath, folder);
            const commandFiles = fs.readdirSync(messagePath).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const filePath = path.join(messagePath, file)

                const text = await dynamicImport(filePath) as TextCommand;
                
                // Set a new item in the Collection with the key as the command name and the value as the exported module
                if ('data' in text && 'run' in text) {
                    this.text.set(text.data.name, text);
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "run" property.`);
                };
            };
        };
    };

    /**
     * This is used to log into the Discord API with loading all commands and events.
     */
    start() {
        this.login(process.env.TOKEN);
        this.loadModules();
    };
};
