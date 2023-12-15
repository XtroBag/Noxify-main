import { Message } from "discord.js";
import { Noxify } from "../Classes/Bot/Client.js";
import { MessageCache } from "../Types/MsgCache.js";

export interface TextCommandOptions {
    data: {
        name: string;
        description: string;
        usage: string;
        ownerOnly: boolean;
      };
      run: (
        client: Noxify,
        message: Message,
        args: string[],
        cache: Set<MessageCache>
      ) => Promise<void>;
}