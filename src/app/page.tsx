"use client";

import { useState, FormEvent } from "react";
import TextareaAutosize from "react-textarea-autosize";

export default function Home() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error(res.statusText);

      const data = await res.json();
      setSummary(data.summary);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="text"
            className="block text-6xl text-center my-9 font-medium text-gray-700"
          >
            Langchain × Next.js Test
          </label>
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
        <button
          type="submit"
          className="py-2 px-4 rounded-md bg-blue-600 text-white"
          disabled={loading}
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
    </div>
  );
}
