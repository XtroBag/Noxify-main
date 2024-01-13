import { ButtonOptions } from "../../Interfaces/Command.js";

export class Button {
    data: ButtonOptions['data'];
    run: ButtonOptions['run'];
    constructor(options: ButtonOptions) {
        this.data = options.data,
        this.run = options.run
    }
}