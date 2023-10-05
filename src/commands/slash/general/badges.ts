import { UserFlagsString } from "discord.js";
import { SlashCommand } from "../../../types/classes/slash.js";
import { BadgeEmojis, BadgeStrings } from "../../../../config/config.js";

export default new SlashCommand({
  data: {
    name: "badges",
    description: "check the amount of badges in a server",
  },
  opt: {
    userPermissions: ["SendMessages"],
    botPermissions: ["SendMessages"],
    cooldown: 3,
    ownerOnly: false,
    disabled: false,
  },
  execute: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });

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

    const { automod, supportsCommands } = { automod: [], supportsCommands: [] };

    function hasAutoModBadge(bot: any) {
      if ((bot.flags & (1 << 6)) !== 0) {
        return automod.push({
          badge: BadgeEmojis.Automod,
          name: bot.name,
        });
      }
    }

    function hasSlashCommandsBadge(bot: any) {
      if ((bot.flags & (1 << 23)) !== 0) {
        return supportsCommands.push({
          badge: BadgeEmojis.SupportsCommands,
          name: bot.name,
        });
      }
    }

    for (const bot of members.filter((bot) => bot.user.bot === true).values()) {
      const response = await fetch(
        `https://discord.com/api/v10/applications/${bot.id}/rpc`
      );

      const api = await response.json();

      hasAutoModBadge(api);
      hasSlashCommandsBadge(api);
    }

    await interaction.editReply({
      embeds: [
        {
          title: `Server badges for ${interaction.guild.name}`,
          fields: [
            {
              name: "Users:",
              value: `${BadgeEmojis.Staff} ›  ${
                userBadgeCounts[BadgeStrings.Staff]
              } 
           ${BadgeEmojis.ActiveDeveloper} ›  ${
                userBadgeCounts[BadgeStrings.ActiveDeveloper]
              } 
           ${BadgeEmojis.BugHunter1} ›  ${
                userBadgeCounts[BadgeStrings.BugHunter1]
              } 
           ${BadgeEmojis.BugHunter2} ›  ${
                userBadgeCounts[BadgeStrings.BugHunter2]
              } 
           ${BadgeEmojis.EarlySupporter} ›  ${
                userBadgeCounts[BadgeStrings.EarlySupporter]
              } 
           ${BadgeEmojis.HypeSquadBalance} ›  ${
                userBadgeCounts[BadgeStrings.HypeSquadBalance]
              } 
           ${BadgeEmojis.HypeSquadBravery} ›  ${
                userBadgeCounts[BadgeStrings.HypeSquadBravery]
              } 
           ${BadgeEmojis.HypeSquadBrilliance} ›  ${
                userBadgeCounts[BadgeStrings.HypeSquadBrilliance]
              } 
           ${BadgeEmojis.HypeSquadEvents} ›  ${
                userBadgeCounts[BadgeStrings.HypeSquadEvents]
              } 
           ${BadgeEmojis.PartneredServer} ›  ${
                userBadgeCounts[BadgeStrings.PartneredServer]
              } 
           ${BadgeEmojis.VerifiedDeveloper} ›  ${
                userBadgeCounts[BadgeStrings.VerifiedDeveloper]
              } 
           ${BadgeEmojis.ModeratorProgramsAlumni} ›  ${
                userBadgeCounts[BadgeStrings.ModeratorProgramsAlumni]
              }
          ${BadgeEmojis.Username} › ${
                members.filter((member) => member.user.discriminator === "0")
                  .size
              }
          `,
              inline: true,
            },
            {
              name: "Bots:",
              value: `${BadgeEmojis.Automod} ›  ${automod.length || 0}
          ${BadgeEmojis.SupportsCommands} ›  ${supportsCommands.length || 0}
          `,
              inline: true,
            },
          ],
        },
      ],
    });
  },
});
