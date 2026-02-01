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
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && value.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <div className="relative flex items-end gap-3 p-3 bg-white rounded-2xl border border-gray-200 shadow-lg shadow-black/5 transition-all duration-200 focus-within:border-[#47C2EB]/50 focus-within:shadow-[#47C2EB]/5">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Paste customer email or support request here..."
        className="min-h-[44px] max-h-[200px] flex-1 resize-none border-none bg-transparent p-2 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 placeholder:text-gray-500 text-[15px] leading-relaxed"
        disabled={isLoading}
        rows={1}
      />
      <Button
        onClick={onSubmit}
        disabled={isLoading || !value.trim()}
        size="icon"
        className="shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br from-[#47C2EB] to-[#3BA8D1] hover:from-[#3BA8D1] hover:to-[#2E96BD] text-white shadow-md shadow-[#47C2EB]/25 transition-all duration-200 hover:shadow-lg hover:shadow-[#47C2EB]/30 disabled:opacity-50 disabled:shadow-none"
      >
        <ArrowUp className="h-5 w-5" />
        <span className="sr-only">Send message</span>
      </Button>
    </div>
  );
}
