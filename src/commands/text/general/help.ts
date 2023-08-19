// import {
//   ActionRowBuilder,
//   EmbedBuilder,
//   ComponentType,
//   StringSelectMenuBuilder,
// } from "discord.js";
import { TextCommand } from "../../../types/classes/text.js";
// import { cache } from "../../../functions/messageCache.js";

export default new TextCommand({
  data: {
    name: "help",
    description: "informaton about commands",
    usage: "help <cmd>",
    ownerOnly: false,
    beta: false,
    category: "general",
  },
  async run(client, message, args) {

//     if (!args[0]) {
//       const emojis = {
//         general: "🧶",
//         owner: "🪶",
//         fun: "🎈",
//         admin: "🎫"
//       };

//       const directories = [
//         ...new Set(message.client.text.map((cmd) => cmd.data.category)),
//       ];

//       const formatString = (str) =>
//         `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

//       const categories = directories.map((dir) => {
//         const getCommands = message.client.text
//           .filter((cmd) => cmd.data.category === dir)
//           .map((cmd) => {
//             return {
//               name: cmd.data.name,
//               description: cmd.data.description || "Command has no description",
//             };
//           });

//         return {
//           directory: formatString(dir),
//           commands: getCommands,
//         };
//       });


//       const embed = new EmbedBuilder().setDescription(
//         "Please choose a category in the select menu"
//       ).setFooter({ text: `Use help {cmd} to search for only one` })

//       const components = (state: boolean) => [
//         new ActionRowBuilder<StringSelectMenuBuilder>().addComponents([
//           new StringSelectMenuBuilder()
//             .setCustomId("custom")
//             .setPlaceholder("Please Select a category")
//             .setDisabled(state)
//             .addOptions(
//               categories.map((cmd) => {
//                 return {
//                   label: cmd.directory,
//                   value: cmd.directory.toLowerCase(),
//                   description: `Commands are from ${cmd.directory} category`,
//                   emoji: emojis[cmd.directory.toLowerCase() || null],
//                 };
//               })
//             ),
//         ]),
//       ];

//       const initialMessage = await message
//         .reply({
//           embeds: [embed],
//           components: components(false),
//         })
//         .catch((err) => {
//           console.log(err);
//         }); // error is being logged from here in the file - PROBLEM

//       if (!initialMessage) return;

//       messageCache.add({
//         replyMessageId: initialMessage.id,
//         userMessageId: message.id
//       })

//       const filter = (interaction) => interaction.isStringSelectMenu();

//       const collector =
//         initialMessage.createMessageComponentCollector<ComponentType.StringSelect>(
//           {
//             componentType: ComponentType.StringSelect,
//             filter: filter,
//             time: 30000,
//           }
//         );

//       collector.on("collect", async (msg) => {
//         if (msg.user.id !== message.author.id) {
//           await message.channel.send({
//             content: `<@${msg.user.id}>, You cannot use this interaction!`,
//           });
//         } else {
//           const [directory] = msg.values;
//           const category = categories.find(
//             (x) => x.directory.toLowerCase() === directory
//           );

//           const categoryEmbed = new EmbedBuilder()
//             .setTitle(`${formatString(directory)} commands`)
//             .setDescription(
//               `A list of all the commands categorized under ${directory}`
//             )
//             .addFields(
//               category.commands.map((cmd) => {
//                 return {
//                   name: `\`${cmd.name}\``,
//                   value: `${cmd.description}`,
//                   inline: true,
//                 };
//               })
//             );

//           msg.update({ embeds: [categoryEmbed] });
//         }
//       });

//       collector.on("end", (i, event) => {
//         if (event !== "messageDelete") {
//           initialMessage.edit({ components: components(true) }).then((msg) => {
//             setTimeout(async () => {
//               if (msg.deletable) {
//                 await msg.delete().catch(() => { });
//               }
//             }, 10000);
//           });
//         }
//       });
//     } else {
//       const name = args[0];

//       const command = client.text.find((cmd) => cmd.data.name === name);
//       if (!command)
//         return message.reply({ content: "This command does not exist" });

//       const infoembed = new EmbedBuilder().setTitle(`Commands Info`)
//         .setDescription(`
//     Name: ${command.data.name}
//     Description: ${command.data.description}
//     Usage: ${command.data.usage}
//     `);

//       const reply = await message.reply({ embeds: [infoembed] });

//       cache.add({
//         replyMessageID: reply.id,
//         messageID: message.id
//       })
//     }
  },
});
