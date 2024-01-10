import {
  ApplicationCommandOptionType,
  AttachmentBuilder,
  EmbedBuilder,
} from "discord.js";
import { SlashCommand } from "../../../Custom/Classes/Bot/Slash.js";
import { WeatherForcastData } from "../../../Custom/Interfaces/Weather.js";
import { Colors } from "../../../Custom/Enums/Colors.js";

export default new SlashCommand({
  data: {
    name: "weather",
    description: "check the weather",
    options: [
      {
        name: "location",
        description: "get information about your location",
        type: ApplicationCommandOptionType.String,
        required: true
      },
    ],
  },
  opt: {
    userPerms: [],
    botPerms: [],
    cooldown: 3,
    ownerOnly: false,
    disabled: false,
  },
  execute: async ({ client, interaction }) => {
    const location = interaction.options.getString("location");

    const options = { method: "GET", headers: { accept: "application/json" } };
    const url = `https://api.weatherapi.com/v1/current.json?q=${location}&key=${process.env.WEATHER_API}`

    try {

    const data = await fetch(url, options);
    const response = await data.json() as WeatherForcastData;

    const number: string = response.current.condition.icon.match(/(\d+)\.png$/)?.[1] || "";

    const attachment = new AttachmentBuilder(`./src/Config/Photos/Weather/${response.current.is_day ? "Day" : "Night"}/${number}.png`,
      { name: "weather.png" }
    );

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setThumbnail(`attachment://${attachment.name}`)
          .setColor(Colors.Normal).setDescription(`
          Location: ${response.location.name}
          Country: ${response.location.country}
          Wind: ${response.current.wind_mph} mph
          Humidity: ${response.current.humidity}%
          Condition: ${response.current.condition.text}
          Temperature: ${response.current.temp_f}℉
        `),
      ],
      files: [attachment],
    });

  } catch (err) {
    return interaction.reply({ embeds: [new EmbedBuilder().setColor(Colors.Normal).setDescription('Not a valid location or failed to search data')]})
  }
  
  },
});
