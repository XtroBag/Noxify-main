import { Message } from "discord.js";
import { Noxify } from "../Classes/Bot/Client.js";
import { MessageCache } from "../Types/MsgCache.js";

export const cache = new Set<MessageCache>();

export interface TextCommandOptions {
  data: {
    name: string;
    description: string;
    usage: string;
    ownerOnly: boolean;
    category: string;
    aliases: string[];
  };
  run: ({
    client,
    message,
    args,
    cache,
  }: {
    client: Noxify;
    message: Message;
    args: string[];
    cache: Set<MessageCache>;
  }) => Promise<any>;
}
