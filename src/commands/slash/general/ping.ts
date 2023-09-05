import { ChatInputCommandInteraction, inlineCode } from "discord.js";
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
  execute: async (client, interaction: ChatInputCommandInteraction<'cached'>) => {

    // interaction.reply({ embeds: [new EmbedBuilder()
    //   .setTitle('Emoji Testing')
    //   .setDescription(`
    //   Hat: ${Emojis.Hat}
    //   Lightning: ${Emojis.Lightning}
    //   Diamond: ${Emojis.Diamond}
    //   Fire: ${Emojis.Fire}
    //   Warning: ${Emojis.Warning}
    //   Wrong: ${Emojis.Wrong}
    //   Correct: ${Emojis.Correct}
    //   ToggleOn: ${Emojis.ToggleOn}
    //   ToggleOff: ${Emojis.ToggleOff}
    //   Trash: ${Emojis.Trash}
    //   Permissions: ${Emojis.Permissions}
    //   Ping: ${Emojis.Ping}
    //   Shield: ${Emojis.Shield}
    //   Owner: ${Emojis.Owner}
    //   Picture: ${Emojis.Picture}
    //   Action: ${Emojis.Action}
    //   Settings: ${Emojis.Settings}
    //   Messages: ${Emojis.Messages}
    //   `)]})

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
