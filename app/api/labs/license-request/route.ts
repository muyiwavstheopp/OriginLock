import { NextRequest, NextResponse } from "next/server";
import { decodeEventLog } from "viem";
import { getVerifierClients } from "@/lib/web3/verifierWallet";
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

    const { data: record, error: recordError } = await supabase
      .from("content_records")
      .select("id, creator_wallet, license_terms")
      .eq("content_hash", contentHash)
      .single();

    if (recordError || !record) {
      return NextResponse.json({ error: "Content not found." }, { status: 404 });
    }

    const { walletClient, publicClient, account, abi, address } = getVerifierClients();

    const contentHashBytes32 = `0x${contentHash}` as `0x${string}`;

    const hash = await walletClient.writeContract({
      account,
      address,
      abi,
      functionName: "recordUsage",
      args: [contentHashBytes32, labWallet as `0x${string}`, licenseScope],
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    if (receipt.status !== "success") {
      return NextResponse.json({ error: "Transaction failed on-chain." }, { status: 500 });
    }

    // Decode the UsageRecorded event to get the amount actually paid,
    // rather than trusting a pre-transaction read of price.
    let amountPaid = record.license_terms?.price_per_use ?? "0";
    for (const log of receipt.logs) {
      try {
        const decoded = decodeEventLog({ abi, data: log.data, topics: log.topics });
        if (decoded.eventName === "UsageRecorded") {
          amountPaid = (decoded.args as any).amountPaid.toString();
          break;
        }
      } catch {
        // Not a matching log, skip.
      }
    }

    const { error: insertError } = await supabase.from("license_events").insert({
      content_record_id: record.id,
      content_hash: contentHash,
      creator_wallet: record.creator_wallet,
      lab_wallet: labWallet,
      price_per_use: amountPaid,
      currency: record.license_terms?.currency ?? "USDC",
      license_scope: licenseScope,
      onchain_tx_hash: receipt.transactionHash,
      block_number: Number(receipt.blockNumber),
    });

    if (insertError) {
      console.error("license_events insert failed after successful on-chain tx:", insertError, receipt.transactionHash);
    }

    return NextResponse.json({
      ok: true,
      txHash: receipt.transactionHash,
      blockNumber: Number(receipt.blockNumber),
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