"use server";

import { rejectInvalidInput, runAdminAction } from "@/lib/actions/admin";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function createQuiz(formData: FormData) {
  return runAdminAction(
    "quiz.manage",
    "/quizzes/new",
    "/quizzes",
    async (supabase, user) => {
      const title = text(formData, "title");
      const slug = text(formData, "slug");
      const timeLimit = text(formData, "time_limit_seconds");
      const passingScore = Number(text(formData, "passing_score") || 50);
      if (
        !title ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
        !Number.isInteger(passingScore) ||
        passingScore < 0 ||
        passingScore > 100 ||
        (timeLimit && (!Number.isInteger(Number(timeLimit)) || Number(timeLimit) < 1))
      ) {
        rejectInvalidInput();
      }
      const { error } = await supabase.from("quizzes").insert({
        title,
        slug,
        description: text(formData, "description") || null,
        status: text(formData, "status") || "draft",
        education_level_id: text(formData, "education_level_id") || null,
        course_id: text(formData, "course_id") || null,
        subject_id: text(formData, "subject_id") || null,
        topic_id: text(formData, "topic_id") || null,
        time_limit_seconds: timeLimit ? Number(timeLimit) : null,
        passing_score: passingScore,
        creator_id: user.id,
      });
      if (error) throw error;
    },
  );
}

export async function deleteQuiz(id: string) {
  return runAdminAction(
    "quiz.manage",
    "/quizzes",
    "/quizzes",
    async (supabase) => {
      const { error } = await supabase.from("quizzes").delete().eq("id", id);
      if (error) throw error;
    },
  );
}

export async function addQuestion(quizId: string, formData: FormData) {
  return runAdminAction(
    "quiz.manage",
    `/quizzes/${quizId}`,
    `/quizzes/${quizId}`,
    async (supabase) => {
      const options = [0, 1, 2, 3]
        .map((index) => ({
          option_text: text(formData, `option_${index}`),
          is_correct: formData.get("correct") === String(index),
          sort_order: index,
        }))
        .filter((option) => option.option_text);
      if (
        options.length < 2 ||
        !options.some((option) => option.is_correct)
      ) {
        rejectInvalidInput();
      }

      const { data: question, error } = await supabase
        .from("questions")
        .insert({
          quiz_id: quizId,
          question_text: text(formData, "question_text"),
          question_type: text(formData, "question_type") || "mcq",
          points: Number(text(formData, "points") || 1),
          sort_order: Number(text(formData, "sort_order") || 0),
          explanation: text(formData, "explanation") || null,
        })
        .select()
        .single();
      if (error) throw error;

      const questionOptions = options.map((option) => ({
        ...option,
        question_id: question.id,
      }));
      const { error: optionsError } = await supabase
        .from("question_options")
        .insert(questionOptions);
      if (optionsError) throw optionsError;
    },
  );
}

export async function deleteQuestion(id: string, quizId: string) {
  return runAdminAction(
    "quiz.manage",
    `/quizzes/${quizId}`,
    `/quizzes/${quizId}`,
    async (supabase) => {
      const { error } = await supabase.from("questions").delete().eq("id", id);
      if (error) throw error;
    },
  );
}
