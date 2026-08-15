"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-muted hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M5.5 12.5H2.5a1 1 0 01-1-1v-9a1 1 0 011-1h3M9.5 9.5L12.5 6.5m0 0L9.5 3.5M12.5 6.5h-8"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Sign out
    </button>
  );
}
