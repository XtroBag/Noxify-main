import {
  ActionRowBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import { SlashCommand } from "../../../Custom/Classes/Bot/Slash.js";
import fs from "fs";
import { Colors } from "../../../Custom/Enums/Colors.js";

export default new SlashCommand({
  data: {
    name: "help",
    description: "show help menu",
  },
  opt: {
    userPerms: ['SendMessages'],
    botPerms: [],
    cooldown: 3,
    ownerOnly: false,
    disabled: false,
  },
  execute: async ({ client, interaction }) => {
    const CommandFolders = fs.readdirSync("./src/Commands/Chat");

    let commandFiles = {};
    CommandFolders.forEach((cmdfldr) => {
      fs.readdir(`./src/Commands/Chat/${cmdfldr}`, (err, data) => {
        commandFiles[cmdfldr] = [];
        data.forEach((specFile) => {
          commandFiles[cmdfldr].push(
            specFile.substring(0, specFile.lastIndexOf(".")) || specFile
          );
        });
      });
    });

    try {
      // The select menu with the choices
      const SelectMenu =
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("help_menu")
            .setPlaceholder("Select a category")
            .addOptions(
              CommandFolders.map((cat) => {
                return {
                  label: `${cat[0].toLocaleUpperCase() + cat.slice(1)}`,
                  value: cat,
                  description: `Click to see the commands of ${cat}`,
                };
              })
            )
        );

      // the first main embed page
      const MainPage = new EmbedBuilder()
        .setTitle("Help Menu")
        .setDescription(
          "Welcome to the help menu of Voxility! In this menu you can find\neverything you need to use."
        )
        .addFields({
          name: `Information:`,
          value:
            "``•`` This will show you all command information.\n``•`` You are able to select a category you want.\n``•`` It will list you all the commands inside a directory",
          inline: true,
        })
        .setColor(Colors.Normal)
        .setTimestamp();

      interaction
        .reply({
          embeds: [MainPage],
          components: [SelectMenu],
          fetchReply: true,
        })
        .then(async (msg) => {
          let filter = (i) => i.user.id === interaction.user.id;
          let collector = await msg.createMessageComponentCollector({
            filter: filter,
          });

          collector.on("collect", async (interaction) => {
            if (interaction.isStringSelectMenu()) {
              if (interaction.customId === "help_menu") {
                console.log;
                await interaction.deferUpdate().catch((e) => {
                  console.log(e);
                });
                let [directory] = interaction.values;

                let aa = new EmbedBuilder()
                  .setColor("#36393F")
                  .setTitle(`All commands of: ${directory}`)
                  .setDescription(
                    `>>> \`\`${
                      commandFiles[directory].join("`` ``") ||
                      "No files in directory"
                    }\`\``
                  );

                msg.edit({ embeds: [aa] });
              }
            }
          });
        });
    } catch (err) {
      console.log(err);
    }
  },
});
