import { inlineCode } from "discord.js";
import { SlashCommand } from "../../../types/classes/slash.js";

export default new SlashCommand({
  data: {
    name: "ping",
    description: "ask the bot for the ping",
  },
  opt: {
    userPermissions: ["SendMessages"],
    botPermissions: ["SendMessages"],
    cooldown: 3,
    ownerOnly: false,
    disabled: false,
  },
  execute: async (client, interaction) => {

    const msg = await interaction.reply({
      content: "Pinging...",
      fetchReply: true,
    });

    setTimeout(() => {
      const ping = msg.createdTimestamp - interaction.createdTimestamp;
      interaction.editReply({
        content: `Pong! Latency is ${inlineCode(
          `${ping}ms`
        )}. \nAPI Latency is ${inlineCode(`${interaction.client.ws.ping}ms`)}`,
      });
    }, 3000);
  

  },
});
