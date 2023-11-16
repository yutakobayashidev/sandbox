import dotenv from "dotenv";
import {
  GatewayIntentBits,
  Events,
  Client,
  Partials,
  APIEmbed,
} from "discord.js";
import { fetchTweet } from "../lib/fetchTweet";
import http from "http";

dotenv.config();

http
  .createServer(function (req, res) {
    res.write("OK");
    res.end();
  })
  .listen(8080);

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

export const createEmbeds = async (content: string): Promise<APIEmbed[]> => {
  const TwitterOrXlinks = content.matchAll(
    /https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^/]+\/status\/(?<id>\d+)/g
  );

  const ids = Array.from(TwitterOrXlinks, (match) => match.groups?.id).filter(
    (id) => id !== undefined
  ) as string[];

  if (ids.length === 0) {
    return [];
  }

  const responses = await Promise.all(
    ids.map((id) =>
      fetchTweet(id).catch((error) => {
        console.error("Error fetching tweet:", error);
        return null;
      })
    )
  );

  const embeds = responses.flatMap((response) => {
    if (!response) {
      return [];
    }

    const {
      text,
      user,
      photos,
      video,
      likes,
      in_reply_to_screen_name,
      in_reply_to_url,
      in_reply_to_status_id_str,
    } = response;

    const photoUrls = photos.map((photo) => photo.url);
    if (video) photoUrls.unshift(video.poster);

    const description = in_reply_to_status_id_str
      ? `[Replying to @${in_reply_to_screen_name}](${in_reply_to_url})\n\n${text}`
      : text;

    const embed: APIEmbed = {
      description,
      color: 0x1da1f2,
      image: photoUrls.length > 0 ? { url: photoUrls[0] } : undefined,
      author: {
        name: `${user.name} (@${user.screen_name})`,
        url: `https://twitter.com/${user.screen_name}`,
        icon_url: user.profile_image_url_https,
      },
      footer: {
        icon_url:
          "https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png",
        text: "X",
      },
    };

    if (likes > 0) {
      embed.fields = [
        {
          name: "Likes",
          value: likes.toLocaleString(),
          inline: true,
        },
      ];
    }

    return embed;
  });

  return embeds;
};

client.on(Events.MessageCreate, async (message) => {
  const embeds = await createEmbeds(message.content);
  if (embeds.length > 0) {
    await message.channel.send({ embeds });
  }
});

client.once(Events.ClientReady, () => {
  console.log("Ready!");
  if (client.user) {
    console.log(client.user.tag);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
