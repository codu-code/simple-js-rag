"use client";

import { useState } from "react";
import { Toaster, toast } from "sonner";

export default function Home() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputText) {
      toast.error("Please provide a question");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/rag", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ query: inputText }),
      });

      const data = await res.json();

      setInputText("");
      setResponse(data.response);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-gray-900 to-gray-800">
      <Toaster />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col pt-20 items-center"
      >
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          type="text"
          name="question"
          placeholder="Ask me something..."
          className="p-4 border border-gray-300 rounded-lg max-w-96 w-full text-gray-900 placeholder:text-gray-500"
        />

        <button
          disabled={loading}
          type="submit"
          className="p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg max-w-96 w-full mt-4"
        >
          {loading ? (
            <span className="animate-pulse">Aligning satellites 📡</span>
          ) : (
            "Submit"
          )}
        </button>
      </form>
      {response && (
        <div className="flex justify-center">
          <div className="max-w-[720px] text-gray-50 p-6 border border-gray-500 bg-gray-700 rounded m-8">
            {response}
          </div>
        </div>
      )}
    </main>
  );
}
