import { NextResponse } from "next/server";

import { gqlRequest } from "@/lib/gql-client";
import type { BackendError } from "@/lib/gql-errors";
import { PENDING_VERIFICATIONS } from "@/lib/graphql/operations";

type PendingVerification = {
  id: string;
  fullName: string;
  phoneNumber: string | null;
  avatarUrl: string | null;
  defaultCampus: string | null;
  createdAt: string;
};

export async function GET() {
  try {
    const data = await gqlRequest<{
      pendingVerifications: PendingVerification[];
    }>(PENDING_VERIFICATIONS);
    return NextResponse.json({
      users: data.pendingVerifications.map((u) => ({
        id: u.id,
        fullName: u.fullName,
        phone: u.phoneNumber ?? "",
        studentIdUrl: u.avatarUrl,
        campus: u.defaultCampus ?? "",
        createdAt: u.createdAt,
      })),
    });
  } catch (err) {
    const be = err as BackendError;
    return NextResponse.json(
      { users: [], error: be.message },
      { status: be.kind === "permission_denied" ? 403 : 500 },
    );
  }
}
