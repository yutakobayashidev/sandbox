//必要なパッケージをインポートする
import {
  GatewayIntentBits,
  Events,
  Client,
  Collection,
  Partials,
  Message,
} from "discord.js";
import dotenv from "dotenv";
import path from "path";
import { readdirSync } from "fs";

//.envファイルを読み込む
dotenv.config();

declare module "discord.js" {
  export interface Client {
    commands: Collection<any, any>;
  }
}

//Botで使うGetwayIntents、partials
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel],
});

const basePath = process.cwd();

client.commands = new Collection();
const foldersPath = path.join(basePath, "commands");
const commandFolders = readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);

  const commandFiles = readdirSync(commandsPath).filter((file) =>
    file.endsWith(".ts")
  );
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const { command } = await import(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(` ${interaction.commandName} というコマンドは存在しません。`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "コマンドを実行中にエラーが発生しました。",
      ephemeral: true,
    });
  }
});

//Botがきちんと起動したか確認
client.once(Events.ClientReady, () => {
  console.log("Ready!");
  if (client.user) {
    console.log(client.user.tag);
  }
});

//!timeと入力すると現在時刻を返信するように
client.on("messageCreate", async (message: Message) => {
  if (message.author.bot) return;
  if (message.content === "!time") {
    const date1 = new Date();
    message.channel.send(date1.toLocaleString());
  }
});

//ボット作成時のトークンでDiscordと接続
client.login(process.env.DISCORD_BOT_TOKEN);
