import { Collection } from 'discord.js';
import { SlashCommand } from '../src/types/classes/slash.js';
import { PrismaClient } from '@prisma/client';
import { UserContextMenu } from '../src/types/classes/usercontextmenu.js';
import { MessageContextMenu } from '../src/types/classes/messagecontextmenu.js';

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
        slashCommands: Collection<string, SlashCommand>;
        userContextMenus: Collection<string, UserContextMenu>
        messageContextMenus: Collection<string, MessageContextMenu>;
        cooldown: Collection<string, Collection<string, number>>;
        db: PrismaClient;
        helpers: {}
    }
}

export { };