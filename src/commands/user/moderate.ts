import {
  ActionRowBuilder,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  ContextMenuCommandBuilder,
} from "discord.js";
import { UserContextMenu } from "../../types/classes/usercontext.js";
import { disabledButtonActionRows } from "../../utils/disableComponents.js";

export default new UserContextMenu({
  data: new ContextMenuCommandBuilder()
    .setName("actions")
    .setType(ApplicationCommandType.User),
  run: async (client, menu) => {

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents([
      new ButtonBuilder()
        .setLabel("Ban")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("Ban-Button"),
      new ButtonBuilder()
        .setLabel("Kick")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("Kick-Button"),
      new ButtonBuilder()
        .setLabel("Timeout")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("Timeout-Button"),
    ]);

    const reply = await menu.reply({
      components: [buttons],
    });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
    });

    collector.on("collect", async (button) => {
      switch (button.customId) {
        case "Ban-Button":
          {
            const message = await button.reply({
              content: "banning a user",
              fetchReply: true,
            });
            disabledButtonActionRows(message);
          }
          break;

        case "Kick-Button":
          {
            const message = await button.reply({
              content: "banning a user",
              fetchReply: true,
            });
            disabledButtonActionRows(message);
          }
          break;

        case "Timeout-Button":
          {
            const message = await button.reply({
              content: "banning a user",
              fetchReply: true,
            });
            disabledButtonActionRows(message);
          }
          break;
      }
    });

    collector.on("ignore", (button) => {});
  },
});
