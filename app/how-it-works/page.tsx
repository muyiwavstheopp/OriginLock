import HeroBackground from "@/components/HeroBackground";
import { FeatureIcons } from "@/components/FeatureIcons";
import { SocialIcons } from "@/components/SocialIcons";
import SiteNav from "@/components/SiteNav";

const STAGES = [
  {
    n: "01",
    icon: FeatureIcons.Licensing,
    title: "Tag your work",
    body: "Upload an image, audio track, manuscript, or codebase. OriginLock generates a cryptographic fingerprint — a unique hash derived from the content itself — and stores it alongside the licensing terms you set: what AI labs are allowed to do with it, and what they owe you per use.",
  },
  {
    n: "02",
    icon: FeatureIcons.AITrainingAccess,
    title: "It gets matched",
    body: "When a model is trained or fine-tuned on data that matches your fingerprint, OriginLock's classification pipeline detects the match. The detection event — not the content itself — is what gets logged to a tamper-evident on-chain ledger, so there's a verifiable record without exposing your original work.",
  },
  {
    n: "03",
    icon: FeatureIcons.RoyaltyFlow,
    title: "You get paid",
    body: "Every verified use triggers a royalty payment automatically through the smart contract, in USDC, straight to your wallet. No invoices, no chasing payment, no platform sitting in the middle deciding what you're owed — the terms you set are the terms that get enforced.",
  },
];

const UNDER_THE_HOOD = [
  {
    icon: FeatureIcons.Provenance,
    title: "Content fingerprinting",
    body: "Each registered piece gets a content hash — a one-way fingerprint that can confirm a match without ever exposing the original file to anyone doing the matching.",
  },
  {
    icon: FeatureIcons.Ecosystem,
    title: "On-chain enforcement",
    body: "License terms and usage records live on Ethereum, not in a database a platform can quietly edit. What's on-chain is what's enforceable.",
  },
  {
    icon: FeatureIcons.UsageTracking,
    title: "Usage-based, not one-time",
    body: "Traditional licensing pays once. OriginLock's model pays per verified use — so if your work trains ten different models, that's ten royalty events, not one flat fee.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-hero-gradient">
      <HeroBackground className="pointer-events-none absolute inset-0 z-0 h-full w-full" />

      <div className="relative z-10">
        {/* Nav */}
        <SiteNav current="how" />

        {/* Header */}
        <section className="mx-auto max-w-3xl px-6 pb-16 pt-12 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">How it works</p>
          <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
            From your work to a verified, paid license — end to end.
          </h1>
          <p className="mt-5 text-base text-fog">
            OriginLock exists to close a gap: AI labs need training data, creators produce it, and until now
            there's been no enforceable, automatic way to connect the two on fair terms. Here's exactly how
            that connection works.
          </p>
        </section>

        {/* Stages */}
        <section className="border-t border-white/5 bg-ink/60 px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-10 sm:grid-cols-3">
              {STAGES.map((stage) => (
                <div key={stage.n} className="border-t border-white/10 pt-5">
                  <stage.icon className="h-10 w-10" />
                  <span className="mt-4 block font-mono text-sm text-seal">{stage.n}</span>
                  <h3 className="mt-3 font-display text-lg font-medium text-white">{stage.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fog">{stage.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Under the hood */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">Under the hood</p>
            <h2 className="mt-3 max-w-xl font-display text-2xl font-medium text-white sm:text-3xl">
              The mechanics that make this enforceable, not just promised.
            </h2>
            <div className="mt-14 grid gap-10 sm:grid-cols-3">
              {UNDER_THE_HOOD.map((item) => (
                <div key={item.title} className="border-t border-white/10 pt-5">
                  <item.icon className="h-10 w-10" />
                  <h3 className="mt-3 font-display text-lg font-medium text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fog">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/5 bg-ink/60 px-6 py-16 text-center">
          <h2 className="font-display text-2xl font-medium text-white sm:text-3xl">
            Ready to see it from your side?
          </h2>
          <div className="mt-6 flex items-center justify-center gap-4">
            
            <a  href="/for-creators"
              className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/90 transition hover:border-signal hover:text-white"
            >
              I'm a creator
            </a>
            
            <a  href="/for-ai-labs"
              className="rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-signal/90"
            >
              I'm an AI lab
            </a>
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
      </div>
    </main>
  );
}