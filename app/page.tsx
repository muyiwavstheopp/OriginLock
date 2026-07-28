import FingerprintToken from "@/components/FingerprintToken";
import WaitlistForm from "@/components/WaitlistForm";

const STEPS = [
  {
    n: "01",
    title: "Tag your work",
    body: "Upload an image, track, manuscript, or codebase. OriginLock fingerprints it and sets your licensing terms — what AI labs can do with it, and what they owe you per use.",
  },
  {
    n: "02",
    title: "It gets matched",
    body: "When a model is trained or fine-tuned on data that matches your fingerprint, OriginLock detects the match and logs it to a tamper-evident on-chain ledger.",
  },
  {
    n: "03",
    title: "You get paid",
    body: "Every verified use triggers a royalty payment automatically — no invoices, no chasing, no platform sitting in the middle deciding what you're owed.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-hero-gradient">
      {/* Nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7">
        <div className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="1" y="1" width="20" height="20" rx="6" stroke="#4F7CFF" strokeWidth="1.6" />
            <path d="M7 11a4 4 0 118 0 4 4 0 01-8 0z" stroke="#FFB84D" strokeWidth="1.6" />
          </svg>
          <span className="font-display text-[15px] font-medium tracking-tight text-white">
            OriginLock
          </span>
        </div>
        <div className="hidden items-center gap-8 text-sm text-fog md:flex">
          <a href="#how" className="transition hover:text-white">How it works</a>
          <a href="#creators" className="transition hover:text-white">For creators</a>
          <a href="#labs" className="transition hover:text-white">For AI labs</a>
        </div>
        
        <a
          href="#waitlist"
          className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/90 transition hover:border-signal hover:text-white"
        >
          Join waitlist
        </a>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto flex max-w-4xl flex-col items-center px-6 pb-28 pt-16 text-center">
        {/* floating fingerprint tokens */}
        <div className="relative mb-16 h-32 w-full max-w-lg pointer-events-none">
          <FingerprintToken kind="document" size={56} className="float-slow absolute left-0 top-4" />
          <FingerprintToken kind="image" size={72} className="float-med absolute left-[26%] top-0" />
          <FingerprintToken kind="audio" size={64} className="float-fast absolute right-[26%] top-2" />
          <FingerprintToken kind="code" size={52} className="float-med absolute right-4 top-0" />
        </div>

        <h1 className="font-display text-4xl font-medium leading-tight tracking-tight text-white sm:text-5xl">
          Every use, traced.
          <br />
          Every creator, paid.
        </h1>
        <p className="mt-5 max-w-lg text-balance text-base text-fog">
          OriginLock lets creators license their work for AI training on
          enforceable, on-chain terms — and get paid every time it's actually
          used, not just once.
        </p>

        <div id="waitlist" className="mt-9 flex w-full flex-col items-center">
          <WaitlistForm />
          <p className="mt-3 font-mono text-xs text-fog/70">
            no wallet required to join the waitlist
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-white/5 bg-ink/60 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
            How it works
          </p>
          <h2 className="mt-3 max-w-xl font-display text-2xl font-medium text-white sm:text-3xl">
            Three steps between your work and getting paid for it.
          </h2>

          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="border-t border-white/10 pt-5">
                <span className="font-mono text-sm text-seal">{step.n}</span>
                <h3 className="mt-3 font-display text-lg font-medium text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fog">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 px-6 py-10 text-center">
        <p className="font-mono text-xs text-fog/60">
          OriginLock — a licensing and royalty ledger for AI training data.
        </p>
      </footer>
    </main>
  );
}