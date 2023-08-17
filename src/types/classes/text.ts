import { Message } from "discord.js";
import { NoxifyClient } from "../classes/client.js";

interface CommandOptions {
    data: {
        name: string,
        description: string,
        usage: string,
        ownerOnly: boolean;
        category: string;
    };
    run: (client?: NoxifyClient, message?: Message, args?: any) => Promise<any>;
};

export class TextClass {
    data: CommandOptions['data'];
    run?: CommandOptions['run'];

    constructor(options: CommandOptions) {
        this.data = options.data;
        this.run = options.run;
    };
};