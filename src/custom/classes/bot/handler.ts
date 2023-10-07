import { config } from "../../../../config/config.js";
import { missingPerms } from "../../../functions/missingPerms.js";
import { Noxify } from "./client.js";
import { Collection, Interaction, bold, inlineCode } from "discord.js";

export class Handler {
  client: Noxify;
  constructor(opt: Noxify) {
    this.client = opt;
  }

  public async setHandler(interaction: Interaction) {
    if (interaction.isChatInputCommand()) {
      if (interaction.inCachedGuild()) {
        if (config.disabled.slash === true) {
          interaction.reply({
            content:
              "All commands are globally disabled currently, Try again later!",
            ephemeral: true,
          });
        } else {
          const command = interaction.client.slashCommands.get(
            interaction.commandName
          );

          if (!command?.data) {
            console.error(
              `No command matching ${interaction.commandName} was found.`
            );
            return interaction.reply({
              content: `⚠️ There is no command matching ${inlineCode(
                interaction.commandName
              )}!`,
              ephemeral: true,
            });
          }

          if (command.opt.disabled === true) {
            return interaction.reply({
              content: "Sorry, this command is disabled currently",
            });
          }

          if (command.opt.ownerOnly && config.ownerID !== interaction.user.id) {
            return interaction.reply({
              content: "Sorry, this command can only be used by the bot owner.",
            });
          }

          if (command.opt?.userPermissions) {
            const missingUserPerms = missingPerms(
              interaction.member.permissionsIn(interaction.channel),
              command.opt?.userPermissions
            )
              ? missingPerms(
                  interaction.member.permissionsIn(interaction.channel),
                  command.opt?.userPermissions
                )
              : missingPerms(
                  interaction.memberPermissions,
                  command.opt?.userPermissions
                );

            if (missingUserPerms?.length) {
              return interaction.reply({
                content: `You need the following permission${
                  missingUserPerms.length > 1 ? "s" : ""
                }: ${missingUserPerms.map((x) => inlineCode(x)).join(", ")}`,
                ephemeral: true,
              });
            }
          }

          if (command.opt?.botPermissions) {
            const missingBotPerms = missingPerms(
              interaction.guild.members.me.permissionsIn(interaction.channel),
              command.opt?.botPermissions
            )
              ? missingPerms(
                  interaction.guild.members.me.permissionsIn(
                    interaction.channel
                  ),
                  command.opt?.botPermissions
                )
              : missingPerms(
                  interaction.guild.members.me.permissions,
                  command.opt?.botPermissions
                );

            if (missingBotPerms?.length) {
              return interaction.reply({
                content: `I need the following permission${
                  missingBotPerms.length > 1 ? "s" : ""
                }: ${missingBotPerms.map((x) => inlineCode(x)).join(", ")}`,
                ephemeral: true,
              });
            }
          }

          if (command.opt?.cooldown) {
            if (
              !interaction.client.cooldown.has(
                `${command.data.name}-${interaction.guildId}`
              )
            ) {
              interaction.client.cooldown.set(
                `${command.data.name}-${interaction.guildId}`,
                new Collection()
              );
            }

            const now = Date.now();
            const timestamps = interaction.client.cooldown.get(
              `${command.data.name}-${interaction.guildId}`
            );
            const cooldownAmount = (command.opt.cooldown ?? 3) * 1000;

            if (timestamps.has(interaction.user.id)) {
              const expirationTime =
                timestamps.get(interaction.user.id) + cooldownAmount;

              if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;

                return interaction.reply({
                  content: `Please wait ${bold(
                    `${timeLeft.toFixed()} seconds`
                  )} before reusing this command!`,
                  ephemeral: true,
                });
              }
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(
              () => timestamps.delete(interaction.user.id),
              cooldownAmount
            );

            try {
              return await command.execute(this.client, interaction);
            } catch (error) {
              console.error(error);
              if (interaction.replied || interaction.deferred) {
                return await interaction.followUp({
                  content: `There was an error while executing this command: \n${error.message} \nCheck the console for more info.`,
                  ephemeral: true,
                });
              } else {
                return await interaction.reply({
                  content: `There was an error while executing this command: \n${error.message} \nCheck the console for more info.`,
                  ephemeral: true,
                });
              }
            }
          } else {
            try {
              return await command.execute(this.client, interaction);
            } catch (error) {
              console.error(error);
              if (interaction.replied || interaction.deferred) {
                return await interaction.followUp({
                  content: `There was an error while executing this command: \n${error.message} \nCheck the console for more info.`,
                  ephemeral: true,
                });
              } else {
                return await interaction.reply({
                  content: `There was an error while executing this command: \n${error.message} \nCheck the console for more info.`,
                  ephemeral: true,
                });
              }
            }
          }
        }
      }
    }

    if (interaction.isUserContextMenuCommand()) {
      const userContextMenu = this.client.userContextMenus.get(
        interaction.commandName
      );

      try {
        return await userContextMenu.run(this.client, interaction);
      } catch (error) {
        console.error(error);
      }
    }

    if (interaction.isMessageContextMenuCommand()) {
      const messageContextMenu = this.client.messageContextMenus.get(
        interaction.commandName
      );

      try {
        return await messageContextMenu.run(this.client, interaction);
      } catch (error) {
        console.error(error);
      }
    }

    if (interaction.isAutocomplete()) {
      const autocomplete = this.client.slashCommands.get(
        interaction.commandName
      );

      try {
        let option = interaction.options.getFocused(true);
        let choices = await autocomplete.autocomplete(this.client, interaction, option);
        await interaction.respond(choices?.slice(0, 25));
      } catch (error) {
        console.error(error);
      }
    }
  }
}
