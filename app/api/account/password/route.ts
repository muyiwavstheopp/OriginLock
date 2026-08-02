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

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current and new password are both required." },
        { status: 400 }
      );
    }
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const supabase = supabaseServer();
    const { data: account } = await supabase
      .from("accounts")
      .select("username")
      .eq("id", user.id)
      .single();

    if (!account) {
      return NextResponse.json({ error: "Account not found." }, { status: 400 });
    }

    const email = `${account.username.toLowerCase()}@${INTERNAL_EMAIL_DOMAIN}`;

    // Re-verify the current password before allowing the change, using the
    // session client so it doesn't disturb anything if it fails.
    const { error: verifyError } = await session.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (verifyError) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }

    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not update password." },
      { status: 500 }
    );
  }
}