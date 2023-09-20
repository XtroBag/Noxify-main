import { EmbedBuilder, resolveColor } from "discord.js";
import { Colors, Emojis } from "../../../config/config.js";
import { CustomEmbedOptions } from "../typings.js";

export class EmbedCreator {
  /**
   * This is used for a slash command response when something worked as a embed
   * you can also provide a custom description and fields if wanted.
   */
  public general(obj: CustomEmbedOptions) {
    return new EmbedBuilder({
      title: obj.title,
      description: obj.description,
      color: resolveColor(Colors.Normal),
      fields: obj.fields,
    });
  }

  public error(obj: CustomEmbedOptions) {
    return new EmbedBuilder({
      title: obj.title,
      description: `${Emojis.Wrong} ${obj.description}`,
      color: resolveColor(Colors.Normal),
      fields: obj.fields,
    });
  }

  public warning(obj: CustomEmbedOptions) {}
}
