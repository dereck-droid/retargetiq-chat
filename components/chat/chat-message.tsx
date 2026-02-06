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
        "flex gap-4 p-4 rounded-xl group transition-all duration-200",
        isAssistant
          ? "bg-white/5 border border-white/10 shadow-sm"
          : "bg-transparent hover:bg-white/5"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg transition-transform group-hover:scale-105",
          isAssistant
            ? "bg-gradient-to-br from-[#47C2EB] to-[#3BA8D1] text-white shadow-md shadow-[#47C2EB]/20"
            : "bg-white/10 text-gray-300"
        )}
      >
        {isAssistant ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-white">
            {isAssistant ? "Retarget IQ Assistant" : "You"}
          </span>
          {isAssistant && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className={cn(
                "opacity-0 group-hover:opacity-100 transition-all duration-200 h-7 px-2.5 rounded-lg",
                copied
                  ? "bg-emerald-500/10 text-emerald-500 opacity-100"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              )}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 mr-1.5" />
                  Copy
                </>
              )}
            </Button>
          )}
        </div>
        <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">
          {message.content}
        </div>
      </div>
    </div>
  );
}
