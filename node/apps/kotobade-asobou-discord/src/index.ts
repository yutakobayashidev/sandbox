import { Hono } from "hono";
import { HonoConfig } from "@/config";
import { verifyDiscordInteraction } from "@/middleware/verifyDiscordInteraction";
import { errorResponse } from "@/responses/errorResponse";
import {
  APIInteraction,
  InteractionType,
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord-api-types/v10";
import { handleApplicationCommands } from "./interactions/handleApplicationCommands";
import keigoCommand from "@/interactions/applicationCommands/keigo";
import ayasiiCommand from "@/interactions/applicationCommands/ayasii_jp";
import engurishuCommand from "@/interactions/applicationCommands/engurishu";
import chineseCommand from "@/interactions/applicationCommands/chinese";
import heianCommand from "@/interactions/applicationCommands/heian";
import katakanaCommand from "@/interactions/applicationCommands/katakana";
import syogakuseiCommand from "@/interactions/applicationCommands/syogakusei";
import wordorderCommand from "@/interactions/applicationCommands/wordorder";
import { inject } from "@/middleware/inject";

const app = new Hono<HonoConfig>();

app.use("*", inject);

app.post("/interaction", verifyDiscordInteraction, async (c) => {
  const body: APIInteraction = await c.req.json();

  try {
    switch (body.type) {
      case InteractionType.ApplicationCommand:
        switch (body.data.type) {
          case ApplicationCommandType.ChatInput: {
            switch (body.data.options?.[0]?.type) {
              case ApplicationCommandOptionType.String: {
                body;
                return c.json(
                  await handleApplicationCommands({
                    intentObj: body,
                    ctx: c.get("internal"),
                    commands: [
                      ayasiiCommand,
                      chineseCommand,
                      engurishuCommand,
                      heianCommand,
                      katakanaCommand,
                      keigoCommand,
                      syogakuseiCommand,
                      wordorderCommand,
                    ],
                  })
                );
              }
            }
          }
        }
    }
  } catch (e) {
    console.error(e);
    return c.json(
      errorResponse(
        e instanceof Error
          ? e.message
          : "なにか問題が起こったみたいだ！[GitHub](https://github.com/yutakobayashidev/sandbox/tree/main/node/apps/kotobade-asobou-discord)で貢献しよう！"
      )
    );
  }
});

export default app;
