import { ClientEvents } from "discord.js";
import { Noxify } from "../Classes/Bot/Client.js";

export interface EventOptions<K extends keyof ClientEvents> {
    name: K;
    once?: boolean;
    execute: (client: Noxify, ...args: ClientEvents[K]) => Promise<ClientEvents[K]> | any,
  }