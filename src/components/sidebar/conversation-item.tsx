"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "./sidebar-context";

export default function ConversationItem({ id, title }: { id: string; title: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { close } = useSidebar();

  const isActive = pathname === `/chat/${id}`;

  useEffect(() => {
    if (isRenaming) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isRenaming]);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return;

    setIsDeleting(true);
    const res = await fetch(`/api/conversations/${id}`, { method: "DELETE" });
    setIsDeleting(false);

    if (!res.ok) return;

    if (isActive) router.push("/chat");
    router.refresh();
  }

  function startRenaming(e: React.MouseEvent) {
    e.preventDefault();
    setDraftTitle(title);
    setIsRenaming(true);
  }

  async function commitRename() {
    setIsRenaming(false);
    const trimmed = draftTitle.trim();
    if (!trimmed || trimmed === title) return;

    const res = await fetch(`/api/conversations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: trimmed }),
    });
    if (res.ok) router.refresh();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") inputRef.current?.blur();
    if (e.key === "Escape") {
      setDraftTitle(title);
      setIsRenaming(false);
    }
  }

  if (isRenaming) {
    return (
      <input
        ref={inputRef}
        value={draftTitle}
        onChange={(e) => setDraftTitle(e.target.value)}
        onBlur={commitRename}
        onKeyDown={handleKeyDown}
        className="w-full rounded-md border border-accent bg-transparent px-3 py-2 text-sm outline-none"
      />
    );
  }

  return (
    <div
      className={`group flex items-center rounded-md ${
        isActive ? "bg-black/5 dark:bg-white/10" : "hover:bg-black/5 dark:hover:bg-white/10"
      }`}
    >
      <Link
        href={`/chat/${id}`}
        onClick={close}
        onDoubleClick={startRenaming}
        className="block flex-1 truncate px-3 py-2 text-sm"
      >
        {title}
      </Link>
      <button
        onClick={startRenaming}
        aria-label={`Rename "${title}"`}
        className="rounded px-1.5 py-1 text-muted opacity-0 hover:bg-black/10 hover:text-foreground group-hover:opacity-100 dark:hover:bg-white/10"
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path
            d="M8.5 1.5l3 3-7 7-3.5.5.5-3.5 7-7z"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        aria-label={`Delete "${title}"`}
        className="mr-1 rounded px-1.5 py-1 text-muted opacity-0 hover:bg-black/10 hover:text-red-500 group-hover:opacity-100 disabled:opacity-50 dark:hover:bg-white/10"
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path
            d="M2.5 3.5h8M5 3.5V2h3v1.5M3.5 3.5v8h6v-8"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
