"use client";

/**
 * Minimal `graphql-transport-ws` client for browser-side subscriptions.
 * Speaks the protocol directly against the backend's `/subscriptions`
 * WebSocket endpoint — no external deps.
 *
 * See https://github.com/enisdenjo/graphql-ws for the protocol spec.
 */

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

type ServerMessage =
  | { type: "connection_ack" }
  | { type: "next"; id: string; payload: { data: unknown; errors?: unknown } }
  | { type: "error"; id: string; payload: unknown }
  | { type: "complete"; id: string }
  | { type: "ping" }
  | { type: "pong" };

type ClientMessage =
  | { type: "connection_init"; payload?: Record<string, unknown> }
  | {
      type: "subscribe";
      id: string;
      payload: { query: string; variables?: Record<string, unknown> };
    }
  | { type: "complete"; id: string }
  | { type: "pong" };

export type SubscriptionHandle = { unsubscribe: () => void };

type Handler = {
  next: (data: unknown) => void;
  error?: (err: unknown) => void;
};

/**
 * A lazily-connected subscription client. The first `.subscribe()` call
 * opens the WebSocket and sends `connection_init` with the caller's access
 * token (fetched from `/api/auth/ws-token`); subsequent subscriptions
 * reuse the same socket. When the last subscription unsubscribes we tear
 * the socket down so an idle tab doesn't hold a connection open forever.
 */
class SubscriptionClient {
  private socket: WebSocket | null = null;
  private ready: Promise<WebSocket> | null = null;
  private handlers = new Map<string, Handler>();
  private nextId = 1;

  async subscribe(
    query: string,
    variables: Record<string, unknown> | undefined,
    handler: Handler,
  ): Promise<SubscriptionHandle> {
    const ws = await this.ensureConnected();
    const id = String(this.nextId++);
    this.handlers.set(id, handler);
    ws.send(
      JSON.stringify({
        type: "subscribe",
        id,
        payload: { query, variables },
      } satisfies ClientMessage),
    );
    return {
      unsubscribe: () => {
        this.handlers.delete(id);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({ type: "complete", id } satisfies ClientMessage),
          );
        }
        if (this.handlers.size === 0) this.close();
      },
    };
  }

  private async ensureConnected(): Promise<WebSocket> {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return this.socket;
    }
    if (this.ready) return this.ready;

    this.ready = (async () => {
      if (!backendUrl) {
        throw new Error("NEXT_PUBLIC_BACKEND_URL is not configured");
      }
      const tokenRes = await fetch("/api/auth/ws-token");
      const { token } = (await tokenRes.json()) as { token: string | null };
      if (!token) throw new Error("Not authenticated");

      const wsUrl = `${backendUrl
        .replace(/^http/, "ws")
        .replace(/\/$/, "")}/subscriptions`;
      const ws = new WebSocket(wsUrl, "graphql-transport-ws");
      this.socket = ws;

      await new Promise<void>((resolve, reject) => {
        ws.addEventListener("open", () => {
          ws.send(
            JSON.stringify({
              type: "connection_init",
              payload: { Authorization: `Bearer ${token}` },
            } satisfies ClientMessage),
          );
        });
        ws.addEventListener("message", (event) => {
          const msg = JSON.parse(String(event.data)) as ServerMessage;
          if (msg.type === "connection_ack") {
            resolve();
            return;
          }
          if (msg.type === "ping") {
            ws.send(JSON.stringify({ type: "pong" } satisfies ClientMessage));
            return;
          }
          if (msg.type === "next") {
            this.handlers.get(msg.id)?.next(msg.payload.data);
            return;
          }
          if (msg.type === "error") {
            this.handlers.get(msg.id)?.error?.(msg.payload);
            return;
          }
          if (msg.type === "complete") {
            this.handlers.delete(msg.id);
          }
        });
        ws.addEventListener("error", (event) => reject(event));
        ws.addEventListener("close", () => {
          this.socket = null;
          this.ready = null;
          // Notify all pending handlers so callers can retry / redirect.
          for (const h of this.handlers.values()) {
            h.error?.(new Error("Subscription socket closed"));
          }
          this.handlers.clear();
        });
      });

      return ws;
    })();

    return this.ready;
  }

  private close() {
    this.socket?.close();
    this.socket = null;
    this.ready = null;
  }
}

// Module-level singleton — one WS per tab, shared by every caller.
const client = new SubscriptionClient();

export function subscribe<TData>(
  query: string,
  variables: Record<string, unknown> | undefined,
  onNext: (data: TData) => void,
  onError?: (err: unknown) => void,
): Promise<SubscriptionHandle> {
  return client.subscribe(query, variables, {
    next: (d) => onNext(d as TData),
    error: onError,
  });
}

// Operation documents mirror `src/lib/graphql/operations.ts` (which is
// server-only). We inline them here so a Client Component can import
// without dragging the server-only bundle in.

export const ERRAND_STATUS_SUBSCRIPTION = /* GraphQL */ `
  subscription ErrandStatus($errandId: ID!) {
    errandStatusChanged(errandId: $errandId) {
      id status runnerId runnerLat runnerLng
    }
  }
`;

export const PAYMENT_STATUS_SUBSCRIPTION = /* GraphQL */ `
  subscription PaymentStatus($errandId: ID!) {
    paymentStatusChanged(errandId: $errandId) {
      id status providerRef updatedAt
    }
  }
`;

export const WALLET_UPDATED_SUBSCRIPTION = /* GraphQL */ `
  subscription WalletUpdated {
    walletUpdated {
      id availableBalance pendingBalance totalEarned totalWithdrawn
    }
  }
`;
