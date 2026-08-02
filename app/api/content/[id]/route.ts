import { NextRequest, NextResponse } from "next/server";
import { supabaseSession } from "@/lib/supabaseSession";
import { supabaseServer } from "@/lib/supabaseServer";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = supabaseSession();
    const {
      data: { user },
    } = await session.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
    }

    const { data: account } = await session
      .from("accounts")
      .select("wallet_address")
      .eq("id", user.id)
      .single();

    if (!account) {
      return NextResponse.json({ error: "No account found for this session." }, { status: 400 });
    }

    const { pricePerUse } = await req.json();
    const dollarAmount = parseFloat(pricePerUse);
    if (isNaN(dollarAmount) || dollarAmount < 0) {
      return NextResponse.json({ error: "Invalid price." }, { status: 400 });
    }
    const smallestUnit = Math.round(dollarAmount * 1_000_000);

    // Service role bypasses RLS, so ownership is enforced here in code:
    // only rows whose creator_wallet matches the session's own account can
    // be touched, matching the same trust boundary as the upload route.
    const supabase = supabaseServer();

    const { data: existing, error: fetchError } = await supabase
      .from("content_records")
      .select("id, creator_wallet, license_terms")
      .eq("id", params.id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Content not found." }, { status: 404 });
    }

    if (existing.creator_wallet.toLowerCase() !== account.wallet_address.toLowerCase()) {
      return NextResponse.json(
        { error: "You don't own this content record." },
        { status: 403 }
      );
    }

    const { error: updateError } = await supabase
      .from("content_records")
      .update({
        license_terms: {
          ...(existing.license_terms ?? {}),
          price_per_use: smallestUnit.toString(),
          currency: "USDC",
        },
      })
      .eq("id", params.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, pricePerUse: dollarAmount });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Update failed." },
      { status: 500 }
    );
  }
}