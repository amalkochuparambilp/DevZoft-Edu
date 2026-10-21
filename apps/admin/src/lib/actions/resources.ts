"use server";

import { rejectInvalidInput, runAdminAction } from "@/lib/actions/admin";

const resourceTypes = new Set([
  "pdf",
  "notes",
  "ebook",
  "video",
  "audio",
  "article",
  "worksheet",
  "question_paper",
  "external_link",
]);
const resourceStatuses = new Set([
  "draft",
  "in_review",
  "published",
  "unpublished",
  "archived",
]);

function resourcePayload(formData: FormData, userId: string, creating: boolean) {
  const status = String(formData.get("status") ?? "draft");
  const payload: Record<string, unknown> = {
    title: String(formData.get("title") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    resource_type: String(formData.get("resource_type") ?? "article"),
    status,
    featured: formData.get("featured") === "on",
    education_level_id: String(formData.get("education_level_id") ?? "") || null,
    category_id: String(formData.get("category_id") ?? "") || null,
    course_id: String(formData.get("course_id") ?? "") || null,
    semester_id: String(formData.get("semester_id") ?? "") || null,
    subject_id: String(formData.get("subject_id") ?? "") || null,
    topic_id: String(formData.get("topic_id") ?? "") || null,
    language: String(formData.get("language") ?? "").trim() || "en",
    thumbnail_url: String(formData.get("thumbnail_url") ?? "").trim() || null,
    file_url: String(formData.get("file_url") ?? "").trim() || null,
    external_url: String(formData.get("external_url") ?? "").trim() || null,
    last_editor_id: userId,
  };

  if (creating) payload.creator_id = userId;
  if (status === "published" && creating) {
    payload.published_at = new Date().toISOString();
  }

  return payload;
}

export async function createResource(formData: FormData) {
  return runAdminAction(
    "content.create",
    "/resources/new",
    "/resources",
    async (supabase, user) => {
      const payload = resourcePayload(formData, user.id, true);
      if (
        !String(payload.title ?? "").trim() ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(payload.slug ?? "")) ||
        !resourceTypes.has(String(payload.resource_type)) ||
        !resourceStatuses.has(String(payload.status))
      ) {
        rejectInvalidInput();
      }
      const { error } = await supabase
        .from("resources")
        .insert(payload);
      if (error) throw error;
    },
  );
}

export async function updateResource(id: string, formData: FormData) {
  return runAdminAction(
    "content.edit",
    `/resources/${id}`,
    "/resources",
    async (supabase, user) => {
      const payload = resourcePayload(formData, user.id, false);
      if (
        !String(payload.title ?? "").trim() ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(payload.slug ?? "")) ||
        !resourceTypes.has(String(payload.resource_type)) ||
        !resourceStatuses.has(String(payload.status))
      ) {
        rejectInvalidInput();
      }
      if (payload.status === "published") {
        const { data: existing, error: readError } = await supabase
          .from("resources")
          .select("published_at")
          .eq("id", id)
          .single();
        if (readError) throw readError;
        if (!existing.published_at) {
          payload.published_at = new Date().toISOString();
        }
      }

      const { error } = await supabase
        .from("resources")
        .update(payload)
        .eq("id", id);
      if (error) throw error;
    },
  );
}

export async function deleteResource(id: string) {
  return runAdminAction(
    "content.delete",
    "/resources",
    "/resources",
    async (supabase) => {
      const { error } = await supabase.from("resources").delete().eq("id", id);
      if (error) throw error;
    },
  );
}

export async function togglePublish(id: string, publish: boolean) {
  return runAdminAction(
    "content.edit",
    "/resources",
    "/resources",
    async (supabase) => {
      const update: Record<string, string> = {
        status: publish ? "published" : "unpublished",
      };
      if (publish) update.published_at = new Date().toISOString();
      const { error } = await supabase
        .from("resources")
        .update(update)
        .eq("id", id);
      if (error) throw error;
    },
  );
}
