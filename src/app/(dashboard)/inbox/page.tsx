"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Icon } from "@/components/ui";
import { useAuthStore } from "@/stores";
import { formatRelativeTime } from "@/lib";
import type { Message, Job } from "@/types";

export default function InboxPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-96 bg-surface-container-high rounded-lg" />}>
      <InboxContent />
    </Suspense>
  );
}

function InboxContent() {
  const params = useSearchParams();
  const jobId = params.get("job");
  const user = useAuthStore((s) => s.user);

  const [conversations, setConversations] = useState<Job[]>([]);
  const [activeJobId, setActiveJobId] = useState<string | null>(jobId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await fetch("/api/jobs?mine=true");
        const data = await res.json();
        const active = (data.jobs ?? []).filter(
          (j: Job) => !["draft", "expired"].includes(j.status),
        );
        setConversations(active);
        if (!activeJobId && active.length > 0) {
          setActiveJobId(active[0].id);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchConversations();
  }, [activeJobId]);

  useEffect(() => {
    if (!activeJobId) return;
    async function fetchMessages() {
      const res = await fetch(`/api/messages?jobId=${activeJobId}`);
      const data = await res.json();
      setMessages(data.messages ?? []);
    }
    fetchMessages();
    // Poll for new messages every 3s
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [activeJobId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !activeJobId) return;

    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: activeJobId, content: input }),
    });
    setInput("");
    // Refetch
    const res = await fetch(`/api/messages?jobId=${activeJobId}`);
    const data = await res.json();
    setMessages(data.messages ?? []);
  }

  if (loading) {
    return <div className="animate-pulse h-96 bg-surface-container-high rounded-lg" />;
  }

  return (
    <div className="flex h-[calc(100vh-10rem)] gap-md">
      {/* Conversation list */}
      <div className="w-72 bg-surface border border-outline-variant rounded-lg overflow-y-auto">
        <div className="p-md border-b border-outline-variant">
          <h2 className="font-mono text-sm text-on-surface-variant uppercase">Conversations</h2>
        </div>
        {conversations.length === 0 ? (
          <p className="p-md text-sm text-on-surface-variant">No conversations yet</p>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.id}
              type="button"
              onClick={() => setActiveJobId(conv.id)}
              className={`w-full text-left p-md border-b border-outline-variant hover:bg-surface-hover transition-colors ${
                activeJobId === conv.id ? "bg-primary/10 border-l-2 border-l-primary" : ""
              }`}
            >
              <p className="font-semibold text-sm truncate">{conv.title}</p>
              <p className="text-xs text-on-surface-variant truncate">{conv.status}</p>
            </button>
          ))
        )}
      </div>

      {/* Chat area */}
      <div className="flex-1 bg-surface border border-outline-variant rounded-lg flex flex-col">
        {!activeJobId ? (
          <div className="flex-1 flex items-center justify-center text-on-surface-variant">
            Select a conversation
          </div>
        ) : (
          <>
            <div className="p-md border-b border-outline-variant">
              <p className="font-semibold">
                {conversations.find((c) => c.id === activeJobId)?.title ?? "Chat"}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-md space-y-sm">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}
                >
                  {msg.isSystem ? (
                    <div className="bg-surface-container-high px-md py-xs rounded text-xs text-on-surface-variant text-center w-full">
                      {msg.content}
                    </div>
                  ) : (
                    <div
                      className={`max-w-[70%] px-md py-sm rounded-lg ${
                        msg.senderId === user?.id
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container-high text-on-surface"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-[10px] opacity-70 mt-xs">
                        {formatRelativeTime(msg.createdAt)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={sendMessage} className="p-md border-t border-outline-variant flex gap-sm">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-on-surface text-sm focus:outline-none focus:border-primary"
              />
              <Button type="submit" disabled={!input.trim()}>
                <Icon name="send" size={18} />
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
