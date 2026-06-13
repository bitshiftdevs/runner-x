import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const { phone, code } = await request.json();

  if (!phone || !code) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // MVP: accept "123456" as valid OTP
  if (code !== "123456") {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
  }

  const formattedPhone = phone.startsWith("233") ? `+${phone}` : `+233${phone}`;

  // Check if user exists
  const existing = await db
    .select()
    .from(profiles)
    .where(eq(profiles.phone, formattedPhone))
    .limit(1);

  let user = existing[0];
  let isNewUser = false;

  if (!user) {
    const [created] = await db
      .insert(profiles)
      .values({
        fullName: "",
        email: `${phone}@runner-x.app`,
        phone: formattedPhone,
        campus: "KNUST",
      })
      .returning();
    user = created;
    isNewUser = true;
  }

  // Set session cookie (simple token for MVP)
  const cookieStore = await cookies();
  cookieStore.set("session", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return NextResponse.json({
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      photoUrl: user.photoUrl,
      bio: user.bio,
      role: user.role,
      studentIdVerified: user.studentIdVerified,
      campus: user.campus,
      rating: user.rating,
      totalJobs: user.totalJobs,
      createdAt: user.createdAt,
    },
    isNewUser,
  });
}
