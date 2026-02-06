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
          ? "border border-border/50 bg-card shadow-sm"
          : "bg-transparent hover:bg-secondary/30",
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg transition-transform group-hover:scale-105",
          isAssistant
            ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/20"
            : "bg-secondary text-secondary-foreground",
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
          <span className="font-medium text-foreground text-sm">
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
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
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
        <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
          {message.content}
        </div>
      </div>
    </div>
  );
}
