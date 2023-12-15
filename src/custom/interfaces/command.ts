import {
  ApplicationCommandOptionChoiceData,
  AutocompleteFocusedOption,
  AutocompleteInteraction,
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  MessageContextMenuCommandInteraction,
  PermissionResolvable,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { Noxify } from "../Classes/Bot/Client.js";

export interface SlashCommandCustomOptions {
  userPerms?: PermissionResolvable;
  botPerms?: PermissionResolvable;
  cooldown?: number;
  ownerOnly?: boolean;
  disabled?: boolean;
}

export interface SlashCommandOptions {
  data: ChatInputApplicationCommandData;
  opt: SlashCommandCustomOptions;
  autocomplete?: ({
    client,
    interaction,
    option,
  }: {
    client: Noxify;
    interaction: AutocompleteInteraction;
    option: AutocompleteFocusedOption;
  }) => Promise<ApplicationCommandOptionChoiceData[]>;
  execute: ({
    client,
    interaction,
  }: {
    client: Noxify;
    interaction: ChatInputCommandInteraction<"cached">;
  }) => Promise<void>;
}

export interface UserContextMenuOptions {
  data: ContextMenuCommandBuilder;
  run: ({
    client,
    interaction
  }: { 
    client: Noxify,
    interaction: UserContextMenuCommandInteraction}) => Promise<void>;
}

export interface MessageContextMenuOptions {
  data: ContextMenuCommandBuilder;
  run: ({
    client,
    interaction
}: { client: Noxify, interaction: MessageContextMenuCommandInteraction }) => Promise<void>;
}
