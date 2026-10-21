"use server";

import { runAdminAction } from "@/lib/actions/admin";

export async function createAnnouncement(formData: FormData) {
  return runAdminAction(
    "announcements.manage",
    "/announcements",
    "/announcements",
    async (supabase, user) => {
      const status = String(formData.get("status") ?? "draft");
      const payload: Record<string, unknown> = {
        title: String(formData.get("title") ?? "").trim(),
        body: String(formData.get("body") ?? "").trim(),
        target_audience: String(formData.get("target_audience") ?? "all"),
        status,
        created_by: user.id,
      };
      if (status === "published") {
        payload.published_at = new Date().toISOString();
      }

      const { error } = await supabase.from("announcements").insert(payload);
      if (error) throw error;
    },
  );
}

export async function deleteAnnouncement(id: string) {
  return runAdminAction(
    "announcements.manage",
    "/announcements",
    "/announcements",
    async (supabase) => {
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
  );
}
