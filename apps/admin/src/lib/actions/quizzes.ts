"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createQuiz(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const payload: any = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description") || null,
    status: formData.get("status") || "draft",
    education_level_id: formData.get("education_level_id") || null,
    course_id: formData.get("course_id") || null,
    subject_id: formData.get("subject_id") || null,
    topic_id: formData.get("topic_id") || null,
    time_limit_seconds: formData.get("time_limit_seconds") ? Number(formData.get("time_limit_seconds")) : null,
    passing_score: Number(formData.get("passing_score") || 50),
    creator_id: user.id,
  };
  const { error } = await supabase.from("quizzes").insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/quizzes");
}

export async function deleteQuiz(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("quizzes").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/quizzes");
}

export async function addQuestion(quizId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: q, error } = await supabase.from("questions").insert({
    quiz_id: quizId,
    question_text: formData.get("question_text"),
    question_type: formData.get("question_type") || "mcq",
    points: Number(formData.get("points") || 1),
    sort_order: Number(formData.get("sort_order") || 0),
    explanation: formData.get("explanation") || null,
  }).select().single();
  if (error) throw new Error(error.message);
  const options = [0,1,2,3].map((i) => ({
    question_id: q.id,
    option_text: formData.get(`option_${i}`),
    is_correct: formData.get("correct") === String(i),
    sort_order: i,
  })).filter((o: any) => o.option_text);
  if (options.length) {
    const { error: oe } = await supabase.from("question_options").insert(options);
    if (oe) throw new Error(oe.message);
  }
  revalidatePath(`/quizzes/${quizId}`);
}

export async function deleteQuestion(id: string, quizId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("questions").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/quizzes/${quizId}`);
}
