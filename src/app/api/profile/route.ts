import { NextResponse } from "next/server";

import { gqlRequest } from "@/lib/gql-client";
import type { BackendError } from "@/lib/gql-errors";
import {
  type BackendProfileRaw,
  toClientProfile,
} from "@/lib/graphql/adapters";
import { UPDATE_PROFILE, UPDATE_PROFILE_PHOTO } from "@/lib/graphql/operations";

type ProfilePatchBody = {
  fullName?: string;
  bio?: string;
  role?: string;
  photoUrl?: string;
  phone?: string;
  campus?: string;
};

/**
 * Updates the caller's profile. Accepts the legacy PATCH payload (with
 * `photoUrl`, `phone`, `campus`, ...) and translates to the backend field
 * names. Uses `updateProfilePhoto` for photo-only changes because the
 * backend enforces stricter validation on that mutation.
 */
export async function PATCH(request: Request) {
  let body: ProfilePatchBody;
  try {
    body = (await request.json()) as ProfilePatchBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const isPhotoOnly =
    body.photoUrl !== undefined &&
    body.fullName === undefined &&
    body.phone === undefined &&
    body.campus === undefined;

  try {
    if (isPhotoOnly && body.photoUrl) {
      const data = await gqlRequest<{ updateProfilePhoto: BackendProfileRaw }>(
        UPDATE_PROFILE_PHOTO,
        { avatarUrl: body.photoUrl },
      );
      return NextResponse.json({
        user: toClientProfile(data.updateProfilePhoto),
      });
    }

    const input: Record<string, unknown> = {};
    if (body.fullName !== undefined) input.fullName = body.fullName;
    if (body.phone !== undefined) input.phoneNumber = body.phone;
    if (body.campus !== undefined) input.defaultCampus = body.campus;
    if (body.photoUrl !== undefined) input.avatarUrl = body.photoUrl;

    const data = await gqlRequest<{ updateProfile: BackendProfileRaw }>(
      UPDATE_PROFILE,
      { input },
    );
    return NextResponse.json({ user: toClientProfile(data.updateProfile) });
  } catch (err) {
    const be = err as BackendError;
    return NextResponse.json(
      { error: be.message, kind: be.kind ?? "internal" },
      { status: be.kind === "validation" ? 400 : 500 },
    );
  }
}
