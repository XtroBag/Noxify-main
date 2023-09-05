import { inlineCode, Collection, bold } from "discord.js";
import { Event } from "../../types/classes/event.js";
import { missingPerms } from "../../functions/util.js";
import { config } from "../../../config/config.js";

export default new Event({
  name: "interactionCreate",
  async execute(client, interaction) {
    if (interaction.isCommand()) {
      if (interaction.inCachedGuild()) {
        if (config.disabled.slash === true) {
          interaction.reply({
              embeds: [client.embeds.errorResponse({ description: 'All commands are globally disabled currently, Try again later!'}, interaction)],
              ephemeral: true
          });
        } else {
          const command = interaction.client.slash.get(interaction.commandName);

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

            //-----------------------------------------------------------------
            // MAKE SLASH COMMAND USAGE COUNT SYSTEM HERE
 

          //   const usage = new Map();
            
          // usage.set('count', 0)

          // function increaseCount() {
          // const currentCount = usage.get('count');
          // usage.set('count', currentCount + 1);
          // }

          // console.log('Initial count:', usage.get('count'));
          
          // increaseCount();
          // console.log('Updated count:', usage.get('count'));
            

            //-----------------------------------------------------------------

            try {
              await command.execute(client, interaction);
            } catch (error) {
              console.error(error);
              if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                  content: `There was an error while executing this command: \n${error.message} \nCheck the console for more info.`,
                  ephemeral: true,
                });
              } else {
                await interaction.reply({
                  content: `There was an error while executing this command: \n${error.message} \nCheck the console for more info.`,
                  ephemeral: true,
                });
              }
            }
          } else {
            try {
              await command.execute(client, interaction);
            } catch (error) {
              console.error(error);
              if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                  content: `There was an error while executing this command: \n${error.message} \nCheck the console for more info.`,
                  ephemeral: true,
                });
              } else {
                await interaction.reply({
                  content: `There was an error while executing this command: \n${error.message} \nCheck the console for more info.`,
                  ephemeral: true,
                });
              }
            }
          }
        }
      }
    }

    if (interaction.isAutocomplete()) {
      const autocomplete = client.slash.get(interaction.commandName);

      try {
        await autocomplete.auto(interaction);
      } catch (error) {
        console.error(error);
      }
    }

    if (interaction.isModalSubmit()) {
    }
  },
});