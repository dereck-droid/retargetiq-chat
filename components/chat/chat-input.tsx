"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp } from "lucide-react";
import { useRef, useEffect } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && value.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <div className="relative flex items-end gap-3 rounded-2xl border border-border/50 bg-card p-3 shadow-black/5 shadow-lg transition-all duration-200 focus-within:border-primary/50 focus-within:shadow-primary/5">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Paste customer email or support request here..."
        className="max-h-[200px] min-h-[44px] flex-1 resize-none border-none bg-transparent p-2 text-[15px] text-foreground leading-relaxed shadow-none placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
        disabled={isLoading}
        rows={1}
      />
      <Button
        onClick={onSubmit}
        disabled={isLoading || !value.trim()}
        size="icon"
        className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/25 transition-all duration-200 hover:from-primary/90 hover:to-primary/70 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:shadow-none"
      >
        <ArrowUp className="h-5 w-5" />
        <span className="sr-only">Send message</span>
      </Button>
    </div>
  );
}
