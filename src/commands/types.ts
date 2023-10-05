import {
  ChatInputApplicationCommandData,
  AutocompleteInteraction,
  AutocompleteFocusedOption,
  ApplicationCommandOptionChoiceData,
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  UserContextMenuCommandInteraction,
  MessageContextMenuCommandInteraction,
} from "discord.js";
import { Noxify } from "../types/classes/client.js";
import { SlashCommandCustomOptions } from "../types/typings.js";

export interface SlashCommandOptions {
  data: ChatInputApplicationCommandData;
  opt: SlashCommandCustomOptions;
  autocomplete?: (
    interaction: AutocompleteInteraction,
    option: AutocompleteFocusedOption
  ) => Promise<ApplicationCommandOptionChoiceData[]>;
  execute: (
    client: Noxify,
    interaction: ChatInputCommandInteraction<"cached">
  ) => Promise<void>;
}

export interface UserContextMenuOptions {
  data: ContextMenuCommandBuilder;
  run: (
    client: Noxify,
    menu: UserContextMenuCommandInteraction
  ) => Promise<void>;
}

export interface MessageContextMenuOptions {
  data: ContextMenuCommandBuilder;
  run: (
    client: Noxify,
    menu: MessageContextMenuCommandInteraction
  ) => Promise<void>;
}
