"use client";

import { useState, FormEvent } from "react";
import TextareaAutosize from "react-textarea-autosize";

export default function Home() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [api, setApiKey] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous error

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, api }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || res.statusText);

      setSummary(data.summary);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = () => !text || !api || loading;

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="block text-6xl text-center my-9 font-medium text-gray-700">
            LangChain × Next.js Test
          </div>
          <TextareaAutosize
            id="text"
            minRows={5}
            placeholder="Enter text to summarize..."
            className="w-full block resize-none rounded-md border-2 border-gray-100 bg-gray-50 px-4 py-2"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>
        <div>
          <label
            htmlFor="apiKey"
            className="block mb-3 text-lg font-medium text-gray-700"
          >
            OpenAI API Key
          </label>
          <input
            id="apiKey"
            value={api}
            className="w-full block resize-none rounded-md border-2 border-gray-100 bg-gray-50 px-4 py-2"
            onChange={(e) => setApiKey(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className={`py-2 px-4 rounded-md text-white ${
            isButtonDisabled()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={isButtonDisabled()}
        >
          {loading ? "Loading..." : "Summarize"}
        </button>
      </form>
      {summary && (
        <div className="mt-4 p-2 border border-gray-200 rounded-md">
          <h2 className="text-lg font-semibold text-gray-700">Summary</h2>
          <p className="mt-2 text-gray-700">{summary}</p>
        </div>
      )}
      {error && (
        <div className="mt-4 p-2 border border-red-500 bg-red-100 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
