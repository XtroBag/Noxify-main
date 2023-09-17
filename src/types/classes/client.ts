import { Client, GatewayIntentBits, Collection, ClientEvents, Partials } from 'discord.js';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Event } from './event.js';
import { SlashCommand } from './slash.js';
import { TextCommand } from '../classes/text.js';
import { client } from '../../index.js';
import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';
import { EmbedCreator } from '../classes/embeds.js';

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
        this.db = new PrismaClient();
        this.embeds = new EmbedCreator();
    };

    private async loadModules() {
        //Commands
        const commandFolderPath = fileURLToPath(new URL('../../commands/slash', import.meta.url));
        const commandFolders = fs.readdirSync(commandFolderPath);

        for (const folder of commandFolders) {
            const commandPath = path.join(commandFolderPath, folder);
            const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const filePath = path.join(commandPath, file)

                const command = await dynamicImport(filePath) as SlashCommand;

                // Set a new item in the Collection with the key as the command name and the value as the exported module
                if ('data' in command && 'execute' in command) {
                    this.slash.set(command.data.name, command);
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                };
            };
        };

        //Events
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

                const command = await dynamicImport(filePath) as TextCommand;
                
                // Set a new item in the Collection with the key as the command name and the value as the exported module
                if ('data' in command && 'run' in command) {
                    this.text.set(command.data.name, command);
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
