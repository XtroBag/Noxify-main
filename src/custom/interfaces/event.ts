import { ClientEvents } from "discord.js";
import { Noxify } from "../classes/bot/client.js";

export interface EventOptions<K extends keyof ClientEvents> {
    name: K;
    once?: boolean;
    execute: (
      client: Noxify,
      ...args: ClientEvents[K]
    ) => Promise<ClientEvents[K]> | any;
  }