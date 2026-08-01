import { NextResponse } from "next/server";

import { gqlRequest } from "@/lib/gql-client";
import type { BackendError } from "@/lib/gql-errors";
import { type BackendMessage, toClientMessage } from "@/lib/graphql/adapters";
import { CHAT_MESSAGES, SEND_MESSAGE } from "@/lib/graphql/operations";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const jobId = url.searchParams.get("jobId");
  if (!jobId) return NextResponse.json({ messages: [] });

  try {
    const data = await gqlRequest<{ chatMessages: BackendMessage[] }>(
      CHAT_MESSAGES,
      { errandId: jobId },
    );
    return NextResponse.json({
      messages: data.chatMessages.map(toClientMessage),
    });
  } catch (err) {
    const be = err as BackendError;
    return NextResponse.json(
      { messages: [], error: be.message },
      { status: be.kind === "unauthenticated" ? 401 : 500 },
    );
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    jobId?: string;
    content?: string;
    imageUrl?: string;
  };
  if (!body.jobId) {
    return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
  }

  try {
    const data = await gqlRequest<{ sendMessage: BackendMessage }>(
      SEND_MESSAGE,
      {
        input: {
          errandId: body.jobId,
          content: body.content ?? null,
          imageUrl: body.imageUrl ?? null,
          audioUrl: null,
          messageType: body.imageUrl ? "image" : "text",
        },
      },
    );
    return NextResponse.json({ message: toClientMessage(data.sendMessage) });
  } catch (err) {
    const be = err as BackendError;
    return NextResponse.json(
      { error: be.message },
      { status: be.kind === "unauthenticated" ? 401 : 400 },
    );
  }
}
