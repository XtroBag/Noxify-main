import { Event } from "../../custom/classes/bot/event.js";
// import { ChannelType, EmbedBuilder } from "discord.js";
// import { Colors } from "../../enums/colors.js";

/*
    [NOTES]:
    Make the system use a database report channel the bot can make and the report feature from this will send a report in that channel
    Make my own custom (alert/warning) emoji to use and the bot will create that when it joins servers and if someone tries to delete it a prompt will show confirming the system wont work without it. (Or make system work around it)
    Make sure to go over permissions needed and check and also test everything
    Maybe make system check if there is already a channel with that name before creating a new one when joining servers
    I might make a noxify category for the channels to be made under
    */

export default new Event({
  name: "messageReactionAdd",
  once: false,
  async execute(client, reaction, user) {

    // turn this into a feature just for the owner too either eval or something else
    // if (reaction.emoji.name === "❌") {
    //   const embed = new EmbedBuilder()
    //     .setDescription("Message was reported to staff")
    //     .setColor(Colors.Normal);

    //   await reaction.message.reply({
    //     embeds: [embed],
    //     flags: ["SuppressNotifications"],
    //   });

    //   const data = await client.db.guild.findUnique({
    //     where: {
    //       guildID: reaction.message.guildId,
    //     },
    //   });

    //   const channel = await reaction.message.guild.channels.fetch(data.logsID);

    //   if (channel.type === ChannelType.GuildText) {
    //     channel.send({
    //       embeds: [
    //         new EmbedBuilder()
    //           .setTitle("Message Reported")
    //           .setDescription(`A user has reported a message`)
    //           .addFields([
    //             {
    //               name: "Reporter:",
    //               value: `<@${reaction.message.member.id}>`,
    //               inline: true,
    //             },
    //             {
    //               name: "Message:",
    //               value: `${reaction.message.url}`,
    //               inline: true,
    //             },
    //           ]),
    //       ],
    //     });
    //   }
    // }
  },
});
