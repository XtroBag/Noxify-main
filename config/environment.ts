import { Collection } from 'discord.js';
import { SlashCommand } from '../src/custom/classes/bot/slash.js';
import { PrismaClient } from '@prisma/client';
import { UserContextMenu } from '../src/custom/classes/bot/usercontextmenu.js';
import { MessageContextMenu } from '../src/custom/classes/bot/messagecontextmenu.js';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string;
            CLIENT_ID: string;
            GUILD_ID: string;
            URI: string;
            HYPIXEL_KEY: string;
        }
    }
}

declare module 'discord.js' {
    interface Client {
        slashCommands: Collection<string, SlashCommand>;
        userContextMenus: Collection<string, UserContextMenu>
        messageContextMenus: Collection<string, MessageContextMenu>;
        cooldown: Collection<string, Collection<string, number>>;
        db: PrismaClient;
    }
}

export { };