import { NextRequest, NextResponse } from "next/server";
import { supabaseSession } from "@/lib/supabaseSession";

const INTERNAL_EMAIL_DOMAIN = "originlock.local";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const email = `${String(username).toLowerCase()}@${INTERNAL_EMAIL_DOMAIN}`;
    const supabase = supabaseSession();

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // Deliberately vague — don't reveal whether the username exists.
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Login failed." },
      { status: 500 }
    );
  }
}