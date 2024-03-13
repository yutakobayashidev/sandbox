import OpenAI from "openai";
import { DiscordClient } from "@/clients/discord";

export type InternalContext = {
  openai: OpenAI;
  discord: DiscordClient;
  kv: R2Bucket;
};

export interface HonoConfig {
  Bindings: {
    KOTOBADE_ASOBOU: R2Bucket;
    OPENAI_API_KEY: string;
    DISCORD_TOKEN: string;
    AI_GATEWAY_URL: string;
  };
  Variables: {
    openai: OpenAI;
    discord: DiscordClient;
    internal: InternalContext;
  };
}
