"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signOutAdmin() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Admin sign-out failed");
    redirect("/dashboard?action=error&reason=logout");
  }
  redirect("/login");
}
