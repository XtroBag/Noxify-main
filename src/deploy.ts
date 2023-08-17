import { REST, Routes } from 'discord.js';
import { SlashCommand } from './types/classes/slash.js';
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const commands = []

const commandFolderPath = fileURLToPath(new URL('../src/commands/slash', import.meta.url));
const commandFolders = fs.readdirSync(commandFolderPath);

const dynamicImport = (path: string) => import(pathToFileURL(path).toString()).then((module) => module?.default);

for (const category of commandFolders) {
	const commandPath = path.join(commandFolderPath, category)
	const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));
	for (const fileName of commandFiles) {
		const filePath = path.join(commandPath, fileName);
		const command = await dynamicImport(filePath) as SlashCommand;
		
		commands.push(command.data);
	};
}; 

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		let data: string | any[];

		if (process.env.GUILD_ID) {
			data = await rest.put(
				Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
				{ body: commands },
			) as SlashCommand['data'][];
		} else {
			data = await rest.put(
				Routes.applicationCommands(process.env.CLIENT_ID),
				{ body: commands },
			) as SlashCommand['data'][];
		};

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	};
})();
