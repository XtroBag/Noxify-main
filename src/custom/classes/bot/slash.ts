import { SlashCommandOptions } from "../../Interfaces/Command.js";

export class SlashCommand {
  data: SlashCommandOptions["data"];
  opt: SlashCommandOptions["opt"];
  autocomplete?: SlashCommandOptions["autocomplete"];
  execute: SlashCommandOptions["execute"];

  constructor(options: SlashCommandOptions) {
    this.data = options.data;
    this.opt = options.opt;
    this.autocomplete = options.autocomplete;
    this.execute = options.execute;
  }
}
