export type ResourceStatus = "draft" | "in_review" | "published" | "unpublished" | "archived" | "scheduled";
export type ResourceType = "pdf" | "notes" | "ebook" | "video" | "audio" | "article" | "worksheet" | "question_paper" | "external_link";

export interface Resource {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  resource_type: ResourceType;
  status: ResourceStatus;
  featured: boolean;
  education_level_id?: string | null;
  category_id?: string | null;
  course_id?: string | null;
  semester_id?: string | null;
  subject_id?: string | null;
  topic_id?: string | null;
  language?: string | null;
  thumbnail_url?: string | null;
  file_url?: string | null;
  external_url?: string | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}
