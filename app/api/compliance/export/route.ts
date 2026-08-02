import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  const labWallet = req.nextUrl.searchParams.get("lab");
  const from = req.nextUrl.searchParams.get("from"); // ISO date, optional
  const to = req.nextUrl.searchParams.get("to");     // ISO date, optional

  if (!labWallet) {
    return NextResponse.json({ error: "lab wallet address required" }, { status: 400 });
  }

  const supabase = supabaseServer();
  let query = supabase
    .from("license_events")
    .select("content_hash, creator_wallet, price_per_use, currency, license_scope, onchain_tx_hash, block_number, created_at")
    .eq("lab_wallet", labWallet)
    .order("created_at", { ascending: true });

  if (from) query = query.gte("created_at", from);
  if (to) query = query.lte("created_at", to);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    lab: labWallet,
    generatedAt: new Date().toISOString(),
    totalRecords: data.length,
    events: data,
    verification: "Each onchain_tx_hash can be independently verified on Etherscan Sepolia against the contract's LicenseGranted event.",
  });
}