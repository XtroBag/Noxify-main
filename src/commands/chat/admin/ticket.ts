import {
  ApplicationCommandOptionType,
} from "discord.js";
import { SlashCommand } from "../../../custom/classes/bot/slash.js";

export default new SlashCommand({
  data: {
    name: "ticketmenu",
    description: "set yourself afk inside the guild",
    options: [
      {
        name: "option",
        description: "Select a action you need below",
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: "Create",
            value: "create",
          },
          {
            name: "Delete",
            value: "delete",
          },
        ],
        required: true,
      },
    ],
  },
  opt: {
    userPermissions: ["Administrator"], // maybe double think about this perm
    botPermissions: ["ManageChannels"],
    cooldown: 3,
    ownerOnly: false,
    disabled: true,
  },
  execute: async (client, interaction) => {
    // const option = interaction.options.getString("option");


  },
});
