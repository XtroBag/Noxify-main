import { Message } from "discord.js";
import { Noxify } from "../Classes/Bot/Client.js";

export type MessageCache = {
  messageID: string
  replyID: string
}

export const cache = new Set<MessageCache>();

type Categories = 'General' | 'Owner'

export interface TextCommandOptions {
  data: {
    name: string;
    description: string;
    usage: string;
    ownerOnly: boolean;
    category: Categories
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
