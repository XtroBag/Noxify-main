import {
  ApplicationFlagsString,
  ChatInputCommandInteraction,
  UserFlagsString,
} from "discord.js";
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
  execute: async (
    client,
    interaction: ChatInputCommandInteraction<"cached">
  ) => {
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
      const users = members.filter((member) => {
        const userFlags = member.user.flags;

        return userFlags?.has(badge);
      });

      userBadgeCounts[badge] = users?.size || 0;
    }

    // the counts of this system are wrong NEED TO FIX !!
    const botBadgeCounts: { [key: string]: number } = {};

    const botBadges: ApplicationFlagsString[] = [
      "ApplicationAutoModerationRuleCreateBadge",
      "ApplicationCommandBadge",
    ];

    for (const badge of botBadges) {
      const bots = members.filter((bots) => {
        if (bots.user.bot === true) {
          const botFlags = bots.client.application.flags;

          return botFlags?.has(badge);
        }
      });

      botBadgeCounts[badge] = bots?.size || 0;
    }

    console.log(botBadgeCounts);

    await interaction.editReply({
      embeds: [
        client.embeds.generalResponse(
          {
            description: `Server badges for ${interaction.guild.name}`,
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
                }`,
                inline: true,
              },
              {
                name: "Bots:",
                value: `${BadgeEmojis.Automod} ›  ${
                  botBadgeCounts[BadgeStrings.AutoModerationBadge]
                }
                ${BadgeEmojis.SupportsCommands} ›  ${
                  botBadgeCounts[BadgeStrings.ApplicationCommandBadge]
                }
                `,
                inline: true,
              },
            ],
          },
          interaction
        ),
      ],
    });
  },
});
