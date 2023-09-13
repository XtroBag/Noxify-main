import { EmbedBuilder, resolveColor } from "discord.js";
import { Colors, Emojis } from "../../../config/config.js";
import { CustomEmbedOptions } from "../typings.js";

export class EmbedCreator {
  /**
   * This is used for a slash command response when something worked as a embed
   * you can also provide a custom description and fields if wanted.
   */
  public generalResponse(obj: CustomEmbedOptions, interaction: any) {
    return new EmbedBuilder({
      title: obj.title,
      description: obj.description,
      color: resolveColor(Colors.Normal),
      fields: obj.fields,
    });
  }

  public errorResponse(obj: CustomEmbedOptions, interaction: any) {
    return new EmbedBuilder({
      title: obj.title,
      description: `${Emojis.Wrong} ${obj.description}`,
      color: resolveColor(Colors.Normal),
      fields: obj.fields,
    });
  }

  public warningResponse(obj: CustomEmbedOptions, interaction: any) {}
}
