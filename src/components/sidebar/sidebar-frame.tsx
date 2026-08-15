"use client";

import type { ReactNode } from "react";
import { useSidebar } from "./sidebar-context";

export default function SidebarFrame({ children }: { children: ReactNode }) {
  const { isOpen, close } = useSidebar();

  return (
    <>
      {isOpen && (
        <div
          onClick={close}
          className="fixed inset-0 z-20 bg-black/30 md:hidden"
          aria-hidden
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-72 -translate-x-full flex-col border-r border-border bg-surface p-3 transition-transform duration-200 md:static md:z-auto md:w-64 md:translate-x-0 ${
          isOpen ? "translate-x-0" : ""
        }`}
      >
        {children}
      </aside>
    </>
  );
}
