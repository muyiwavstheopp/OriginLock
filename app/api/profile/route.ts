import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionCookie, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  const session = verifySessionCookie(cookies().get(SESSION_COOKIE_NAME)?.value);
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("creators")
    .select("display_name")
    .eq("wallet_address", session.address)
    .maybeSingle();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load profile." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, displayName: data?.display_name ?? null });
}

export async function PUT(req: NextRequest) {
  const session = verifySessionCookie(cookies().get(SESSION_COOKIE_NAME)?.value);
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { displayName } = await req.json();
  const trimmed = typeof displayName === "string" ? displayName.trim().slice(0, 40) : "";

  if (!trimmed) {
    return NextResponse.json({ error: "Display name can't be empty." }, { status: 400 });
  }

  const supabase = supabaseServer();
  const { error } = await supabase
    .from("creators")
    .upsert(
      { wallet_address: session.address, display_name: trimmed },
      { onConflict: "wallet_address" }
    );

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save profile." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, displayName: trimmed });
}