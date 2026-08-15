import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/sidebar/sidebar";
import { SidebarProvider } from "@/components/sidebar/sidebar-context";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Authoritative auth check — proxy.ts only refreshes the session cookie.
  if (!user) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-hidden">{children}</main>
      </div>
    </SidebarProvider>
  );
}
