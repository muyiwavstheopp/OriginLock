import { NextRequest, NextResponse } from "next/server";
import { recoverMessageAddress, isAddress } from "viem";
import { supabaseServer } from "@/lib/supabaseServer";

// Internal email domain used so Supabase Auth (which requires an email)
// can be driven by username instead. Never shown to the user.
const INTERNAL_EMAIL_DOMAIN = "originlock.local";

function signupMessage(address: string, nonce: string) {
  return `Sign this message to create your OriginLock account.\n\nWallet: ${address}\nNonce: ${nonce}\n\nThis signature does not cost gas and will not be broadcast.`;
}

export async function POST(req: NextRequest) {
  try {
    const { address, nonce, signature, username, password } = await req.json();

    if (!address || !isAddress(address)) {
      return NextResponse.json({ error: "Invalid wallet address." }, { status: 400 });
    }
    if (!nonce || typeof nonce !== "string") {
      return NextResponse.json({ error: "Missing nonce." }, { status: 400 });
    }
    if (!signature) {
      return NextResponse.json({ error: "Missing wallet signature." }, { status: 400 });
    }
    if (!username || !/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return NextResponse.json(
        { error: "Username must be 3-20 characters (letters, numbers, underscore)." },
        { status: 400 }
      );
    }
    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    // Verify the signature actually came from the claimed address. This is
    // the step that proves wallet ownership — nothing below it should be
    // trusted without it succeeding first.
    const message = signupMessage(address, nonce);
    let recovered: string;
    try {
      recovered = await recoverMessageAddress({ message, signature });
    } catch {
      return NextResponse.json({ error: "Could not verify signature." }, { status: 401 });
    }

    if (recovered.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json(
        { error: "Signature does not match the provided wallet address." },
        { status: 401 }
      );
    }

    const supabase = supabaseServer();

    // Explicit pre-checks for friendlier errors than a raw unique-constraint
    // violation (the DB constraints are still the real backstop).
    const { data: existing } = await supabase
      .from("accounts")
      .select("username, wallet_address")
      .or(`username.eq.${username},wallet_address.eq.${address.toLowerCase()}`)
      .maybeSingle();

    if (existing) {
      const conflict =
        existing.username === username ? "Username" : "This wallet address";
      return NextResponse.json(
        { error: `${conflict} is already registered.` },
        { status: 409 }
      );
    }

    const email = `${username.toLowerCase()}@${INTERNAL_EMAIL_DOMAIN}`;

    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username },
    });

    if (createError || !created.user) {
      return NextResponse.json(
        { error: createError?.message ?? "Could not create account." },
        { status: 500 }
      );
    }

    const { error: accountError } = await supabase.from("accounts").insert({
      id: created.user.id,
      username,
      wallet_address: address.toLowerCase(),
    });

    if (accountError) {
      // Roll back the auth user so we don't leave an orphaned account with
      // no username/wallet tie.
      await supabase.auth.admin.deleteUser(created.user.id);

      const message = accountError.code === "23505"
        ? "Username or wallet address is already registered."
        : accountError.message;
      return NextResponse.json({ error: message }, { status: 409 });
    }

    return NextResponse.json({ ok: true, username });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Signup failed." },
      { status: 500 }
    );
  }
}