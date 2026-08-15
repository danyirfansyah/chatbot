import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChatPanel from "@/components/chat/chat-panel";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // RLS scopes this to the current user — a nonexistent or someone-else's
  // conversation id simply returns no row here.
  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, title")
    .eq("id", id)
    .single();

  if (!conversation) {
    notFound();
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("id, role, content, created_at")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true });

  return (
    <ChatPanel
      conversationId={id}
      title={conversation.title}
      initialMessages={messages ?? []}
    />
  );
}
