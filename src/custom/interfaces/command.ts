import { ApplicationCommandOptionChoiceData, AutocompleteFocusedOption, AutocompleteInteraction, ChatInputApplicationCommandData, ChatInputCommandInteraction, ContextMenuCommandBuilder, MessageContextMenuCommandInteraction, PermissionResolvable, UserContextMenuCommandInteraction } from "discord.js";
import { Noxify } from "../classes/bot/client.js";

export interface SlashCommandCustomOptions {
    userPermissions?: PermissionResolvable;
    botPermissions?: PermissionResolvable;
    cooldown?: number;
    ownerOnly?: boolean;
    disabled?: boolean;
}

export interface SlashCommandOptions {
    data: ChatInputApplicationCommandData;
    opt: SlashCommandCustomOptions;
    autocomplete?: (
      client: Noxify,
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
  