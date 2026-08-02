import SignupForm from "@/components/SignupForm";
import { Logo } from "@/components/OriginLockLogo";
import HeroBackground from "@/components/HeroBackground";

export default function SignupPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-hero-gradient px-6 py-16">
      <HeroBackground className="pointer-events-none absolute inset-0 z-0 h-full w-full" />
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
        <a href="/" className="mb-10 flex items-center self-start">
          <Logo className="h-6" />
        </a>

        <h1 className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
          Create your account
        </h1>
        <p className="mt-3 max-w-md text-sm text-fog">
          Connect your wallet once to prove ownership, then set a username and password.
          You won&apos;t need the wallet again to log in.
        </p>

        <div className="mt-10 flex w-full justify-center">
          <SignupForm />
        </div>

        <p className="mt-6 text-sm text-fog/70">
          Already have an account? <a href="/login" className="text-signal underline">Log in</a>
        </p>
      </div>
    </main>
  );
}