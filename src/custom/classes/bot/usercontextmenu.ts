import { UserContextMenuOptions } from "../../interfaces/command.js";

export class UserContextMenu {
    data: UserContextMenuOptions['data'];
    run: UserContextMenuOptions['run'];

    constructor(options: UserContextMenuOptions) {
        this.data = options.data,
        this.run = options.run
    }
}