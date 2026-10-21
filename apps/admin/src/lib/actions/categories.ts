"use server";

import { rejectInvalidInput, runAdminAction } from "@/lib/actions/admin";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function sortOrder(formData: FormData) {
  const value = text(formData, "sort_order");
  const order = value ? Number(value) : 0;
  if (!Number.isSafeInteger(order) || order < 0) rejectInvalidInput();
  return order;
}

function validateIdentity(formData: FormData) {
  if (
    !text(formData, "name") ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(text(formData, "slug"))
  ) {
    rejectInvalidInput();
  }
}

export async function createCategory(formData: FormData) {
  return runAdminAction(
    "curriculum.manage",
    "/categories",
    "/categories",
    async (supabase) => {
      validateIdentity(formData);
      const { error } = await supabase.from("categories").insert({
        name: text(formData, "name"),
        slug: text(formData, "slug"),
        description: text(formData, "description") || null,
        kind: text(formData, "kind") || "resource",
        education_level_id: text(formData, "education_level_id") || null,
        parent_id: text(formData, "parent_id") || null,
        sort_order: sortOrder(formData),
      });
      if (error) throw error;
    },
  );
}

export async function deleteCategory(id: string) {
  return runAdminAction(
    "curriculum.manage",
    "/categories",
    "/categories",
    async (supabase) => {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
  );
}

export async function createEducationLevel(formData: FormData) {
  return runAdminAction(
    "curriculum.manage",
    "/categories",
    "/categories",
    async (supabase) => {
      validateIdentity(formData);
      const { error } = await supabase.from("education_levels").insert({
        name: text(formData, "name"),
        slug: text(formData, "slug"),
        description: text(formData, "description") || null,
        sort_order: sortOrder(formData),
      });
      if (error) throw error;
    },
  );
}

export async function createCourse(formData: FormData) {
  return runAdminAction(
    "curriculum.manage",
    "/categories",
    "/categories",
    async (supabase) => {
      validateIdentity(formData);
      const { error } = await supabase.from("courses").insert({
        name: text(formData, "name"),
        slug: text(formData, "slug"),
        education_level_id: text(formData, "education_level_id") || null,
        description: text(formData, "description") || null,
        sort_order: sortOrder(formData),
      });
      if (error) throw error;
    },
  );
}

export async function createSubject(formData: FormData) {
  return runAdminAction(
    "curriculum.manage",
    "/categories",
    "/categories",
    async (supabase) => {
      validateIdentity(formData);
      const { error } = await supabase.from("subjects").insert({
        name: text(formData, "name"),
        slug: text(formData, "slug"),
        education_level_id: text(formData, "education_level_id") || null,
        course_id: text(formData, "course_id") || null,
        description: text(formData, "description") || null,
        sort_order: sortOrder(formData),
      });
      if (error) throw error;
    },
  );
}
