import { NoxifyClient } from "./types/classes/client.js";
import 'dotenv/config'

export const client = new NoxifyClient();
client.start();
