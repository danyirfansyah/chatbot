import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { title } = (await request.json()) as { title?: string };
  const trimmed = title?.trim();

  if (!trimmed) {
    return new Response("Title is required", { status: 400 });
  }

  const { data, error } = await supabase
    .from("conversations")
    .update({ title: trimmed })
    .eq("id", id)
    .select("id");

  if (error) {
    return new Response("Failed to rename conversation", { status: 500 });
  }

  if (!data || data.length === 0) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(null, { status: 204 });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data, error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) {
    return new Response("Failed to delete conversation", { status: 500 });
  }

  if (!data || data.length === 0) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(null, { status: 204 });
}
