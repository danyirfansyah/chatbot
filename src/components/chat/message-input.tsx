"use client";

import { useState, type FormEvent } from "react";

export default function MessageInput({
  onSend,
  disabled,
}: {
  onSend: (message: string) => void;
  disabled: boolean;
}) {
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-full border border-border bg-surface px-2 py-1.5 shadow-sm">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Message..."
        disabled={disabled}
        className="flex-1 bg-transparent px-3 py-1.5 text-sm outline-none placeholder:text-muted disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition disabled:opacity-40"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M2 12L12 2M12 2H5M12 2V9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
}
