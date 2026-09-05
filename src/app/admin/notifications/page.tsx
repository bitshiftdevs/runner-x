"use client";

import { useState } from "react";
import { gqlFetch } from "@/lib/gql-client-browser";
import {
  SEND_ADMIN_NOTIFICATION,
  SEND_BULK_ADMIN_NOTIFICATION,
} from "@/lib/graphql/operations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, User, Users } from "lucide-react";

type Mode = "user" | "bulk";
type SendStatus = "idle" | "sending" | "ok" | "error";

export default function NotificationsPage() {
  const [mode, setMode] = useState<Mode>("user");

  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<SendStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const reset = () => {
    setTitle("");
    setBody("");
    setUserId("");
    setStatus("idle");
    setErrorMsg("");
    setConfirmed(false);
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "bulk" && !confirmed) {
      setConfirmed(true);
      return;
    }

    setStatus("sending");
    setErrorMsg("");
    try {
      if (mode === "user") {
        await gqlFetch(SEND_ADMIN_NOTIFICATION, { userId, title, body });
      } else {
        await gqlFetch(SEND_BULK_ADMIN_NOTIFICATION, { title, body });
      }
      reset();
      setStatus("ok");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to send");
      setStatus("error");
    }
  };

  const heading =
    mode === "user" ? "Notify a specific user" : "Notify all users";

  const buttonLabel =
    status === "sending"
      ? "Sending…"
      : mode === "bulk" && confirmed
        ? "Confirm & Send to All"
        : mode === "bulk"
          ? "Send to All"
          : "Send";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Bell className="size-6" />
          Send Notifications
        </h1>
        <p className="text-sm text-muted-foreground">
          Push notifications to a specific user or all users
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant={mode === "user" ? "default" : "outline"}
          size="sm"
          onClick={() => switchMode("user")}
        >
          <User className="size-4 mr-1.5" />
          Per User
        </Button>
        <Button
          type="button"
          variant={mode === "bulk" ? "default" : "outline"}
          size="sm"
          onClick={() => switchMode("bulk")}
        >
          <Users className="size-4 mr-1.5" />
          All Users
        </Button>
      </div>

      <div className="rounded-2xl border border-foreground/10 bg-card p-6 text-sm text-card-foreground max-w-lg">
        <p className="font-medium mb-4">{heading}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "user" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" htmlFor="userId">
                User ID
              </label>
              <Input
                id="userId"
                placeholder="UUID of the user"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="notif-title">
              Title
            </label>
            <Input
              id="notif-title"
              placeholder="Notification title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setConfirmed(false);
              }}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="notif-body">
              Message
            </label>
            <textarea
              id="notif-body"
              placeholder="Notification body"
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                setConfirmed(false);
              }}
              rows={3}
              required
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
          </div>

          {status === "ok" && (
            <p className="text-sm text-green-600">
              {mode === "user" ? "Notification sent." : "Bulk notification queued."}
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-destructive">{errorMsg}</p>
          )}
          {mode === "bulk" && confirmed && status !== "sending" && (
            <p className="text-sm text-amber-600 font-medium">
              This will notify every active user. Click again to confirm.
            </p>
          )}

          <Button
            type="submit"
            disabled={status === "sending"}
            variant={mode === "bulk" && confirmed ? "destructive" : "default"}
          >
            {buttonLabel}
          </Button>
        </form>
      </div>
    </div>
  );
}
