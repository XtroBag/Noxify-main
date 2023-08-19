import { SlashCommandOptions } from "../typings.js";

export class SlashCommand {
  data: SlashCommandOptions["data"];
  opt: SlashCommandOptions["opt"];
  auto?: SlashCommandOptions["auto"];
  execute: SlashCommandOptions["execute"];

  constructor(options: SlashCommandOptions) {
    this.data = options.data;
    this.opt = options.opt;
    this.auto = options.auto;
    this.execute = options.execute;
  }
}
