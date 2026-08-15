import { createClient } from "@/lib/supabase/server";
import { gemini, MODEL } from "@/lib/gemini/client";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";

const MOCK_REPLY =
  "Ini balasan mock (MOCK_CLAUDE=true) — belum benar-benar memanggil Gemini API. " +
  "Set MOCK_CLAUDE=false di .env.local setelah GEMINI_API_KEY terisi untuk pakai respons asli.";

interface ChatRequestBody {
  conversationId: string | null;
  message: string;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { conversationId, message }: ChatRequestBody = await request.json();

  if (!message || !message.trim()) {
    return new Response("Message is required", { status: 400 });
  }

  let activeConversationId = conversationId;

  if (!activeConversationId) {
    const title = message.trim().slice(0, 40);
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .insert({ user_id: user.id, title })
      .select("id")
      .single();

    if (convError || !conversation) {
      return new Response("Failed to create conversation", { status: 500 });
    }
    activeConversationId = conversation.id;
  }

  const { error: insertError } = await supabase.from("messages").insert({
    conversation_id: activeConversationId,
    role: "user",
    content: message,
  });

  if (insertError) {
    return new Response("Failed to save message", { status: 500 });
  }

  const { data: priorMessages, error: historyError } = await supabase
    .from("messages")
    .select("role, content")
    .eq("conversation_id", activeConversationId)
    .order("created_at", { ascending: true });

  if (historyError || !priorMessages) {
    return new Response("Failed to load conversation history", { status: 500 });
  }

  const encoder = new TextEncoder();

  const body = new ReadableStream({
    async start(controller) {
      let assistantText = "";
      try {
        if (process.env.MOCK_CLAUDE === "true") {
          for (const word of MOCK_REPLY.split(" ")) {
            await new Promise((r) => setTimeout(r, 25));
            assistantText += word + " ";
            controller.enqueue(encoder.encode(word + " "));
          }
        } else {
          const generate = () =>
            gemini.models.generateContent({
              model: MODEL,
              contents: priorMessages.map((m) => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.content }],
              })),
              config: {
                systemInstruction: SYSTEM_PROMPT,
                thinkingConfig: { thinkingBudget: 0 },
              },
            });

          // Gemini's free tier returns 503 under load, sometimes mid-response.
          // Generate the full reply first (retrying a couple of times) so a
          // failure never leaves a half-streamed message in the client, then
          // flush it to the client in chunks for a streaming feel.
          const maxRetries = 2;
          let fullText = "";
          for (let attempt = 0; ; attempt++) {
            try {
              const response = await generate();
              fullText = response.text ?? "";
              break;
            } catch (err) {
              const status = (err as { status?: number }).status;
              if (status !== 503 || attempt >= maxRetries) throw err;
              await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
            }
          }

          for (const word of fullText.split(" ")) {
            assistantText += word + " ";
            controller.enqueue(encoder.encode(word + " "));
          }
        }

        await supabase.from("messages").insert({
          conversation_id: activeConversationId,
          role: "assistant",
          content: assistantText,
        });
        await supabase
          .from("conversations")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", activeConversationId);

        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "x-conversation-id": activeConversationId!,
    },
  });
}
