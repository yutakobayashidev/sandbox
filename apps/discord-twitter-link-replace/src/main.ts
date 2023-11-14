import { Client } from "discord.js-selfbot-v13";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  // See other options here
  // https://discordjs-self-v13.netlify.app/#/docs/docs/main/typedef/ClientOptions
  // All partials are loaded automatically
});

client.on("ready", async () => {
  if (client?.user) console.log(`${client.user.username} is ready!`);
});

client.login(process.env.DISCORD_BOT_TOKEN as string);
