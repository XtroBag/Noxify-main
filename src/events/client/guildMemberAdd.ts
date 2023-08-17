import { Event } from "../../types/classes/event.js";
import "dotenv/config";

export default new Event({
  name: "guildMemberAdd",
  once: false,
  async execute(_client, member) {
    
    }
  });
