"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const payload = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || null,
    kind: formData.get("kind") || "resource",
    education_level_id: formData.get("education_level_id") || null,
    parent_id: formData.get("parent_id") || null,
    sort_order: Number(formData.get("sort_order") || 0),
  };
  const { error } = await supabase.from("categories").insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/categories");
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/categories");
}

export async function createEducationLevel(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("education_levels").insert({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || null,
    sort_order: Number(formData.get("sort_order") || 0),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/categories");
}

export async function createCourse(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("courses").insert({
    name: formData.get("name"),
    slug: formData.get("slug"),
    education_level_id: formData.get("education_level_id") || null,
    description: formData.get("description") || null,
    sort_order: Number(formData.get("sort_order") || 0),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/categories");
}

export async function createSubject(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("subjects").insert({
    name: formData.get("name"),
    slug: formData.get("slug"),
    education_level_id: formData.get("education_level_id") || null,
    course_id: formData.get("course_id") || null,
    description: formData.get("description") || null,
    sort_order: Number(formData.get("sort_order") || 0),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/categories");
}
