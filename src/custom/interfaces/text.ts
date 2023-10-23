import { Message } from "discord.js";
import { Noxify } from "../classes/bot/client.js";

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
      ) => Promise<void>;
}