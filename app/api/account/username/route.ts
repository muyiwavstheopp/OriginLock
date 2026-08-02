import { NextRequest, NextResponse } from "next/server";
import { supabaseSession } from "@/lib/supabaseSession";
import { supabaseServer } from "@/lib/supabaseServer";

const INTERNAL_EMAIL_DOMAIN = "originlock.local";

export async function PATCH(req: NextRequest) {
  try {
    const session = supabaseSession();
    const {
      data: { user },
    } = await session.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
    }

    const { newUsername } = await req.json();

    if (!newUsername || !/^[a-zA-Z0-9_]{3,20}$/.test(newUsername)) {
      return NextResponse.json(
        { error: "Username must be 3-20 characters (letters, numbers, underscore)." },
        { status: 400 }
      );
    }

    const supabase = supabaseServer();

    const { data: existing } = await supabase
      .from("accounts")
      .select("id")
      .eq("username", newUsername)
      .maybeSingle();

    if (existing && existing.id !== user.id) {
      return NextResponse.json({ error: "That username is already taken." }, { status: 409 });
    }

    const newEmail = `${newUsername.toLowerCase()}@${INTERNAL_EMAIL_DOMAIN}`;

    // Keep the Supabase Auth email (which drives login) and the accounts
    // row in sync — both must succeed or neither should stick.
    const { error: authError } = await supabase.auth.admin.updateUserById(user.id, {
      email: newEmail,
      user_metadata: { username: newUsername },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    const { error: accountError } = await supabase
      .from("accounts")
      .update({ username: newUsername })
      .eq("id", user.id);

    if (accountError) {
      // Roll back the auth email change so login (username -> email mapping)
      // doesn't silently diverge from the accounts table.
      const { data: previous } = await supabase
        .from("accounts")
        .select("username")
        .eq("id", user.id)
        .single();
      if (previous) {
        await supabase.auth.admin.updateUserById(user.id, {
          email: `${previous.username.toLowerCase()}@${INTERNAL_EMAIL_DOMAIN}`,
        });
      }
      return NextResponse.json(
        { error: "Username is already taken." },
        { status: 409 }
      );
    }

    return NextResponse.json({ ok: true, username: newUsername });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not update username." },
      { status: 500 }
    );
  }
}