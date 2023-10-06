import { ClientEvents } from "discord.js";
import { Noxify } from "../classes/client.js";

export interface EventOptions<Key extends keyof ClientEvents> {
    name: Key;
    once?: boolean;
    execute: (
      client: Noxify,
      ...args: ClientEvents[Key]
    ) => Promise<ClientEvents[Key]> | any;
  }