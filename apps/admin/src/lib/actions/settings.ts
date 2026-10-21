"use server";

import { runAdminAction } from "@/lib/actions/admin";

export async function updateSetting(key: string, value: string) {
  return runAdminAction(
    "settings.manage",
    "/settings",
    "/settings",
    async (supabase, user) => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(value);
      } catch {
        parsed = value;
      }

      const { error } = await supabase
        .from("app_settings")
        .upsert({ key, value: parsed, updated_by: user.id });
      if (error) throw error;
    },
  );
}
