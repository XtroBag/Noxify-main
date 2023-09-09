import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  ComponentType,
  SelectMenuComponentOptionData,
  StringSelectMenuBuilder,
} from "discord.js";
import { SlashCommand } from "../../../types/classes/slash.js";

export default new SlashCommand({
  data: {
    name: "menu",
    description: "check a guild inside the database",
  },
  opt: {
    userPermissions: ["SendMessages"],
    botPermissions: ["SendMessages"],
    cooldown: 3,
    ownerOnly: true,
    disabled: false,
  },
  execute: async (
    client,
    interaction: ChatInputCommandInteraction<"cached">
  ) => {
    const options: SelectMenuComponentOptionData[] = [
      {
        label: "Test 1",
        value: "1",
        default: false,
        description: "this is not funny",
      },
      {
        label: "Test 2",
        value: "2",
        default: false,
        description: "no no no",
      },
      {
        label: "Test 3",
        value: "3",
        default: false,
        description: "boi if you dont get",
      },
    ];

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .addOptions(options)
        .setCustomId("test-menu")
        .setPlaceholder("pick a choice")
        .setMaxValues(3)
        .setMinValues(1)
    );

    const reply = await interaction.reply({ components: [row] });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      filter: ({ user }) => user.id === interaction.user.id,
    });

    collector.on("ignore", async (interaction) => {
      interaction.reply({
        content: `this menu is not for you ${interaction.user.globalName}`,
      });
    });

    collector.on("collect", async (interaction) => {
      if (interaction.customId === "test-menu") {

        const reply = await interaction.reply({
          content: `First Selection: \`\`${interaction.values.join(", ")}\`\``,
          fetchReply: true,
        });

        const { messageID } = [...new Set<{ messageID: string }>()
            .add({ messageID: reply.id })]
            .find(({ messageID }) => messageID === reply.id
        );

        if (messageID) {
          const msg = await interaction.channel.messages.fetch(messageID);
          await msg.edit({
            content: `New selection: \`\`${interaction.values.join(", ")}\`\``,
          });
        } else {
          // not sure what for here
        }

        // collector.stop() to make it stop listening after a selection
      }
    });
  },
});
