import { APIInteractionResponseChannelMessageWithSource } from "discord-api-types/v10";
import { ApplicationCommandObj } from "@/interactions/handleApplicationCommands";
import { InternalContext } from "@/config";
import { WIRED_JAPANESE_SYSTEM_PROMPT } from "kotobade-asobou";
import { getContentCache, putContentCache } from "@/kv";
import { buildAIResponse } from "@/responses/AIResponse";
import { AYASII_COMMAND_NAME } from "@/constants";

const handler = async ({
  intentObj,
  ctx,
}: {
  intentObj: ApplicationCommandObj;
  ctx: InternalContext;
}): Promise<APIInteractionResponseChannelMessageWithSource> => {
  const cachedText = await getContentCache({
    command: AYASII_COMMAND_NAME,
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
      { role: "system", content: WIRED_JAPANESE_SYSTEM_PROMPT },
      {
        role: "user",
        content: `あやしい中国語に変換されたテキスト： ${
          (intentObj.data as any)?.options[0].value
        }`,
      },
    ],
    model: "gpt-4-turbo-preview",
  });

  if (chatCompletion.choices[0].message.content) {
    await putContentCache({
      command: AYASII_COMMAND_NAME,
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
  commandName: AYASII_COMMAND_NAME,
  handler,
};
