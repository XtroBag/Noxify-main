import { Client } from "hypixel-api-reborn";
import chalk from 'chalk';

export const hypixel = new Client(process.env.HYPIXEL_KEY, { cache: true });

export interface User {
  name: string;
  id: string;
}

export async function MCUser(name: string): Promise<User> {
  try {
    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${name}`, {
      method: 'GET',
    })
    return await response.json()

  } catch (error) {
    console.log(chalk.red(`Error: ${error}`))
  }
}