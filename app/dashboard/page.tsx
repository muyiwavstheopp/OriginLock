import { redirect } from "next/navigation";
import { supabaseSession } from "@/lib/supabaseSession";
import { supabaseServer } from "@/lib/supabaseServer";
import DashboardShell from "@/components/DashboardShell";

export default async function DashboardPage() {
  const session = supabaseSession();
  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: account } = await session
    .from("accounts")
    .select("username, wallet_address")
    .eq("id", user.id)
    .single();

  if (!account) {
    redirect("/login");
  }

  // Service role for the read, same trust boundary as the rest of the app:
  // this is scoped to the account's own wallet_address in the query below.
  const supabase = supabaseServer();
  const { data: records } = await supabase
    .from("content_records")
    .select("id, title, content_type, media_subtype, content_hash, license_terms, onchain_registered, onchain_tx_hash, created_at")
    .eq("creator_wallet", account.wallet_address)
    .order("created_at", { ascending: false });

  return (
    <DashboardShell
      username={account.username}
      walletAddress={account.wallet_address}
      records={records ?? []}
    />
  );
}