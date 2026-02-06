"use client";

import { cn } from "@/lib/utils";
import { Bot, User, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "group flex gap-4 rounded-xl p-4 transition-all duration-200",
        isAssistant
          ? "border border-white/10 bg-white/5 shadow-sm"
          : "bg-transparent hover:bg-white/5",
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg transition-transform group-hover:scale-105",
          isAssistant
            ? "bg-gradient-to-br from-[#47C2EB] to-[#3BA8D1] text-white shadow-[#47C2EB]/20 shadow-md"
            : "bg-white/10 text-gray-300",
        )}
      >
        {isAssistant ? (
          <Bot className="h-4 w-4" />
        ) : (
          <User className="h-4 w-4" />
        )}
      </div>
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-sm text-white">
            {isAssistant ? "Retarget IQ Assistant" : "You"}
          </span>
          {isAssistant && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className={cn(
                "h-7 rounded-lg px-2.5 opacity-0 transition-all duration-200 group-hover:opacity-100",
                copied
                  ? "bg-emerald-500/10 text-emerald-500 opacity-100"
                  : "text-gray-400 hover:bg-white/10 hover:text-white",
              )}
            >
              {copied ? (
                <>
                  <Check className="mr-1.5 h-3.5 w-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-1.5 h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </Button>
          )}
        </div>
        <div className="whitespace-pre-wrap text-gray-200 leading-relaxed">
          {message.content}
        </div>
      </div>
    </div>
  );
}
