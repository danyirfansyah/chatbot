"use client";

import Link from "next/link";
import { useSidebar } from "./sidebar-context";

export default function NewChatLink() {
  const { close } = useSidebar();

  return (
    <Link
      href="/chat"
      onClick={close}
      className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2.5 text-sm font-medium text-accent-foreground transition hover:opacity-90"
    >
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M7.5 2v11M2 7.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      New chat
    </Link>
  );
}
