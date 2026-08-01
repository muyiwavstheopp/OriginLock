import { NextRequest, NextResponse } from "next/server";
import { classifyContent } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await classifyContent(buffer, file.type);

    return NextResponse.json({ ok: true, result });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Classification failed." },
      { status: 500 }
    );
  }
}