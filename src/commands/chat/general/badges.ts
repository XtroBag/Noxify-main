import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ComponentType,
  EmbedBuilder,
  StringSelectMenuBuilder,
  UserFlagsString,
} from "discord.js";
import { SlashCommand } from "../../../Custom/Classes/Bot/Slash.js";
import { BadgeCustomNames, BadgeEmoji } from "../../../Custom/Enums/Badges.js";
import { ApplicationData } from "../../../Custom/Interfaces/Application.js";
import { Colors } from "../../../Custom/Enums/Colors.js";

export default new SlashCommand({
  data: {
    name: "badges",
    description: "get information about badges inside a guild",
    options: [
      {
        name: "option",
        description: "pick if you want a list or check users",
        type: ApplicationCommandOptionType.String,
        choices: [
          { name: "List", value: "list" },
          { name: "Check", value: "check" },
        ],
        required: true,
      },
    ],
  },
  opt: {
    userPerms: ["SendMessages"],
    botPerms: [],
    cooldown: 3,
    ownerOnly: false,
    disabled: false,
  },
  execute: async ({ client, interaction }) => {
    const option = interaction.options.getString("option");

    if (option === "list") {
      const members = await interaction.guild.members.fetch();

      const userBadges: UserFlagsString[] = [
        "ActiveDeveloper",
        "Staff",
        "BugHunterLevel1",
        "BugHunterLevel2",
        "PremiumEarlySupporter",
        "HypeSquadOnlineHouse1",
        "HypeSquadOnlineHouse2",
        "HypeSquadOnlineHouse3",
        "Hypesquad",
        "Partner",
        "VerifiedDeveloper",
        "CertifiedModerator",
      ];

      const userBadgeCounts: { [key: string]: number } = {};

      for (const badge of userBadges) {
        const users = members.filter((user) => user.user.flags.has(badge));
        userBadgeCounts[badge] = users?.size || 0;
      }

      //--------------------------------------------------------

      const automod = [];
      const supportsCommands = [];

      function hasAutoModBadge(bot: ApplicationData) {
        if ((bot.flags & (1 << 6)) !== 0) {
          return automod.push({
            badge: BadgeEmoji.Automod,
            name: bot.name,
          });
        }
      }

      function hasSlashCommandsBadge(bot: ApplicationData) {
        if ((bot.flags & (1 << 23)) !== 0) {
          return supportsCommands.push({
            badge: BadgeEmoji.SupportsCommands,
            name: bot.name,
          });
        }
      }

      for (const bot of members
        .filter((bot) => bot.user.bot === true)
        .values()) {
        const response = await fetch(
          `https://discord.com/api/v10/applications/${bot.id}/rpc`
        );

        const api = await response.json();

        hasAutoModBadge(api);
        hasSlashCommandsBadge(api);
      }

      const embed = new EmbedBuilder().setColor(Colors.Normal).addFields([
        {
          name: "Users:",
          value: `${BadgeEmoji.Staff} ›  ${
            userBadgeCounts[BadgeCustomNames.Staff]
          } 
   ${BadgeEmoji.ActiveDeveloper} ›  ${
            userBadgeCounts[BadgeCustomNames.ActiveDeveloper]
          } 
   ${BadgeEmoji.BugHunter1} ›  ${userBadgeCounts[BadgeCustomNames.BugHunter1]} 
   ${BadgeEmoji.BugHunter2} ›  ${userBadgeCounts[BadgeCustomNames.BugHunter2]} 
   ${BadgeEmoji.EarlySupporter} ›  ${
            userBadgeCounts[BadgeCustomNames.EarlySupporter]
          } 
   ${BadgeEmoji.HypeSquadBalance} ›  ${
            userBadgeCounts[BadgeCustomNames.HypeSquadBalance]
          } 
   ${BadgeEmoji.HypeSquadBravery} ›  ${
            userBadgeCounts[BadgeCustomNames.HypeSquadBravery]
          } 
   ${BadgeEmoji.HypeSquadBrilliance} ›  ${
            userBadgeCounts[BadgeCustomNames.HypeSquadBrilliance]
          } 
   ${BadgeEmoji.HypeSquadEvents} ›  ${
            userBadgeCounts[BadgeCustomNames.HypeSquad]
          } 
   ${BadgeEmoji.PartneredServer} ›  ${
            userBadgeCounts[BadgeCustomNames.Partner]
          } 
   ${BadgeEmoji.VerifiedDeveloper} ›  ${
            userBadgeCounts[BadgeCustomNames.VerifiedDeveloper]
          } 
   ${BadgeEmoji.ModeratorProgramsAlumni} ›  ${
            userBadgeCounts[BadgeCustomNames.ModeratorProgramsAlumni]
          }
  ${BadgeEmoji.Username} › ${
            members.filter((member) => member.user.discriminator === "0").size
          }
  `,
          inline: true,
        },
        {
          name: "Bots:",
          value: `${BadgeEmoji.Automod} ›  ${automod.length || 0}
                    ${BadgeEmoji.SupportsCommands} ›  ${
            supportsCommands.length || 0
          }
  `,
          inline: true,
        },
      ]);

      await interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
    } else if (option === "check") {
      const row = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
        new StringSelectMenuBuilder().setCustomId("badge-name").setOptions(
          {
            label: "ActiveDeveloper",
            value: "ActiveDeveloper" as UserFlagsString,
          },
          {
            label: "VerifiedDeveloper",
            value: "VerifiedDeveloper" as UserFlagsString,
          },
          {
            label: "Staff",
            value: "Staff" as UserFlagsString,
          },
          {
            label: "BugHunter1",
            value: "BugHunterLevel1" as UserFlagsString,
          },
          {
            label: "BugHunter2",
            value: "BugHunterLevel2" as UserFlagsString,
          },
          {
            label: "EarlySupporter",
            value: "PremiumEarlySupporter" as UserFlagsString,
          },
          {
            label: "HypeSquadBalance",
            value: "HypeSquadOnlineHouse3" as UserFlagsString,
          },
          {
            label: "HypeSquadBravery",
            value: "HypeSquadOnlineHouse1" as UserFlagsString,
          },
          {
            label: "HypeSquadBrilliance",
            value: "HypeSquadOnlineHouse2" as UserFlagsString,
          },
          {
            label: "HypeSquad",
            value: "Hypesquad" as UserFlagsString,
          },
          {
            label: "Partner",
            value: "Partner" as UserFlagsString,
          },
          {
            label: "ModeratorPrograms",
            value: "CertifiedModerator" as UserFlagsString,
          }
        )
      );

      const embed = new EmbedBuilder()
        .setDescription(`This will allow you to search for users by badge`)
        .setColor(Colors.Normal);

      interaction.reply({ components: [row], embeds: [embed], ephemeral: true });

      const collector = interaction.channel.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        filter: ({ user }) => user.id === interaction.user.id,
        time: 120000,
      });

      collector.on("collect", async (menu) => {
        if (menu.customId === "badge-name") {
          await menu.deferUpdate();

          const value = menu.values[0];

          let members: Array<string> = [];

          (await interaction.guild.members.fetch())
            .filter((member) => !member.user.bot)
            .find((member) => {
              if (
                member.user.flags.toArray().includes(value as UserFlagsString)
              )
                members.push(`<@${member.user.id}>`);
            });

          const maxLines = 5;
          const maxMembers = 4;

          let membersList: Array<string> = [];
          let lineCount = 0;

          if (members.length === 0) members.push("\`\`none\`\`");

          for (
            let i = 0;
            i < members.length && lineCount < maxLines;
            i += maxMembers
          ) {
            const remainingMembers = members.length - i;
            const currentLineMembers = members.slice(i, i + maxMembers);
            const line = currentLineMembers.map((member) => member).join(" • ");

            membersList.push(line);
            lineCount++;

            if (lineCount >= maxLines && remainingMembers > maxMembers) {
              membersList.push("...and more.");
              break;
            }
          }

          embed.setDescription(membersList.join("\n"));
          await menu.editReply({ embeds: [embed] });
        }
      });

      collector.on("ignore", async (menu) => {
        await menu.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("This menu is not for you")
              .setColor(Colors.Normal),
          ],
        });
      });

      collector.on("end", async (collected, reason) => {
        if (reason === "time") {
          collected.mapValues((menu, key) => {
            menu.deleteReply().catch(() => {
              return;
            });
          });
        }
      });
    }
  },
});
