import { Client } from "hypixel-api-reborn";
import { MinecraftUser } from "../custom/interfaces/minecraft.js";
import axios from "axios";

export const hypixel = new Client(process.env.HYPIXEL_KEY, { cache: true });

export async function minecraftUser(name: string): Promise<MinecraftUser> {
  const { data } = await axios.get(
    `https://api.mojang.com/users/profiles/minecraft/${name}`
  );

  if (!data) return;

  return data;
}
