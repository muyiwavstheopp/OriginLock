import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Session-aware client — reads the logged-in user's cookies so routes and
// server components can act "as them" (subject to RLS). This is NOT the
// admin client: use lib/supabaseServer.ts (service role key) for
// signup/account creation, which must bypass RLS.
export function supabaseSession() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component render (e.g. app/upload/page.tsx)
            // where cookies can't be written. Safe to ignore as long as a
            // Route Handler or middleware refreshes the session elsewhere.
          }
        },
      },
    }
  );
}