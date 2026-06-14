"use client";
import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { useAuthStore } from "@/stores";
import { formatRelativeTime, api } from "@/lib";
import type { Message, Job } from "@/types";

export default function InboxPage() {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse h-96 bg-surface-container-high rounded-lg m-md" />
      }
    >
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
  const [showConvList, setShowConvList] = useState(!jobId);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchConversations() {
      try {
        const data = await api.jobs.list({ mine: true });
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
  }, []);

  useEffect(() => {
    if (!activeJobId) return;
    async function fetchMessages() {
      const data = await api.messages.list(activeJobId!);
      setMessages(data.messages ?? []);
    }
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [activeJobId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !activeJobId) return;
    await api.messages.send(activeJobId, input);
    setInput("");
    const data = await api.messages.list(activeJobId);
    setMessages(data.messages ?? []);
  }

  function openChat(id: string) {
    setActiveJobId(id);
    setShowConvList(false);
  }

  const activeConv = conversations.find((c) => c.id === activeJobId);

  if (loading) {
    return (
      <div className="animate-pulse h-96 bg-surface-container-high rounded-lg m-md" />
    );
  }

  // — Conversation list (mobile default / desktop left panel) —
  if (showConvList) {
    return (
      <div className="flex flex-col">
        <div className="p-md border-b border-outline-variant">
          <h2 className="font-sans text-lg font-semibold text-on-surface">
            Conversations
          </h2>
        </div>
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-3xl">
            <Icon
              name="chat_bubble_outline"
              size={64}
              className="text-on-surface-variant animate-pulse"
            />
            <p className="font-sans text-lg font-semibold mt-md">
              No conversations yet
            </p>
            <p className="text-on-surface-variant text-sm mt-xs">
              Accept a quest to start chatting with your runner.
            </p>
          </div>
        ) : (
          <div>
            {conversations.map((conv) => (
              <button
                key={conv.id}
                type="button"
                onClick={() => openChat(conv.id)}
                className="w-full text-left p-md border-b border-outline-variant hover:bg-surface-hover transition-colors flex items-center gap-md"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                  <Icon name="person" className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans font-semibold text-on-surface truncate">
                    {conv.title}
                  </p>
                  <p className="font-mono text-xs text-on-surface-variant">
                    {conv.status.replace(/_/g, " ")}
                  </p>
                </div>
                <Icon
                  name="chevron_right"
                  className="text-on-surface-variant shrink-0"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // — Chat view —
  return (
    <div className="flex flex-col min-h-[calc(100dvh-9rem)]">
      {/* Chat header */}
      <header className="sticky top-14 lg:top-16 z-20 bg-surface-dim border-b border-outline-variant px-md py-sm flex items-center justify-between">
        <div className="flex items-center gap-md">
          <button
            type="button"
            onClick={() => setShowConvList(true)}
            className="p-xs hover:bg-surface-hover rounded-full transition-colors text-on-surface"
          >
            <Icon name="arrow_back" />
          </button>
          <div className="flex items-center gap-sm">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Icon name="person" className="text-primary" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-surface-dim rounded-full" />
            </div>
            <div>
              <h1 className="font-sans font-semibold text-on-surface truncate max-w-[140px]">
                {activeConv?.title ?? "Chat"}
              </h1>
              <span className="font-mono text-xs text-success flex items-center gap-xs">
                <Icon name="stars" size={12} filled />
                Active
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-mono text-xs text-primary uppercase tracking-widest">
            {activeConv?.status.replace(/_/g, " ") ?? "Quest Active"}
          </span>
          <span className="font-mono text-[10px] text-on-surface-variant">
            #{activeJobId?.slice(-6).toUpperCase()}
          </span>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-md py-lg flex flex-col gap-lg">
        {messages.length === 0 && (
          <div className="flex justify-center">
            <span className="font-mono text-xs bg-surface-container px-md py-xs rounded-full text-on-surface-variant">
              No messages yet — say hello!
            </span>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.isSystem ? (
              <div className="flex justify-center">
                <span className="font-mono text-xs bg-surface-container px-md py-xs rounded-full text-on-surface-variant">
                  {msg.content}
                </span>
              </div>
            ) : (
              <div
                className={`flex flex-col max-w-[85%] ${
                  msg.senderId === user?.id ? "items-end ml-auto" : "items-start"
                }`}
              >
                <div className="flex items-center gap-sm mb-xs">
                  {msg.senderId !== user?.id && (
                    <span className="font-mono text-xs text-primary">
                      Runner
                    </span>
                  )}
                  <span className="text-[10px] text-on-surface-variant">
                    {formatRelativeTime(msg.createdAt)}
                  </span>
                  {msg.senderId === user?.id && (
                    <span className="font-mono text-xs text-secondary">Me</span>
                  )}
                </div>
                <div
                  className={`p-md rounded-xl ${
                    msg.senderId === user?.id
                      ? "bg-primary-container text-on-primary-container rounded-tr-none glow-primary"
                      : "bg-surface border border-outline-variant rounded-tl-none"
                  }`}
                >
                  {msg.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      alt="attachment"
                      className="w-full rounded-lg mb-sm object-cover max-h-48"
                    />
                  )}
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </main>

      {/* Input footer */}
      <footer className="sticky bottom-20 lg:bottom-0 bg-surface-dim border-t border-outline-variant p-md flex flex-col gap-md">
        {/* Quick actions */}
        <div className="flex gap-sm overflow-x-auto hide-scrollbar">
          <button
            type="button"
            className="shrink-0 flex items-center gap-xs bg-surface border border-outline-variant px-md py-sm rounded-full hover:bg-surface-hover transition-all"
          >
            <Icon name="location_on" size={18} className="text-secondary" />
            <span className="font-mono text-xs text-on-surface">
              Share Location
            </span>
          </button>
          <button
            type="button"
            className="shrink-0 flex items-center gap-xs bg-surface border border-outline-variant px-md py-sm rounded-full hover:bg-surface-hover transition-all"
          >
            <Icon name="payment" size={18} className="text-tertiary" />
            <span className="font-mono text-xs text-on-surface">
              Request Bounty Adjust
            </span>
          </button>
          <button
            type="button"
            className="shrink-0 flex items-center gap-xs bg-surface border border-outline-variant px-md py-sm rounded-full hover:bg-surface-hover transition-all"
          >
            <Icon name="check_circle" size={18} className="text-success" />
            <span className="font-mono text-xs text-on-surface">
              Confirm Receipt
            </span>
          </button>
        </div>
        {/* Input row */}
        <form onSubmit={sendMessage} className="flex items-center gap-md">
          <button
            type="button"
            className="p-md bg-surface border border-outline-variant rounded-xl hover:border-primary transition-all"
          >
            <Icon name="photo_camera" className="text-on-surface-variant" />
          </button>
          <div className="flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-md py-md text-sm text-on-surface placeholder:text-on-surface-variant transition-all outline-none"
              placeholder={
                activeConv
                  ? `Message about "${activeConv.title}"...`
                  : "Type a message..."
              }
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-md bg-primary text-on-primary rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.25)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            <Icon name="send" filled />
          </button>
        </form>
      </footer>
    </div>
  );
}
