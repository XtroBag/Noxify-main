import { ActivityType, PresenceStatusData } from "discord.js";

export type MessageCache = {
  replyMessageId: string;
  userMessageId: string;
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
