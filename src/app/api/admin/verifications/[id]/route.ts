import { NextResponse } from "next/server";

import { gqlRequest } from "@/lib/gql-client";
import type { BackendError } from "@/lib/gql-errors";
import { VERIFY_STUDENT_ID } from "@/lib/graphql/operations";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { action } = (await request.json()) as {
    action: "approve" | "reject";
  };
  const status = action === "approve" ? "approved" : "rejected";

  try {
    await gqlRequest<{ verifyStudentId: { id: string } }>(VERIFY_STUDENT_ID, {
      userId: id,
      status,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    const be = err as BackendError;
    return NextResponse.json(
      { error: be.message },
      { status: be.kind === "permission_denied" ? 403 : 500 },
    );
  }
}
