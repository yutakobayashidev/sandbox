import {
  APIInteractionResponseChannelMessageWithSource,
  InteractionResponseType,
} from "discord-api-types/v10";
import { ApplicationCommandObj } from "@/interactions/handleApplicationCommands";
import { InternalContext } from "@/config";
import { SYOGAKUSE_SYSTEM_PROMPT } from "kotobade-asobou";

const handler = async ({
  intentObj,
  ctx,
}: {
  intentObj: ApplicationCommandObj;
  ctx: InternalContext;
}): Promise<APIInteractionResponseChannelMessageWithSource> => {
  const chatCompletion = await ctx.openai.chat.completions.create({
    messages: [
      { role: "system", content: SYOGAKUSE_SYSTEM_PROMPT },
      {
        role: "user",
        content: `簡単な言葉に変換するテキスト： ${
          (intentObj.data as any)?.options[0].value
        }`,
      },
    ],
    model: "gpt-4-turbo-preview",
  });

  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `元の文字列: ${
        (intentObj.data as any).options[0].value
      }\n\n新しい文字列: ${
        chatCompletion.choices[0].message.content ??
        "あらら。問題が発生したため、生成できませんでした"
      }`,
    },
  };
};

export default {
  commandName: "syogakuse",
  handler,
};
