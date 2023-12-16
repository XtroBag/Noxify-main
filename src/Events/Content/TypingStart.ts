import { Event } from "../../Custom/Classes/Bot/Event.js";

export default new Event({
  name: "typingStart",
  once: false,
  async execute(client, typing) {
   console.log(typing)
  },
});
