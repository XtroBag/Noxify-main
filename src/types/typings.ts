import {
  ActivityType,
  PermissionResolvable,
  PresenceStatusData,
} from "discord.js";
import { Noxify } from "./classes/client.js";

export interface HandlerOptions {
  bot: Noxify
}

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

export interface SlashCommandCustomOptions {
  userPermissions?: PermissionResolvable;
  botPermissions?: PermissionResolvable;
  cooldown?: number;
  ownerOnly?: boolean;
  disabled?: boolean;
}
