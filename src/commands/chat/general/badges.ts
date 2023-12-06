import { UserFlagsString } from "discord.js";
import { SlashCommand } from "../../../custom/classes/bot/slash.js";
import { BadgeEmoji } from "../../../custom/enums/badges.js";
import { BadgeString } from "../../../custom/enums/badges.js";
import { ApplicationData } from "../../../custom/interfaces/application.js";

export default new SlashCommand({
  data: {
    name: "badges",
    description: "check the amount of badges in a server",
  },
  opt: {
    userPerms: [],
    botPerms: [],
    cooldown: 3,
    ownerOnly: false,
    disabled: false,
  },
  execute: async ({ client, interaction }) => {
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

    const { automod, supportsCommands } = { 
      automod: [], 
      supportsCommands: [] 
    };

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
              value: `${BadgeEmoji.Staff} ›  ${
                userBadgeCounts[BadgeString.Staff]
              } 
           ${BadgeEmoji.ActiveDeveloper} ›  ${
                userBadgeCounts[BadgeString.ActiveDeveloper]
              } 
           ${BadgeEmoji.BugHunter1} ›  ${
                userBadgeCounts[BadgeString.BugHunter1]
              } 
           ${BadgeEmoji.BugHunter2} ›  ${
                userBadgeCounts[BadgeString.BugHunter2]
              } 
           ${BadgeEmoji.EarlySupporter} ›  ${
                userBadgeCounts[BadgeString.EarlySupporter]
              } 
           ${BadgeEmoji.HypeSquadBalance} ›  ${
                userBadgeCounts[BadgeString.HypeSquadBalance]
              } 
           ${BadgeEmoji.HypeSquadBravery} ›  ${
                userBadgeCounts[BadgeString.HypeSquadBravery]
              } 
           ${BadgeEmoji.HypeSquadBrilliance} ›  ${
                userBadgeCounts[BadgeString.HypeSquadBrilliance]
              } 
           ${BadgeEmoji.HypeSquadEvents} ›  ${
                userBadgeCounts[BadgeString.HypeSquadEvents]
              } 
           ${BadgeEmoji.PartneredServer} ›  ${
                userBadgeCounts[BadgeString.PartneredServer]
              } 
           ${BadgeEmoji.VerifiedDeveloper} ›  ${
                userBadgeCounts[BadgeString.VerifiedDeveloper]
              } 
           ${BadgeEmoji.ModeratorProgramsAlumni} ›  ${
                userBadgeCounts[BadgeString.ModeratorProgramsAlumni]
              }
          ${BadgeEmoji.Username} › ${
                members.filter((member) => member.user.discriminator === "0")
                  .size
              }
          `,
              inline: true,
            },
            {
              name: "Bots:",
              value: `${BadgeEmoji.Automod} ›  ${automod.length || 0}
          ${BadgeEmoji.SupportsCommands} ›  ${supportsCommands.length || 0}
          `,
              inline: true,
            },
          ],
        },
      ],
    });
  },
});
