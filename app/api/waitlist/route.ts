import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { email, role } = await req.json();

    if (typeof email !== "string" || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
    }

    const supabase = supabaseServer();
    const { error } = await supabase
      .from("waitlist")
      .insert({ email: email.toLowerCase().trim(), role: role ?? "unspecified" });

    if (error) {
      // Unique constraint violation = already on the list; treat as success.
      if (error.code === "23505") {
        return NextResponse.json({ ok: true, message: "You're already on the list." });
      }
      console.error(error);
      return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: "You're on the list." });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
}