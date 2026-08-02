import { NextResponse } from "next/server";
import { supabaseSession } from "@/lib/supabaseSession";

export async function POST() {
  const supabase = supabaseSession();
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}