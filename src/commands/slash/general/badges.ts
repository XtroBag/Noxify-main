import { ChatInputCommandInteraction, UserFlagsString } from "discord.js";
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
  execute: async (client, interaction: ChatInputCommandInteraction<'cached'>) => {
    await interaction.deferReply({ ephemeral: true });

    const badges: UserFlagsString[] = [
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

    const badgeCounts: { [key: string]: number } = {};

    const members = await interaction.guild?.members.fetch();

    for (const badge of badges) {
      const usersWithBadge = members?.filter((member) => {
        const userFlags = member.user.flags;

        return userFlags?.has(badge);
      });

      badgeCounts[badge] = usersWithBadge?.size || 0;
    }

    //----------------------------------------------------------------

    const obj = { automod: [], supportsCommands: [] };

    function hasAutoModBadge(bot: any) {
      if ((bot.flags & (1 << 6)) !== 0) {
        return obj.automod.push({
          badge: BadgeEmojis.Automod,
          name: bot.name,
        });
      }
    }

    function hasSlashCommandsBadge(bot: any) {
      if ((bot.flags & (1 << 23)) !== 0) {
        return obj.supportsCommands.push({
          badge: BadgeEmojis.SupportsCommands,
          name: bot.name,
        });
      }
    }

    const bots = (await interaction.guild.members.fetch()).filter(
      (bots) => bots.user.bot
    );

    for (const bot of bots.values()) {
      const response = await fetch(
        `https://discord.com/api/v10/applications/${bot.id}/rpc`
      );
      const apiBot = await response.json();

      hasAutoModBadge(apiBot);
      hasSlashCommandsBadge(apiBot);
    }

    await interaction.editReply({
      embeds: [
        client.embeds.slashResponse(
          {
            description: `Server badges for ${interaction.guild.name}`,
            fields: [
              {
                name: "Badges:",
                value: `> ${BadgeEmojis.Staff} ›  ${
                  badgeCounts[BadgeStrings.Staff]
                } 
                > ${BadgeEmojis.ActiveDeveloper} ›  ${
                  badgeCounts[BadgeStrings.ActiveDeveloper]
                } 
                > ${BadgeEmojis.BugHunter1} ›  ${
                  badgeCounts[BadgeStrings.BugHunter1]
                } 
                > ${BadgeEmojis.BugHunter2} ›  ${
                  badgeCounts[BadgeStrings.BugHunter2]
                } 
                > ${BadgeEmojis.EarlySupporter} ›  ${
                  badgeCounts[BadgeStrings.EarlySupporter]
                } 
                > ${BadgeEmojis.HypeSquadBalance} ›  ${
                  badgeCounts[BadgeStrings.HypeSquadBalance]
                } 
                > ${BadgeEmojis.HypeSquadBravery} ›  ${
                  badgeCounts[BadgeStrings.HypeSquadBravery]
                } 
                > ${BadgeEmojis.HypeSquadBrilliance} ›  ${
                  badgeCounts[BadgeStrings.HypeSquadBrilliance]
                } 
                > ${BadgeEmojis.HypeSquadEvents} ›  ${
                  badgeCounts[BadgeStrings.HypeSquadEvents]
                } 
                > ${BadgeEmojis.PartneredServer} ›  ${
                  badgeCounts[BadgeStrings.PartneredServer]
                } 
                > ${BadgeEmojis.VerifiedDeveloper} ›  ${
                  badgeCounts[BadgeStrings.VerifiedDeveloper]
                } 
                > ${BadgeEmojis.ModeratorProgramsAlumni} ›  ${
                  badgeCounts[BadgeStrings.ModeratorProgramsAlumni]
                } 
                > ${BadgeEmojis.Automod} ›  ${obj.automod.length || 0} 
                > ${BadgeEmojis.SupportsCommands} ›  ${
                  obj.supportsCommands.length || 0
                } `,
              },
            ],
          },
          interaction
        ),
      ],
    });
  },
});
