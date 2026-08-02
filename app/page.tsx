import FingerprintToken from "@/components/FingerprintToken";
import HeroBackground from "@/components/HeroBackground";
import { FeatureIcons } from "@/components/FeatureIcons";
import { SocialIcons } from "@/components/SocialIcons";
import SiteNav from "@/components/SiteNav";

const STEPS = [
  {
    n: "01",
    icon: FeatureIcons.Licensing,
    title: "Tag your work",
    body: "Upload an image, track, manuscript, or codebase. OriginLock fingerprints it and sets your licensing terms — what AI labs can do with it, and what they owe you per use.",
  },
  {
    n: "02",
    icon: FeatureIcons.AITrainingAccess,
    title: "It gets matched",
    body: "When a model is trained or fine-tuned on data that matches your fingerprint, OriginLock detects the match and logs it to a tamper-evident on-chain ledger.",
  },
  {
    n: "03",
    icon: FeatureIcons.RoyaltyFlow,
    title: "You get paid",
    body: "Every verified use triggers a royalty payment automatically — no invoices, no chasing, no platform sitting in the middle deciding what you're owed.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-hero-gradient">
      {/* Nav */}
      <SiteNav current="home" />

      {/* Hero */}
      <section className="relative flex flex-col items-center overflow-hidden px-6 pb-28 pt-16 text-center">
        <HeroBackground className="pointer-events-none absolute inset-0 z-0 h-full w-full" />
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
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
                <step.icon className="h-10 w-10" />
                <span className="mt-4 block font-mono text-sm text-seal">{step.n}</span>
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
        <div className="mb-4 flex items-center justify-center gap-4">
          <a href="https://x.com/originlock" target="_blank" rel="noopener noreferrer">
            <SocialIcons.X className="h-4 w-4 text-fog/50 transition hover:text-white" />
          </a>
          <a href="https://linkedin.com/company/originlock" target="_blank" rel="noopener noreferrer">
            <SocialIcons.LinkedIn className="h-4 w-4 text-fog/50 transition hover:text-white" />
          </a>
          <a href="https://github.com/muyiwavstheopp" target="_blank" rel="noopener noreferrer">
            <SocialIcons.GitHub className="h-4 w-4 text-fog/50 transition hover:text-white" />
          </a>
        </div>
        <p className="font-mono text-xs text-fog/60">
          OriginLock — a licensing and royalty ledger for AI training data.
        </p>
      </footer>
    </main>
  );
}