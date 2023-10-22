"use client";

import { useChat } from "ai/react";
import MessageItem from "@/components/message";
import { Message, nanoid } from "ai";
import { useState } from "react";

const initialMessages: Message[] = [
  {
    role: "assistant",
    id: nanoid(),
    content:
      "こんにちは、Function Callingの結果をクライアントに渡しレンダリングするテストです。試しに、東京の天気や国の説明をお願いしてみてください。",
  },
];

export default function Chat() {
  const [key, setAPIkey] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAPIkey(event.target.value);
  };

  const { data, messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialMessages,
      body: { key },
    });

  return (
    <div className="mx-auto py-12 px-3 max-w-4xl">
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
      <input
        type="text"
        value={key}
        onChange={handleChange}
        placeholder="OpenAI API Key"
        className="w-full"
      />
    </div>
  );
}
