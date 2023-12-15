import { Collection } from 'discord.js';
import { SlashCommand } from '../Custom/Classes/Bot/Slash.js';
import { PrismaClient } from '@prisma/client';
import { UserContextMenu } from '../Custom/Classes/Bot/UserContextMenu.js';
import { MessageContextMenu } from '../Custom/Classes/Bot/MessageContextMenu.js';
import { TextCommand } from '../Custom/Classes/Bot/Text.js';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string;
            CLIENT_ID: string;
            GUILD_ID: string;
            DATABASE_URL: string;
            HYPIXEL_KEY: string;
            BASE_URL: string;
        }
    }
}

declare module 'discord.js' {
    interface Client {
        slashCommands: Collection<string, SlashCommand>;
        textCommands: Collection<string, TextCommand>
        userContextMenus: Collection<string, UserContextMenu>
        messageContextMenus: Collection<string, MessageContextMenu>;
        cooldown: Collection<string, Collection<string, number>>;
        db: PrismaClient;
    }
}

export { };