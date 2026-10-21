"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSetting(key: string, value: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  let parsed: any;
  try { parsed = JSON.parse(value); } catch { parsed = value; }
  const { error } = await supabase.from("app_settings").upsert({ key, value: parsed, updated_by: user.id });
  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}
