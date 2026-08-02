import HeroBackground from "@/components/HeroBackground";
import { FeatureIcons } from "@/components/FeatureIcons";
import { SocialIcons } from "@/components/SocialIcons";
import SiteNav from "@/components/SiteNav";

const POINTS = [
  {
    icon: FeatureIcons.Licensing,
    title: "Enforceable terms, not a takedown risk",
    body: "Every piece of content on OriginLock carries explicit, on-chain licensing terms set by its creator. Training on it means training within terms both sides agreed to — not hoping nobody notices.",
  },
  {
    icon: FeatureIcons.AITrainingAccess,
    title: "Pay for what you actually use",
    body: "Licensing is per-use, not a bulk flat fee for a dataset you might only partially need. You pay when your training pipeline actually consumes a fingerprinted piece of content, tracked automatically.",
  },
  {
    icon: FeatureIcons.Ecosystem,
    title: "Verifiable provenance at scale",
    body: "Every licensed asset has a content hash and an on-chain usage record. That's a clean provenance trail you can point to — useful for internal compliance, and for answering questions about where training data came from.",
  },
  {
    icon: FeatureIcons.RoyaltyFlow,
    title: "No relationship management overhead",
    body: "You don't need to negotiate individually with thousands of creators. Terms are set up front by each creator and enforced automatically by the smart contract — licensing at the scale training actually happens at.",
  },
];

export default function ForAILabsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-hero-gradient">
      <HeroBackground className="pointer-events-none absolute inset-0 z-0 h-full w-full" />

      <div className="relative z-10">
        {/* Nav */}
           <SiteNav current="labs" />

        {/* Header */}
        <section className="mx-auto max-w-3xl px-6 pb-16 pt-12 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">For AI labs</p>
          <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
            Training data with clear terms and a verifiable paper trail.
          </h1>
          <p className="mt-5 text-base text-fog">
            Data provenance and licensing are becoming harder to ignore, not easier. OriginLock gives labs a
            way to source training data that comes with explicit, enforceable, on-chain licensing terms set
            directly by the people who made it — instead of ambiguous scraping and after-the-fact disputes.
          </p>
        </section>

        {/* Points */}
        <section className="border-t border-white/5 bg-ink/60 px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-10 sm:grid-cols-2">
              {POINTS.map((point) => (
                <div key={point.title} className="border-t border-white/10 pt-5">
                  <point.icon className="h-10 w-10" />
                  <h3 className="mt-3 font-display text-lg font-medium text-white">{point.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fog">{point.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How access works */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">How access works</p>
            <h2 className="mt-3 font-display text-2xl font-medium text-white sm:text-3xl">
              Licensing built into your training pipeline, not bolted on after.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-fog">
              Content on OriginLock is fingerprinted and priced by its creator ahead of time. When your
              pipeline trains on a fingerprinted asset, the match is detected and logged automatically, and
              the royalty payment is triggered through the smart contract — no manual invoicing on either
              side. For the full technical breakdown of fingerprinting and on-chain matching, see{" "}
              <a href="/how-it-works" className="text-signal underline">how it works</a>.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-fog">
              Reach out directly for early access to bulk licensing and API integration.
            </p>
            
            <a  href="mailto:labs@originlock.xyz"
              className="mt-8 inline-block rounded-full bg-signal px-6 py-3 text-sm font-semibold text-white transition hover:bg-signal/90"
            >
              Contact us
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