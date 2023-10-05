import { Collection } from 'discord.js';
import { SlashCommand } from '../src/types/classes/slash.js';
import { TextCommand } from '../src/types/classes/text.js';
import { PrismaClient } from '@prisma/client';
import { ContextMenu } from '../src/types/classes/context.js';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string;
            CLIENT_ID: string;
            GUILD_ID: string;
            URI: string;
        }
    }
}

declare module 'discord.js' {
    interface Client {
        slash: Collection<string, SlashCommand>;
        cooldown: Collection<string, Collection<string, number>>;
        text: Collection<string, TextCommand>;
        context: Collection<string, ContextMenu>
        db: PrismaClient;
        helpers: {}
    }
}

export { };