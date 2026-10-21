"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createResource(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const payload: any = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    resource_type: formData.get("resource_type"),
    status: formData.get("status"),
    featured: formData.get("featured") === "on",
    education_level_id: formData.get("education_level_id") || null,
    category_id: formData.get("category_id") || null,
    course_id: formData.get("course_id") || null,
    semester_id: formData.get("semester_id") || null,
    subject_id: formData.get("subject_id") || null,
    topic_id: formData.get("topic_id") || null,
    language: formData.get("language") || "en",
    thumbnail_url: formData.get("thumbnail_url") || null,
    file_url: formData.get("file_url") || null,
    external_url: formData.get("external_url") || null,
    creator_id: user.id,
    last_editor_id: user.id,
  };
  if (payload.status === "published") payload.published_at = new Date().toISOString();
  const { error } = await supabase.from("resources").insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/resources");
  return { ok: true };
}

export async function updateResource(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const payload: any = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    resource_type: formData.get("resource_type"),
    status: formData.get("status"),
    featured: formData.get("featured") === "on",
    education_level_id: formData.get("education_level_id") || null,
    category_id: formData.get("category_id") || null,
    course_id: formData.get("course_id") || null,
    semester_id: formData.get("semester_id") || null,
    subject_id: formData.get("subject_id") || null,
    topic_id: formData.get("topic_id") || null,
    language: formData.get("language") || "en",
    thumbnail_url: formData.get("thumbnail_url") || null,
    file_url: formData.get("file_url") || null,
    external_url: formData.get("external_url") || null,
    last_editor_id: user.id,
  };
  if (payload.status === "published") {
    const { data: existing } = await supabase.from("resources").select("published_at").eq("id", id).single();
    if (!existing?.published_at) payload.published_at = new Date().toISOString();
  }
  const { error } = await supabase.from("resources").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/resources");
  revalidatePath(`/resources/${id}`);
  return { ok: true };
}

export async function deleteResource(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("resources").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/resources");
}

export async function togglePublish(id: string, publish: boolean) {
  const supabase = await createClient();
  const update: any = { status: publish ? "published" : "unpublished" };
  if (publish) update.published_at = new Date().toISOString();
  const { error } = await supabase.from("resources").update(update).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/resources");
}
