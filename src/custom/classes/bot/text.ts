import { TextCommandOptions } from "../../interfaces/Text.js";

export class TextCommand {
    data: TextCommandOptions['data'];
    run: TextCommandOptions['run'];

    constructor(options: TextCommandOptions) {
        this.data = options.data,
        this.run = options.run
    }
}