import { User } from "../custom/interfaces/minecraft.js";
import axios from "axios";

export async function minecraftUser(name: string): Promise<User> {
  const { data } = await axios.get(
    `https://api.mojang.com/users/profiles/minecraft/${name}`
  );

  return data;
}

export function getHead(name: string) {
  return `https://mc-heads.net/avatar/${name}`;
}
