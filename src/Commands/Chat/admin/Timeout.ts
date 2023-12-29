import { ApplicationCommandOptionType } from "discord.js";
import { SlashCommand } from "../../../Custom/Classes/Bot/Slash.js";

export default new SlashCommand({
  data: {
    name: "timeout",
    description: "Timeout a member in this guild",
    options: [
      {
        name: "member",
        description: "The user to timeout",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
    ],
  },
  opt: {
    userPerms: ['SendMessages', 'ModerateMembers'],
    botPerms: ['ModerateMembers'],
    cooldown: 3,
    ownerOnly: false,
    disabled: false,
  },
  execute: async ({ client, interaction }) => {
    // const member = interaction.options.getMember('member');

    
  },
});
