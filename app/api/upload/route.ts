import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { classifyContent } from "@/lib/ai";
import { sha256Hex } from "@/lib/hash";
import { generateFileKey, encryptBuffer, wrapFileKey } from "@/lib/crypto";
import { uploadEncryptedFile } from "@/lib/storage";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseSession } from "@/lib/supabaseSession";

export async function POST(req: NextRequest) {
  try {
    // Who's uploading comes from the session, never from the request body —
    // the client can no longer just claim a wallet address.
    const session = supabaseSession();
    const {
      data: { user },
    } = await session.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "You must be logged in to upload." }, { status: 401 });
    }

    const { data: account, error: accountError } = await session
      .from("accounts")
      .select("wallet_address")
      .eq("id", user.id)
      .single();

    if (accountError || !account) {
      return NextResponse.json(
        { error: "No wallet is tied to this account." },
        { status: 400 }
      );
    }

    const creatorWallet = account.wallet_address;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const pricePerUse = formData.get("pricePerUse") as string | null;
    const title = formData.get("title") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const plaintext = Buffer.from(await file.arrayBuffer());
    const contentHash = sha256Hex(plaintext);
    const classification = await classifyContent(plaintext, file.type);

    const fileKey = generateFileKey();
    const { ciphertext, iv, authTag } = encryptBuffer(plaintext, fileKey);
    const wrappedKey = wrapFileKey(fileKey);

    const storagePath = `${creatorWallet}/${randomUUID()}`;
    await uploadEncryptedFile(storagePath, ciphertext);

    const supabase = supabaseServer();

    const { data: record, error: recordError } = await supabase
      .from("content_records")
      .insert({
        creator_wallet: creatorWallet,
        content_hash: contentHash,
        content_type: classification.mediaKind,
        media_subtype: classification.subtype,
        description: classification.description,
        title: title ?? classification.subtype,
        license_terms: { price_per_use: pricePerUse ?? "0", currency: "USDC" },
        storage_path: storagePath,
        file_iv: iv,
        file_auth_tag: authTag,
      })
      .select()
      .single();

    if (recordError) {
      if (recordError.code === "23505") {
        return NextResponse.json(
          { error: "This exact file has already been registered." },
          { status: 409 }
        );
      }
      throw new Error(recordError.message);
    }

    const { error: keyError } = await supabase.from("content_keys").insert({
      content_record_id: record.id,
      encrypted_key: wrappedKey.ciphertext.toString("hex"),
      key_iv: wrappedKey.iv,
      key_auth_tag: wrappedKey.authTag,
    });

    if (keyError) throw new Error(keyError.message);

    return NextResponse.json({
      ok: true,
      record: {
        id: record.id,
        contentHash,
        mediaKind: classification.mediaKind,
        subtype: classification.subtype,
        description: classification.description,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed." },
      { status: 500 }
    );
  }
}