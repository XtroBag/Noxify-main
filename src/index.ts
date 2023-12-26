import { Noxify } from "./Custom/Classes/Bot/Client.js";

const client = new Noxify();

process.on("unhandledRejection", (reason) => {
  console.log(reason);
});

process.on("uncaughtException", (err) => {
  console.log(err);
});

client.start();
