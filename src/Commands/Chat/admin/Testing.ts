import { SlashCommand } from "../../../Custom/Classes/Bot/Slash.js";

export default new SlashCommand({
  data: {
    name: "testing",
    description: "test any quick features added here",
    options: [],
  },
  opt: {
    userPerms: ['SendMessages'],
    botPerms: [],
    cooldown: 3,
    ownerOnly: false,
    disabled: false,
  },
  execute: async ({ client, interaction }) => {

  },
});
