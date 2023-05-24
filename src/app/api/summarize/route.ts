import { ChatOpenAI } from "langchain/chat_models/openai";
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PromptTemplate } from "langchain/prompts";

export const dynamic = "force-dynamic";
export const revalidate = true;
export const runtime = "edge";

async function runLLMChain(text: string, api: string) {
  const encoder = new TextEncoder();

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const chatStreaming = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    streaming: true,
    temperature: 0,
    openAIApiKey: api,
    callbacks: [
      {
        async handleLLMNewToken(token) {
          await writer.ready;
          await writer.write(encoder.encode(`${token}`));
        },
        async handleLLMEnd() {
          await writer.ready;
          await writer.close();
        },
        handleLLMError: async (e) => {
          await writer.ready;
          console.log("handleLLMError Error: ", e);
          await writer.abort(e);
        },
      },
    ],
  });

  const prompt = new PromptTemplate({
    template: `Summarize this in Japanese (日本語) language:
  "{text}"
  Concise summaries with bullet points:`,
    inputVariables: ["text"],
  });

  const chain = loadSummarizationChain(chatStreaming, {
    type: "map_reduce",
    combineMapPrompt: prompt,
    combinePrompt: prompt,
  });

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 100,
  });

  const docs = await textSplitter.createDocuments([text]);

  chain.call({
    input_documents: docs,
  });
  return stream.readable;
}

export async function POST(request: Request) {
  const body = await request.json();

  const stream = runLLMChain(body.text, body.api);
  return new Response(await stream);
}
