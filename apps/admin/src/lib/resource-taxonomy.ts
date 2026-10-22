import { createClient } from "@/lib/supabase/server";

export const RESOURCE_TYPES = [
  "pdf",
  "notes",
  "ebook",
  "video",
  "audio",
  "article",
  "worksheet",
  "question_paper",
  "external_link",
] as const;

export const RESOURCE_STATUSES = [
  "draft",
  "in_review",
  "published",
  "unpublished",
  "archived",
] as const;

export interface ResourceTaxonomy {
  educationLevels: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string }>;
  courses: Array<{ id: string; name: string }>;
  semesters: Array<{ id: string; name: string }>;
  subjects: Array<{ id: string; name: string }>;
  topics: Array<{ id: string; name: string }>;
}

export async function getResourceTaxonomy(): Promise<ResourceTaxonomy> {
  const supabase = await createClient();
  const [
    { data: educationLevels, error: levelsError },
    { data: categories, error: categoriesError },
    { data: courses, error: coursesError },
    { data: semesters, error: semestersError },
    { data: subjects, error: subjectsError },
    { data: topics, error: topicsError },
  ] = await Promise.all([
    supabase.from("education_levels").select("id,name").order("sort_order"),
    supabase.from("categories").select("id,name").order("sort_order"),
    supabase.from("courses").select("id,name").order("sort_order"),
    supabase.from("semesters").select("id,name").order("sort_order"),
    supabase.from("subjects").select("id,name").order("sort_order"),
    supabase.from("topics").select("id,name").order("sort_order"),
  ]);

  const failedQuery = [
    levelsError,
    categoriesError,
    coursesError,
    semestersError,
    subjectsError,
    topicsError,
  ].find(Boolean);
  if (failedQuery) {
    throw new Error(`Unable to load resource categories: ${failedQuery.message}`);
  }

  return {
    educationLevels: educationLevels ?? [],
    categories: categories ?? [],
    courses: courses ?? [],
    semesters: semesters ?? [],
    subjects: subjects ?? [],
    topics: topics ?? [],
  };
}
