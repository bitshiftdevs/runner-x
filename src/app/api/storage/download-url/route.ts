import { NextResponse } from "next/server";

import { gqlRequest } from "@/lib/gql-client";
import type { BackendError } from "@/lib/gql-errors";
import { GENERATE_DOWNLOAD_URL } from "@/lib/graphql/operations";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    bucket?: string;
    filePath?: string;
  };
  if (!body.bucket || !body.filePath) {
    return NextResponse.json(
      { error: "bucket and filePath are required" },
      { status: 400 },
    );
  }
  try {
    const data = await gqlRequest<{ generateDownloadUrl: string }>(
      GENERATE_DOWNLOAD_URL,
      { bucket: body.bucket, filePath: body.filePath },
    );
    return NextResponse.json({ url: data.generateDownloadUrl });
  } catch (err) {
    const be = err as BackendError;
    return NextResponse.json(
      { error: be.message },
      { status: be.kind === "unauthenticated" ? 401 : 400 },
    );
  }
}
