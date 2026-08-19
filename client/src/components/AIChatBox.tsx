import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, CornerDownLeft, Loader2, Sparkles, User } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Streamdown } from "streamdown";

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AIChatBoxProps = {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  height?: string;
  emptyStateMessage?: string;
  suggestedPrompts?: string[];
  className?: string;
};

export function AIChatBox({
  messages,
  onSendMessage,
  isLoading = false,
  placeholder = "Type a message...",
  height = "500px",
  emptyStateMessage = "How can I help you today?",
  suggestedPrompts = [],
  className = "",
}: AIChatBoxProps) {
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const displayMessages = messages.filter((m) => m.role !== "system");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSendMessage(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className={`flex flex-col border rounded-lg overflow-hidden bg-card text-card-foreground shadow-sm ${className}`}
      style={{ height }}
    >
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {displayMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-8">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <Bot className="h-8 w-8" />
            </div>
            <p className="text-muted-foreground text-sm font-medium">
              {emptyStateMessage}
            </p>
            {suggestedPrompts.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center max-w-md mt-4">
                {suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onSendMessage(prompt)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border border-border bg-muted/50 hover:bg-muted text-foreground transition-colors"
                  >
                    <Sparkles className="h-3 w-3 text-primary" />
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          displayMessages.map((message, index) => {
            const isUser = message.role === "user";
            return (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  isUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border ${
                    isUser
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div
                  className={`rounded-lg px-4 py-2.5 max-w-[80%] text-sm ${
                    isUser
                      ? "bg-primary text-primary-foreground font-normal"
                      : "bg-muted text-foreground border border-border/50"
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                      <Streamdown>{message.content}</Streamdown>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted text-muted-foreground border-border">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-3 border border-border/50">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts if conversation active */}
      {displayMessages.length > 0 && suggestedPrompts.length > 0 && (
        <div className="px-4 py-2 border-t bg-muted/20 flex gap-2 overflow-x-auto">
          {suggestedPrompts.slice(0, 3).map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSendMessage(prompt)}
              className="inline-flex shrink-0 items-center gap-1 px-2.5 py-1 text-xs rounded-md border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <Sparkles className="h-2.5 w-2.5 text-primary" />
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 p-3 border-t bg-background"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1"
        />
        <Button
          type="submit"
          size="sm"
          disabled={!input.trim() || isLoading}
          className="shrink-0 gap-1.5"
        >
          <span>Send</span>
          <CornerDownLeft className="h-3.5 w-3.5" />
        </Button>
      </form>
    </div>
  );
}
