import type { ClientEvents } from "discord.js";
import { EventOptions } from "../../interfaces/Event.js";

export class Event<Key extends keyof ClientEvents>
  implements EventOptions<Key>
{
  name: EventOptions<Key>["name"];
  once?: EventOptions<Key>["once"];
  execute: EventOptions<Key>["execute"];

  constructor(options: EventOptions<Key>) {
    this.name = options.name;
    this.once = options.once;
    this.execute = options.execute;
  }
}
