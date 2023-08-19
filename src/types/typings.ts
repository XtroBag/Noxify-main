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
import { NoxifyClient } from "./classes/client.js";

export type MessageCache = {
  replyMessageID: string;
  messageID: string;
};

export type OptionsEntry = {
  name: string;
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
export type Defaults = boolean | number | string;

export interface Expansion {
  name: string;
  type: Types;
  label?: string | 'None';
  required: boolean
  defaultAction: Defaults;
}

export interface Argument {
  name: string,
  required: boolean
}

export interface TextCommandOptions {
  data: {
    name: string;
    description: string;
    usage: string;
    ownerOnly: boolean;
    beta: boolean
    category?: string;
    arguments?: Array<Argument>
  };
  expansions?: Array<Expansion>;
  run: (
    client?: NoxifyClient,
    message?: Message,
    expansions?: TextCommandOptions['expansions']/* thing here */
  ) => Promise<any>;
}

export interface SlashCommandCustomOptions {
  userPermissions?: PermissionResolvable;
  botPermissions?: PermissionResolvable;
  cooldown?: number;
  ownerOnly?: boolean;
  disabled?: boolean;
}

export interface SlashCommandOptions {
  data: ApplicationCommandData;
  opt: SlashCommandCustomOptions;
  auto?: (autocomplete: AutocompleteInteraction) => Promise<any>;
  execute: (client: NoxifyClient, interaction: any) => Promise<any>;
}

export interface EventOptions<Key extends keyof ClientEvents> {
  name: Key;
  once?: boolean;
  execute: (
    client: NoxifyClient,
    ...args: ClientEvents[Key]
  ) => Promise<any> | any;
}

export interface CustomEmbedOptions {
  description?: string;
  fields?: APIEmbedField[];
}