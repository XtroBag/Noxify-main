import { MessageContextMenuOptions } from "../../commands/types.js";

export class MessageContextMenu {
    data: MessageContextMenuOptions['data'];
    run: MessageContextMenuOptions['run'];

    constructor(options: MessageContextMenuOptions) {
        this.data = options.data,
        this.run = options.run
    }
}