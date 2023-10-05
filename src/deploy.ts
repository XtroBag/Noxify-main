import { REST, Routes } from 'discord.js';
import { SlashCommand } from './types/classes/slash.js';
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ContextMenu } from './types/classes/context.js';

const dynamicImport = (path: string) => import(pathToFileURL(path).toString()).then((module) => module?.default);

const uploading = [];

const commandFolderPath = fileURLToPath(new URL('../src/commands/slash', import.meta.url));
const commandFolders = fs.readdirSync(commandFolderPath);

for (const category of commandFolders) {
	const commandPath = path.join(commandFolderPath, category)
	const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));
	for (const fileName of commandFiles) {
		const filePath = path.join(commandPath, fileName);
		const command = await dynamicImport(filePath) as SlashCommand;
		
		uploading.push(command.data);
	}
}


const contextMenuFolderPath = fileURLToPath(new URL('../src/commands/context', import.meta.url));
const contextMenuFolder = fs.readdirSync(contextMenuFolderPath);
   
for (const file of contextMenuFolder) {
	const filePath = path.join(contextMenuFolderPath, file)

	const menu = await dynamicImport(filePath) as ContextMenu;

	uploading.push(menu.data)

}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
	try {
		console.log(`Started refreshing ${uploading.length} application (/) commands.`);

		let data: string | any[];

		if (process.env.GUILD_ID) {
			data = await rest.put(
				Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
				{ body: uploading },
			) as SlashCommand['data'][];
		} else {
			data = await rest.put(
				Routes.applicationCommands(process.env.CLIENT_ID),
				{ body: uploading },
			) as SlashCommand['data'][];
		}

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();
