import { Event } from "../../types/classes/event.js";

export default new Event({
  name: "guildMemberAdd",
  once: false,
  async execute(client, member) {},
});
