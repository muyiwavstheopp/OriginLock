import { redirect } from "next/navigation";
import { supabaseSession } from "@/lib/supabaseSession";
import UploadForm from "@/components/UploadForm";

export default async function UploadPage() {
  const supabase = supabaseSession();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: account } = await supabase
    .from("accounts")
    .select("username, wallet_address")
    .eq("id", user.id)
    .single();

  if (!account) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-hero-gradient px-6 py-16">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <a href="/" className="mb-10 flex items-center gap-2 self-start">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="1" y="1" width="20" height="20" rx="6" stroke="#4F7CFF" strokeWidth="1.6" />
            <path d="M7 11a4 4 0 118 0 4 4 0 01-8 0z" stroke="#FFB84D" strokeWidth="1.6" />
          </svg>
          <span className="font-display text-[15px] font-medium tracking-tight text-white">
            OriginLock
          </span>
        </a>

        <div className="mb-2 w-full max-w-2xl text-left">
          <a href="/dashboard" className="text-xs text-fog/70 underline hover:text-white">
            ← Back to dashboard
          </a>
        </div>

        <h1 className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
          Register your work
        </h1>
        <p className="mt-3 max-w-md text-sm text-fog">
          Upload a file, we&apos;ll classify and fingerprint it, encrypt it, and
          record it in the registry with the terms you set below.
        </p>

        <div className="mt-10 flex w-full justify-center">
          <UploadForm accountWalletAddress={account.wallet_address} />
        </div>
      </div>
    </main>
  );
}