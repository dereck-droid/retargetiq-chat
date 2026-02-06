"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { Bot } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function SupportChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I couldn't connect to the server. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-white/10 border-b bg-black/40 px-6 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#47C2EB] to-[#3BA8D1] shadow-[#47C2EB]/20 shadow-lg">
              <span className="font-bold text-lg text-white">R</span>
            </div>
            <div>
              <h1 className="font-semibold text-white tracking-tight">
                Retarget IQ Support
              </h1>
              <p className="text-gray-400 text-xs">AI-powered assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-gray-400 text-xs">Online</span>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-4">
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-3xl bg-[#47C2EB]/20 blur-xl" />
                <div className="relative inline-flex h-20 w-20 items-center justify-center rounded-2xl border border-[#47C2EB]/20 bg-gradient-to-br from-[#47C2EB]/20 to-[#47C2EB]/5">
                  <Bot className="h-10 w-10 text-[#47C2EB]" />
                </div>
              </div>
              <h2 className="mb-3 text-balance font-semibold text-2xl text-white tracking-tight">
                Paste your support request
              </h2>
              <p className="max-w-sm text-balance text-center text-gray-400 leading-relaxed">
                Copy a customer email and paste it below to get a suggested
                response.
              </p>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-2 px-4 py-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#47C2EB] to-[#3BA8D1] text-white shadow-[#47C2EB]/20 shadow-md">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#47C2EB]/60 [animation-delay:-0.3s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#47C2EB]/60 [animation-delay:-0.15s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#47C2EB]/60" />
                    </div>
                    <span className="text-sm">Generating response...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-white/10 border-t bg-black/20 p-4 backdrop-blur-sm">
          <div className="mx-auto max-w-3xl">
            <ChatInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
