import LoginForm from "@/components/LoginForm";
import { Logo } from "@/components/OriginLockLogo";
import HeroBackground from "@/components/HeroBackground";

export default function LoginPage() {
  return (
   <main className="relative min-h-screen overflow-hidden bg-hero-gradient px-6 py-16">
      <HeroBackground className="pointer-events-none absolute inset-0 z-0 h-full w-full" />
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
        <a href="/" className="mb-10 flex items-center self-start">
          <Logo className="h-6" />
        </a>

        <h1 className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
          Log in
        </h1>
        <p className="mt-3 max-w-md text-sm text-fog">
          Username and password only — no wallet needed to log in.
        </p>

        <div className="mt-10 flex w-full justify-center">
          <LoginForm />
        </div>

        <p className="mt-6 text-sm text-fog/70">
          Don&apos;t have an account? <a href="/signup" className="text-signal underline">Sign up</a>
        </p>
      </div>
    </main>
  );
}