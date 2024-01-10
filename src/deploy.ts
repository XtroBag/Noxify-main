import { REST, Routes } from 'discord.js';
import { SlashCommand } from './Custom/Classes/Bot/Slash.js';
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { UserContextMenu } from './Custom/Classes/Bot/UserContextMenu.js';

const dynamicImport = (path: string) => import(pathToFileURL(path).toString()).then((module) => module?.default)

const uploading: any[] = [];

const commandFolderPath = fileURLToPath(new URL('../dist/Commands/Chat', import.meta.url));
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


const userContextMenuFolderPath = fileURLToPath(new URL('../dist/Commands/User', import.meta.url));
const userContextMenuFolder = fs.readdirSync(userContextMenuFolderPath) //.filter(file => file.endsWith('.js'))

   
for (const file of userContextMenuFolder) {
	const filePath = path.join(userContextMenuFolderPath, file)

	const userMenu = await dynamicImport(filePath) as UserContextMenu;

	uploading.push(userMenu.data)

}

const messageContextMenuFolderPath = fileURLToPath(new URL('../dist/Commands/Message', import.meta.url));
const messageContextMenuFolder = fs.readdirSync(messageContextMenuFolderPath) //.filter(file => file.endsWith('.js'))
   
for (const file of messageContextMenuFolder) {
	const filePath = path.join(messageContextMenuFolderPath, file)

	const messageMenu = await dynamicImport(filePath) as UserContextMenu;

	uploading.push(messageMenu.data)

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
