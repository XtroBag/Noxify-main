import { ContextMenuOptions } from "../typings.js";

export class ContextMenu {
    data: ContextMenuOptions['data'];
    run: ContextMenuOptions['run'];

    constructor(options: ContextMenuOptions) {
        this.data = options.data,
        this.run = options.run
    }
}