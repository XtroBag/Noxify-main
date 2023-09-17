import {
  APIEmbedField,
  ActivityType,
  ApplicationCommandData,
  AutocompleteInteraction,
  ClientEvents,
  Message,
  PermissionResolvable,
  PresenceStatusData,
} from "discord.js";
import { Noxify } from "./classes/client.js";

export type MessageCache = {
  replyMessageID: string;
  messageID: string;
};

export type OptionsEntry = {
  name?: string;
  state: string;
  type:
    | ActivityType.Watching
    | ActivityType.Listening
    | ActivityType.Playing
    | ActivityType.Streaming
    | ActivityType.Competing
    | ActivityType.Custom;
  status: PresenceStatusData;
};

export type Types = "boolean" | "number" | "string";

export interface Expansion {
  name: string;
  type: Types;
  label?: string | 'None';
  required: boolean
}

export interface Argument {
  name: string,
  required: boolean
}

export interface ExpansionObject {
  flag: string,
  exps: Array<Expansion>
}

export interface TextCommandOptions {
  data: {
    name: string;
    description: string;
    usage: string;
    ownerOnly: boolean;
    beta: boolean
    category?: string;
    arguments?: Array<Argument>;
    expansions?: ExpansionObject
  };
  run: (
    client?: Noxify,
    message?: Message,
    args?: string[],
  ) => Promise<any>;
}

export interface SlashCommandCustomOptions {
  userPermissions?: PermissionResolvable;
  botPermissions?: PermissionResolvable;
  cooldown?: number;
  ownerOnly?: boolean;
  disabled?: boolean;
}

export type InteractionType = any
 
export interface SlashCommandOptions {
  data: ApplicationCommandData;
  opt: SlashCommandCustomOptions;
  auto?: (autocomplete: AutocompleteInteraction) => Promise<AutocompleteInteraction>;
  execute: (client: Noxify, interaction: InteractionType) => Promise<InteractionType>; // this one
}

export interface EventOptions<Key extends keyof ClientEvents> {
  name: Key;
  once?: boolean;
  execute: (
    client: Noxify,
    ...args: ClientEvents[Key]
  ) => Promise<any> | any;
}

export interface CustomEmbedOptions {
  title?: string;
  description?: string;
  fields?: APIEmbedField[];
}