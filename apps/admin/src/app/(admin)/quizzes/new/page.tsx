import { createQuiz } from "@/lib/actions/quizzes";
import { Input } from "@/components/ui/card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSubmitButton } from "@/components/form-submit-button";
import { createClient } from "@/lib/supabase/server";

export default async function NewQuizPage() {
  const supabase = await createClient();
  const [{ data: levels, error: levelsError }, { data: subjects, error: subjectsError }] =
    await Promise.all([
      supabase.from("education_levels").select("id,name").order("sort_order"),
      supabase.from("subjects").select("id,name").order("sort_order"),
    ]);
  if (levelsError || subjectsError) {
    throw new Error(
      `Unable to load quiz curriculum: ${levelsError?.message ?? subjectsError?.message}`,
    );
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
          Assessments
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Create a quiz
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Quiz details</CardTitle>
          <p className="text-sm text-slate-500">
            Set up the assessment and connect it to the relevant curriculum.
          </p>
        </CardHeader>
        <CardContent>
        <form action={createQuiz} className="space-y-4">
          <Field label="Quiz title">
            <Input
              name="title"
              placeholder="e.g. Algebra fundamentals"
              required
              maxLength={160}
            />
          </Field>
          <Field label="URL slug">
            <Input
              name="slug"
              placeholder="algebra-fundamentals"
              required
              maxLength={180}
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              title="Use lowercase letters, numbers, and hyphens."
            />
          </Field>
          <Field label="Description">
            <textarea
              name="description"
              placeholder="Describe what this quiz covers."
              maxLength={3000}
              className="min-h-28 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              rows={3}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Status">
              <select name="status" className={inputClass} defaultValue="draft">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </Field>
            <Field label="Time limit (seconds)">
              <Input
                name="time_limit_seconds"
                type="number"
                min={1}
                step={1}
                placeholder="No time limit"
              />
            </Field>
            <Field label="Passing score (%)">
              <Input
                name="passing_score"
                type="number"
                min={0}
                max={100}
                step={1}
                defaultValue={50}
                required
              />
            </Field>
            <Field label="Education level">
              <select
                name="education_level_id"
                className={inputClass}
                defaultValue=""
              >
                <option value="">Not assigned</option>
                {(levels ?? []).map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Subject">
              <select name="subject_id" className={inputClass} defaultValue="">
                <option value="">Not assigned</option>
                {(subjects ?? []).map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="pt-2">
            <FormSubmitButton>Create quiz</FormSubmitButton>
          </div>
        </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100";
