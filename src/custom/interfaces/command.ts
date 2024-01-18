import {
  ActionRowBuilder,
  ApplicationCommandOptionChoiceData,
  AutocompleteFocusedOption,
  AutocompleteInteraction,
  ButtonBuilder,
  ButtonInteraction,
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

interface SlashCommandExecuteOptions {
  client: Noxify;
  interaction: ChatInputCommandInteraction<"cached">;
}

interface SlashCommandAutoCompleteOptions {
  client: Noxify;
  interaction: AutocompleteInteraction;
  option: AutocompleteFocusedOption;
}

interface UserContextMenuRunOptions {
  client: Noxify;
  interaction: UserContextMenuCommandInteraction;
}

interface MessageContextMenuRunOptions {
  client: Noxify;
  interaction: MessageContextMenuCommandInteraction;
}

interface ButtonRunOptions {
  client: Noxify;
  interaction: ButtonInteraction;
  map: Map<string, ActionRowBuilder<ButtonBuilder>>;
}

export interface SlashCommandOptions {
  data: ChatInputApplicationCommandData;
  opt: SlashCommandCustomOptions;
  autocomplete?: (
    options: SlashCommandAutoCompleteOptions
  ) => ApplicationCommandOptionChoiceData[];
  execute: (options: SlashCommandExecuteOptions) => Promise<any>;
}

export interface UserContextMenuOptions {
  data: ContextMenuCommandBuilder;
  run: (options: UserContextMenuRunOptions) => Promise<any>;
}

export interface MessageContextMenuOptions {
  data: ContextMenuCommandBuilder;
  run: (options: MessageContextMenuRunOptions) => Promise<any>;
}

export interface ButtonOptions {
  data: { customId: string },
  run: (options: ButtonRunOptions) => Promise<any>;
}