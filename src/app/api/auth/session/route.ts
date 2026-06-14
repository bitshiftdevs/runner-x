import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";

async function getUserId() {
  const cookieStore = await cookies();
  return cookieStore.get("session")?.value ?? null;
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ user: null }, { status: 401 });

  const { data: user } = await db
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ user });
}

export async function PATCH(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const updates: Record<string, unknown> = {};
  if (body.fullName !== undefined) updates.full_name = body.fullName;
  if (body.bio !== undefined) updates.bio = body.bio;
  if (body.role !== undefined) updates.role = body.role;
  if (body.photoUrl !== undefined) updates.avatar_url = body.photoUrl;

  const { data: user } = await db
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  return NextResponse.json({ user });
}
