import { ActionRowBuilder, ButtonStyle, ComponentType, EmbedBuilder, StringSelectMenuBuilder } from "discord.js";
import { Button } from "../../Custom/Classes/Bot/Button.js";
import { Colors } from "../../Custom/Enums/Colors.js";
import { map } from "./AddRule.js";
import ms from "ms";

export default new Button({
  data: {
    customId: "timeout-member",
  },
  run: async ({ client, interaction }) => {

    const response = await interaction.update({
        components: [
          new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('timeout-time')
            .addOptions([
                {
                    label: '60 Seconds',
                    value: '60s',
                    description: 'Timeout the user for 60 seconds.',
                },
                {
                    label: '5 Minutes',
                    value: '5m',
                    description: 'Timeout the user for 5 minutes'
                },
                {
                    label: '10 Minutes',
                    value: '10m',
                    description: 'Timeout the user for 10 minutes'
                },
                {
                    label: '15 Minutes',
                    value: '15m',
                    description: 'Timeout the user for 15 minutes'
                },
                {
                    label: '25 Minutes',
                    value: '25m',
                    description: 'Timeout the user for 25 minutes'
                },
                {
                    label: '30 Minutes',
                    value: '30m',
                    description: 'Timeout the user for 30 minutes'
                },
                {
                    label: '1 Hours',
                    value: '1h',
                    description: 'Timeout the user for 1 hour'
                },
                {
                    label: '2 Hours',
                    value: '2h',
                    description: 'Timeout the user for 2 hours'
                }
            ])
            
          ),
        ],
        embeds: [new EmbedBuilder().setColor(Colors.Normal).setDescription('Please select the actions to take on execution')]
      });

      
    const menu = await response.awaitMessageComponent({
        componentType: ComponentType.StringSelect,
        filter: ({ user }) => user.id === interaction.user.id,
      });

      const value = menu.values.toString();
      /*const time =*/ms(value)

      map.get('finishedButtons').components[2].setDisabled(true).setStyle(ButtonStyle.Success)
      menu.update({ components: [map.get("finishedButtons")] });
  },
});
