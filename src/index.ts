import { Noxify } from "./types/classes/client.js";
import 'dotenv/config'

export const client = new Noxify();
client.start();
