"use client";

import { useChat } from "ai/react";
import MessageItem from "@/components/message";
import type { Message } from "ai";

export const initialMessages: Message[] = [
  {
    role: "assistant",
    id: "0",
    content:
      "こんにちは、Function Callingの結果をクライアントに渡しレンダリングするテストです。試しに、東京の天気や国の説明をお願いしてみてください。",
  },
];

export default function Chat() {
  const { data, messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages,
  });

  return (
    <div className="mx-auto py-12 max-w-4xl">
      {messages.map((m, i) => {
        const correspondingData = data
          ? data.find((d: any) => d.index === i)
          : null;
        return <MessageItem key={i} m={m} data={correspondingData} />;
      })}
      <form onSubmit={handleSubmit}>
        <input
          className="w-full"
          value={input}
          placeholder="プロンプトを入力..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
