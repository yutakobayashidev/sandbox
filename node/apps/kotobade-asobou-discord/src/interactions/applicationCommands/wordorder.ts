import {
  APIInteractionResponseChannelMessageWithSource,
  InteractionResponseType,
} from "discord-api-types/v10";
import { ApplicationCommandObj } from "@/interactions/handleApplicationCommands";
import { InternalContext } from "@/config";
import { GOJYUN_SYSTEM_PROMPT } from "kotobade-asobou";

const handler = async ({
  intentObj,
  clients,
}: {
  intentObj: ApplicationCommandObj;
  clients: InternalContext;
}): Promise<APIInteractionResponseChannelMessageWithSource> => {
  const chatCompletion = await clients.openai.chat.completions.create({
    messages: [
      { role: "system", content: GOJYUN_SYSTEM_PROMPT },
      {
        role: "user",
        content: `英語の語順に変換するテキスト： ${
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
  commandName: "wordorder",
  handler,
};
