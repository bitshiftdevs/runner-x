import { NextResponse } from "next/server";

import { gqlRequest } from "@/lib/gql-client";
import type { BackendError } from "@/lib/gql-errors";
import { GENERATE_UPLOAD_URL } from "@/lib/graphql/operations";

/**
 * Two-step upload: client posts `{ bucket, fileName }` here to get a
 * presigned PUT URL + a public URL to persist, then PUTs the file bytes
 * directly to `uploadUrl`. This route never touches the file itself.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as {
    bucket?: string;
    fileName?: string;
  };
  if (!body.bucket || !body.fileName) {
    return NextResponse.json(
      { error: "bucket and fileName are required" },
      { status: 400 },
    );
  }
  try {
    const data = await gqlRequest<{
      generateUploadUrl: {
        uploadUrl: string;
        publicUrl: string;
        filePath: string;
      };
    }>(GENERATE_UPLOAD_URL, { bucket: body.bucket, fileName: body.fileName });
    return NextResponse.json(data.generateUploadUrl);
  } catch (err) {
    const be = err as BackendError;
    return NextResponse.json(
      { error: be.message },
      { status: be.kind === "unauthenticated" ? 401 : 400 },
    );
  }
}
