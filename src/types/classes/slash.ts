import {
  type PermissionResolvable,
  type AutocompleteInteraction,
  ApplicationCommandData,
} from "discord.js";
import { NoxifyClient } from "./client.js";

interface CustomOptions {
  userPermissions?: PermissionResolvable;
  botPermissions?: PermissionResolvable;
  cooldown?: number;
  ownerOnly?: boolean;
  disabled?: boolean;
}

interface CommandOptions {
  data: ApplicationCommandData;
  opt: CustomOptions;
  auto?: (autocomplete: AutocompleteInteraction) => Promise<any>;
  execute: (
    client: NoxifyClient,
    interaction: any,
  ) => Promise<any>;
}

export class SlashCommand {
  data: CommandOptions["data"];
  opt: CommandOptions["opt"];
  auto?: CommandOptions["auto"];
  execute: CommandOptions["execute"];

  constructor(options: CommandOptions) {
    this.data = options.data;
    this.opt = options.opt;
    this.auto = options.auto;
    this.execute = options.execute;
  }
}
