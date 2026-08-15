import { createClient } from "@/lib/supabase/server";
import ConversationItem from "./conversation-item";
import NewChatLink from "./new-chat-link";
import SidebarFrame from "./sidebar-frame";
import SignOutButton from "./sign-out-button";

export default async function Sidebar() {
  const supabase = await createClient();
  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, title")
    .order("updated_at", { ascending: false });

  return (
    <SidebarFrame>
      <NewChatLink />

      <nav className="flex-1 space-y-0.5 overflow-y-auto">
        {conversations?.length === 0 && (
          <p className="px-3 py-2 text-xs text-muted">No conversations yet.</p>
        )}
        {conversations?.map((c) => (
          <ConversationItem key={c.id} id={c.id} title={c.title} />
        ))}
      </nav>

      <div className="mt-2 border-t border-border pt-2">
        <SignOutButton />
      </div>
    </SidebarFrame>
  );
}
