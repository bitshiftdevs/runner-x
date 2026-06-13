import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { phone } = await request.json();

  if (!phone || phone.replace(/\D/g, "").length < 9) {
    return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
  }

  // In production, integrate with SMS gateway (e.g. Moolre, Arkesel)
  // For MVP, we simulate OTP delivery
  // The OTP would be stored server-side with expiry (Redis or DB)
  console.log(`[OTP] Sending to +233${phone}: 123456`);

  return NextResponse.json({ success: true, message: "OTP sent" });
}
