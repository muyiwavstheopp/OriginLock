export default function SecurityPanel({ walletAddress }: { walletAddress: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-ink/60 p-6">
      <h2 className="font-display text-base font-medium text-white">Registered wallet</h2>
      <p className="mt-1 text-xs text-fog/60">
        This is the wallet you proved ownership of at signup. It&apos;s permanently tied to
        your account and can&apos;t be changed here.
      </p>
      <div className="mt-4 flex items-center justify-between rounded-lg border border-white/10 px-3 py-2">
        <span className="font-mono text-sm text-white">{walletAddress}</span>
        <span className="h-2 w-2 rounded-full bg-signal" />
      </div>
      <p className="mt-4 text-xs text-fog/50">
        To register content on-chain, connect this same wallet in MetaMask from the
        registration page — connecting a different wallet there will be blocked.
      </p>
    </div>
  );
}