import OpenAI from "openai";
import {
  OpenAIStream,
  StreamingTextResponse,
  experimental_StreamData,
} from "ai";
import { functions, runFunction } from "./functions";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const lastIndex = messages.length - 1;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages,
    functions,
  });

  const data = new experimental_StreamData();

  const stream = OpenAIStream(response, {
    experimental_onFunctionCall: async (
      { name, arguments: args },
      createFunctionCallMessages
    ) => {
      const result = await runFunction(name, args);
      const newMessages = createFunctionCallMessages(result);

      data.append({
        type: name,
        sources: result,
        index: lastIndex + 1,
      });
      return openai.chat.completions.create({
        messages: [...messages, ...newMessages],
        stream: true,
        model: "gpt-3.5-turbo-0613",
        functions,
      });
    },
    onFinal(completion) {
      data.close();
    },
    experimental_streamData: true,
  });

  return new StreamingTextResponse(stream, {}, data);
}
