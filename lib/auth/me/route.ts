import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionCookie, SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function GET() {
  const session = verifySessionCookie(cookies().get(SESSION_COOKIE_NAME)?.value);
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  return NextResponse.json({ ok: true, address: session.address });
}