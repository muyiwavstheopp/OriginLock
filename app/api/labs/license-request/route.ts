import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { getVerifierContract } from "@/lib/web3/verifierWallet";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const { contentHash, labWallet, licenseScope } = await req.json();

    if (!contentHash || !labWallet || !licenseScope) {
      return NextResponse.json(
        { error: "contentHash, labWallet, and licenseScope are required." },
        { status: 400 }
      );
    }

    const supabase = supabaseServer();

    // Confirm this content is actually registered and active before touching the chain.
    const { data: record, error: recordError } = await supabase
      .from("content_records")
      .select("id, creator_wallet, license_terms")
      .eq("content_hash", contentHash)
      .single();

    if (recordError || !record) {
      return NextResponse.json({ error: "Content not found." }, { status: 404 });
    }

    const contract = getVerifierContract();
    const contentHashBytes32 = ethers.id(contentHash); // keccak256 of the hex string, matching how it was registered on-chain

    // This call does three things atomically on-chain: pulls payment from
    // labWallet (which must have already approved the contract to spend
    // the payment token), forwards it to the creator, and emits
    // UsageRecorded — the event this whole compliance trail depends on.
    const tx = await contract.recordUsage(contentHashBytes32, labWallet, licenseScope);
    const receipt = await tx.wait();

    if (!receipt || receipt.status !== 1) {
      return NextResponse.json({ error: "Transaction failed on-chain." }, { status: 500 });
    }

    // Pull the amount actually paid from the UsageRecorded event rather than
    // trusting our own pre-transaction read of price — the chain is the
    // source of truth for what was actually paid.
    const event = receipt.logs
      .map((log: any) => {
        try {
          return contract.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((parsed: any) => parsed?.name === "UsageRecorded");

    const amountPaid = event ? event.args.amountPaid.toString() : record.license_terms?.price_per_use ?? "0";

    const { error: insertError } = await supabase.from("license_events").insert({
      content_record_id: record.id,
      content_hash: contentHash,
      creator_wallet: record.creator_wallet,
      lab_wallet: labWallet,
      price_per_use: amountPaid,
      currency: record.license_terms?.currency ?? "USDC",
      license_scope: licenseScope,
      onchain_tx_hash: receipt.hash,
      block_number: receipt.blockNumber,
    });

    if (insertError) {
      // The on-chain payment already succeeded at this point — don't fail
      // the request over a DB write issue, but flag it loudly for follow-up.
      console.error("license_events insert failed after successful on-chain tx:", insertError, receipt.hash);
    }

    return NextResponse.json({
      ok: true,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      amountPaid,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "License request failed." },
      { status: 500 }
    );
  }
}