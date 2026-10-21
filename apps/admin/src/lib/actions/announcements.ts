"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createAnnouncement(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const payload: any = {
    title: formData.get("title"),
    body: formData.get("body"),
    target_audience: formData.get("target_audience") || "all",
    status: formData.get("status") || "draft",
    created_by: user.id,
  };
  if (payload.status === "published") payload.published_at = new Date().toISOString();
  const { error } = await supabase.from("announcements").insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/announcements");
}

export async function deleteAnnouncement(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/announcements");
}
