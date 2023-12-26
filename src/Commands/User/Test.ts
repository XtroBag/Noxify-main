import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { UserContextMenu } from "../../Custom/Classes/Bot/UserContextMenu.js";

export default new UserContextMenu({
  data: new ContextMenuCommandBuilder()
    .setName("test")
    .setType(ApplicationCommandType.User),
  run: async ({ client, interaction }) => {},
});
