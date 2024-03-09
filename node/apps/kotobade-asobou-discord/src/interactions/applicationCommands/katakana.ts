import { APIInteractionResponseChannelMessageWithSource } from "discord-api-types/v10";
import { ApplicationCommandObj } from "@/interactions/handleApplicationCommands";
import { InternalContext } from "@/config";
import { KATAKANA_SYSTEM_PROMPT } from "kotobade-asobou";
import { KATAKANA_COMMAND_NAME } from "@/constants";
import { getContentCache, putContentCache } from "@/kv";
import { buildAIResponse } from "@/responses/AIResponse";

const handler = async ({
  intentObj,
  ctx,
}: {
  intentObj: ApplicationCommandObj;
  ctx: InternalContext;
}): Promise<APIInteractionResponseChannelMessageWithSource> => {
  const cachedText = await getContentCache({
    command: KATAKANA_COMMAND_NAME,
    text: (intentObj.data as any).options[0].value,
    ctx,
  });

  if (cachedText) {
    return buildAIResponse({
      original: (intentObj.data as any).options[0].value,
      response: String(cachedText),
    });
  }

  const chatCompletion = await ctx.openai.chat.completions.create({
    messages: [
      { role: "system", content: KATAKANA_SYSTEM_PROMPT },
      {
        role: "user",
        content: `カタカナに変換するテキスト： ${
          (intentObj.data as any)?.options[0].value
        }`,
      },
    ],
    model: "gpt-4-turbo-preview",
  });

  if (chatCompletion.choices[0].message.content) {
    await putContentCache({
      command: KATAKANA_COMMAND_NAME,
      text: chatCompletion.choices[0].message.content,
      ctx,
    });
  }

  return buildAIResponse({
    original: (intentObj.data as any).options[0].value,
    response: chatCompletion.choices[0].message.content,
  });
};

export default {
  commandName: KATAKANA_COMMAND_NAME,
  handler,
};
