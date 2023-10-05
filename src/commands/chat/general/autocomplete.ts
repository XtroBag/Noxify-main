import { ApplicationCommandOptionType } from "discord.js";
import { SlashCommand } from "../../../types/classes/slash.js";

export default new SlashCommand({
  data: {
    name: "autocomplete",
    description: "test a new autocomplete feature",
    options: [
      {
        name: "users",
        description: "cool testing",
        type: ApplicationCommandOptionType.String,
        autocomplete: true,
      },
    ],
  },
  opt: {
    userPermissions: ["SendMessages"],
    botPermissions: ["SendMessages"],
    cooldown: 3,
    ownerOnly: false,
    disabled: false,
  },

  autocomplete: async (interaction, option) => {
    let choices: string[];

    if (option.name === "users") {
      const members = await interaction.guild.members.fetch();
      const filtered = members.filter(member => !member.user.bot)
      const values = filtered.map((member) => member.user.username);

      choices = values;
    }

    const items = choices
      .filter((choice) => choice.startsWith(option.value))
      .map((choice) => ({ name: choice, value: choice }));

    return items;
  },
  execute: async (client, interaction) => {
    const choice = interaction.options.getString("users");

    interaction.reply({ content: `You picked ${choice}` })
  },
});
