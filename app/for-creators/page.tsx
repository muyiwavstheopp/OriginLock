import HeroBackground from "@/components/HeroBackground";
import { FeatureIcons } from "@/components/FeatureIcons";
import { SocialIcons } from "@/components/SocialIcons";
import SiteNav from "@/components/SiteNav";

const POINTS = [
  {
    icon: FeatureIcons.Provenance,
    title: "Register anything AI labs train on",
    body: "Images, audio, manuscripts, datasets, even codebases. If it's the kind of thing that could end up in a training set, you can fingerprint it and set terms on it.",
  },
  {
    icon: FeatureIcons.Licensing,
    title: "You set the price, not a platform",
    body: "Every piece you register carries its own price-per-use, in USDC. You can change it any time from your dashboard — no approval process, no negotiation with a middleman.",
  },
  {
    icon: FeatureIcons.RoyaltyFlow,
    title: "Paid every time, not just once",
    body: "Traditional stock-content deals pay a flat fee up front and that's it, no matter how many times your work gets reused. OriginLock pays per verified use — the more your work actually gets trained on, the more you earn.",
  },
  {
    icon: FeatureIcons.Ecosystem,
    title: "On-chain, so it's actually enforceable",
    body: "Your terms and usage history live on Ethereum. That means there's a public, tamper-evident record of what was licensed and what was owed — not a private ledger a company could quietly adjust.",
  },
];

export default function ForCreatorsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-hero-gradient">
      <HeroBackground className="pointer-events-none absolute inset-0 z-0 h-full w-full" />

      <div className="relative z-10">
        {/* Nav */}
       <SiteNav current="creators" />

        {/* Header */}
        <section className="mx-auto max-w-3xl px-6 pb-16 pt-12 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">For creators</p>
          <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
            Your work is already training AI models. Get paid for it.
          </h1>
          <p className="mt-5 text-base text-fog">
            AI labs need real, high-quality data to train on — your photographs, your writing, your music,
            your code. Right now most of that happens with no consent and no payment. OriginLock gives you
            a way to set terms on your work and get paid automatically whenever it's actually used for training.
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

        {/* Getting started */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">Getting started</p>
            <h2 className="mt-3 font-display text-2xl font-medium text-white sm:text-3xl">
              Three steps, from your work to your first royalty payment.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-fog">
              Connect your wallet once to prove ownership of your account, upload your first piece of content,
              and set your price per use. That's it — from there, OriginLock handles fingerprinting, matching,
              and payment automatically. Read the full technical breakdown on the{" "}
              <a href="/how-it-works" className="text-signal underline">how it works</a> page.
            </p>
            
            <a  href="/signup"
              className="mt-8 inline-block rounded-full bg-signal px-6 py-3 text-sm font-semibold text-white transition hover:bg-signal/90"
            >
              Register your first piece
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