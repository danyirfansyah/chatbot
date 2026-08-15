"use client";

import { useSidebar } from "./sidebar-context";

export default function MobileMenuButton() {
  const { toggle } = useSidebar();

  return (
    <button
      onClick={toggle}
      aria-label="Toggle menu"
      className="flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-black/5 md:hidden dark:hover:bg-white/10"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M2 4.5h14M2 9h14M2 13.5h14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
