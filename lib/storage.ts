import { supabaseServer } from "@/lib/supabaseServer";

export async function uploadEncryptedFile(path: string, buffer: Buffer) {
  const supabase = supabaseServer();
  const { error } = await supabase.storage
    .from("content")
    .upload(path, buffer, { contentType: "application/octet-stream", upsert: false });

  if (error) throw new Error(`Storage upload failed: ${error.message}`);
  return path;
}