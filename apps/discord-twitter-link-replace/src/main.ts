import { Client } from "discord.js-selfbot-v13";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  checkUpdate: false,
});

client.on("ready", async () => {
  if (client?.user) console.log(`${client.user.username} is ready!`);
});

client.on("messageCreate", async (message) => {
  if (message.author.id === client.user?.id && !message.system) {
    let updatedContent = message.content;
    updatedContent = updatedContent.replace(
      /https:\/\/twitter\.com/g,
      "https://fxtwitter.com"
    );
    updatedContent = updatedContent.replace(
      /https:\/\/x\.com/g,
      "https://fxtwitter.com"
    );

    if (message.content !== updatedContent) {
      try {
        await message.edit(updatedContent);
      } catch (error) {
        console.error("Failed to edit message:", error);
      }
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN as string);
