"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ChatMessage } from "@/lib/types/chat";
import MobileMenuButton from "@/components/sidebar/mobile-menu-button";
import MessageBubble from "./message-bubble";
import MessageInput from "./message-input";
import TypingIndicator from "./typing-indicator";

interface LocalMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatPanel({
  conversationId,
  title,
  initialMessages,
}: {
  conversationId: string | null;
  title: string;
  initialMessages: ChatMessage[];
}) {
  const [messages, setMessages] = useState<LocalMessage[]>(
    initialMessages.map((m) => ({ id: m.id, role: m.role, content: m.content })),
  );
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(message: string) {
    setError(null);
    const userMsg: LocalMessage = { id: crypto.randomUUID(), role: "user", content: message };
    const assistantId = crypto.randomUUID();
    setMessages((prev) => [...prev, userMsg, { id: assistantId, role: "assistant", content: "" }]);
    setIsStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, message }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`Request failed (${res.status})`);
      }

      const newConversationId = res.headers.get("x-conversation-id");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m,
          ),
        );
      }

      setIsStreaming(false);

      if (newConversationId && newConversationId !== conversationId) {
        router.push(`/chat/${newConversationId}`);
        router.refresh();
      }
    } catch {
      setIsStreaming(false);
      setError("Something went wrong talking to the assistant. Please try again.");
    }
  }

  const lastMessage = messages[messages.length - 1];
  const showTyping = isStreaming && lastMessage?.role === "assistant" && lastMessage.content === "";
  const visibleMessages = showTyping ? messages.slice(0, -1) : messages;

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-3 sm:px-5">
        <MobileMenuButton />
        <h1 className="truncate text-sm font-medium">{title}</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {messages.length === 0 && (
            <p className="mt-10 text-center text-sm text-muted">
              Ask me anything — recipes, hobbies, general questions, and more.
            </p>
          )}
          {visibleMessages.map((m) => (
            <MessageBubble key={m.id} role={m.role} content={m.content} />
          ))}
          {showTyping && <TypingIndicator />}
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t border-border px-4 py-3 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <MessageInput onSend={handleSend} disabled={isStreaming} />
        </div>
      </div>
    </div>
  );
}
