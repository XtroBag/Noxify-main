import {
  ActionRowBuilder,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
} from "discord.js";
import { SlashCommand } from "../../../types/classes/slash.js";
import { Colors, Emojis } from "../../../../config/config.js";
import { disabledButtonActionRows } from "../../../functions/disableComponents.js";

export default new SlashCommand({
  data: {
    name: "toggle",
    description: "Toggle a boolean with prisma",
    type: ApplicationCommandType.ChatInput,
  },
  opt: {
    userPermissions: [],
    botPermissions: [],
    cooldown: 3,
    ownerOnly: false,
    disabled: false,
  },
  execute: async (client, interaction: ChatInputCommandInteraction<'cached'>) => {

    // NOTES:
    // If wanted fix the system to disable the buttons on the selected button embeds and after the "end" event happens disable the buttons on those pages
    // and make it so the buttons can be clicked at any point until it ends

    const toggle = await client.db.toggle.findFirst({
      where: { guildId: interaction.guildId },
    });

    const embed = new EmbedBuilder()
      .setDescription(
        `current mode: ${toggle.mode ? Emojis.ToggleOn : Emojis.ToggleOff}`
      )
      .setFooter({
        text: `Noxify • ${interaction.user.globalName}`,
        iconURL: client.user.displayAvatarURL({ extension: "png" }),
      })
      .setColor(Colors.Normal);

    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId("enable-button")
        .setStyle(ButtonStyle.Success)
        .setLabel("Enable"),
      new ButtonBuilder()
        .setCustomId("disable-button")
        .setStyle(ButtonStyle.Danger)
        .setLabel("Disable")
    );

    const reply = await interaction.reply({
      components: [row],
      embeds: [embed],
      fetchReply: true,
    });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter: ({ user }) => user.id === interaction.user.id,
      time: 10000
    });

    collector.on("ignore", async (i) => {
      await i.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `${Emojis.Failed} \`\` This interaction is not for you \`\``
            )
            .setFooter({
              text: `Noxify • ${interaction.user.globalName}`,
              iconURL: client.user.displayAvatarURL({ extension: "png" }),
            })
            .setColor(Colors.Normal),
        ],
        ephemeral: true,
      });
    });

    collector.on("collect", async (i) => {
      if (i.customId === "enable-button") {
        await client.db.toggle.updateMany({
          where: {
            guildId: i.guildId,
          },
          data: {
            mode: true,
          },
        });

        const embed = new EmbedBuilder()
          .setDescription(`Set too enable`)
          .setFooter({
            text: `Noxify • ${interaction.user.globalName}`,
            iconURL: client.user.displayAvatarURL({ extension: "png" }),
          })
          .setColor(Colors.Normal);

        const components = disabledButtonActionRows(reply);
        await i.update({ components: components, embeds: [embed] });
      }

      if (i.customId === "disable-button") {
        await client.db.toggle.updateMany({
          where: {
            guildId: i.guildId,
          },
          data: {
            mode: false,
          },
        });

        const embed = new EmbedBuilder()
          .setDescription(`Set to disable`)
          .setFooter({
            text: `Noxify • ${interaction.user.globalName}`,
            iconURL: client.user.displayAvatarURL({ extension: "png" }),
          })
          .setColor(Colors.Normal);

        const components = disabledButtonActionRows(reply);
        await i.update({ components: components, embeds: [embed] });
      }
    });

    collector.on("end", async (i, reason) => {
      if (i.size > 0) return;

      if (reason === "time") {
        console.log("ended");

        await reply
          .edit({
            components: [],
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `${Emojis.Information} \`\` You didn't select an option in time \`\` `
                )
                .setFooter({
                  text: `Noxify • ${interaction.user.globalName}`,
                  iconURL: client.user.displayAvatarURL({ extension: "png" }),
                })
                .setColor(Colors.Normal),
            ],
          })
          .then((msg) => {
            setTimeout(async () => {
              if (msg.deletable) {
                await msg.delete().catch(() => {});
              }
            }, 7000);
          });
      }
    });
  },
});
