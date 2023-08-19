import { EmbedBuilder, resolveColor } from "discord.js";
import { Colors, Emojis } from "../../../config/config.js";
import { CustomEmbedOptions } from "../typings.js";

export class EmbedCreator {
  /**
   * This is used for a slash command response when something worked as a embed
   * you can also provide a custom description and fields if wanted.
   */
  public slashResponse(obj: CustomEmbedOptions, interaction: any) {
    return new EmbedBuilder({
      description: `${Emojis.SlashCommand} › </${interaction.commandName}:${interaction.commandId}>\n\n${obj.description}`,
      color: resolveColor(Colors.Normal),
      footer: {
        text: `Noxify • ${interaction.user.globalName}`,
        iconURL: interaction.client.user.displayAvatarURL({ extension: "png" }),
      },
      fields: obj.fields,
    });
  }

  public errorResponse(obj: CustomEmbedOptions, interaction: any) {
    return new EmbedBuilder({
      description: `${Emojis.Failed} ${obj.description}`,
      color: resolveColor(Colors.Normal),
      footer: {
        text: `Noxify • ${interaction.user.globalName}`,
        iconURL: interaction.client.user.displayAvatarURL({ extension: "png" }),
      },
      fields: obj.fields,
    });
  }

  public warningResponse(obj: CustomEmbedOptions, interaction: any) {}
}
