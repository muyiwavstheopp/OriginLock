import UploadForm from "@/components/UploadForm";

export default function UploadPage() {
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

        <h1 className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
          Register your work
        </h1>
        <p className="mt-3 max-w-md text-sm text-fog">
          Upload a file, we&apos;ll classify and fingerprint it, encrypt it, and
          record it in the registry with the terms you set below.
        </p>

        <div className="mt-10 flex w-full justify-center">
          <UploadForm />
        </div>
      </div>
    </main>
  );
}