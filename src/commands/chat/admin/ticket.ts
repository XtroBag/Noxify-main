import { SlashCommand } from "../../../Custom/Classes/Bot/Slash.js";

export default new SlashCommand({
  data: {
    name: "ticketmenu",
    description: "set yourself afk inside the guild",
    options: [],
  },
  opt: {
    userPerms: [],
    botPerms: [],
    cooldown: 3,
    ownerOnly: false,
    disabled: false,
  },
  execute: async ({ client, interaction }) => {},
});
