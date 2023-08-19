import { TextCommandOptions } from "../typings.js";

export class TextCommand {
    data: TextCommandOptions['data'];
    arguments?: TextCommandOptions['arguments']
    run?: TextCommandOptions['run'];

    constructor(options: TextCommandOptions) {
        this.data = options.data;
        this.run = options.run;
    };
};