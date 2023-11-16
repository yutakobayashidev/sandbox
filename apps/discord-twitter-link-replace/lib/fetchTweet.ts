import { normalizeText } from "./normalizeText";
import type { Media, Photo, TweetData, User, Video } from "../types";

interface TweetDataSubset {
  text: string;
  user: User;
  photos: Photo[];
  video: Video | undefined;
  media: Media[] | undefined;
  likes: number;
  in_reply_to_screen_name?: string;
  in_reply_to_url?: string;
  in_reply_to_status_id_str?: string;
}

// Originally authored by LFades for react-tweet
// Source: https://github.com/vercel/react-tweet/blob/69d454b6c240664778a26a134e39d06cf4685761/packages/react-tweet/src/api/get-tweet.ts#L27
function getToken(id: string) {
  return ((Number(id) / 1e15) * Math.PI)
    .toString(6 ** 2)
    .replace(/(0+|\.)/g, "");
}

const getInReplyToUrl = (tweet: TweetData) =>
  `https://twitter.com/${tweet.in_reply_to_screen_name}/status/${tweet.in_reply_to_status_id_str}`;

export async function fetchTweet(id: string): Promise<TweetDataSubset> {
  const baseUrl = "https://cdn.syndication.twimg.com/tweet-result";
  const token = getToken(id);

  const res = await fetch(`${baseUrl}?id=${id}&token=${token}`);
  const data: TweetData = await res.json();

  const {
    user,
    photos,
    video,
    entities,
    favorite_count,
    in_reply_to_screen_name,
    in_reply_to_status_id_str,
  } = data;

  const text = normalizeText(data);

  return {
    text,
    likes: favorite_count,
    user,
    photos: photos ? photos : [],
    video,
    media: entities.media,
    in_reply_to_screen_name,
    in_reply_to_status_id_str,
    in_reply_to_url: data.in_reply_to_screen_name
      ? getInReplyToUrl(data)
      : undefined,
  };
}
