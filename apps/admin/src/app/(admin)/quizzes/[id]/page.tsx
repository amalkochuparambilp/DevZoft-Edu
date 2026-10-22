import { createClient } from "@/lib/supabase/server";
import { addQuestion, deleteQuestion } from "@/lib/actions/quizzes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/card";

export default async function QuizDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: quiz } = await supabase.from("quizzes").select("*").eq("id", id).single();
  const { data: questions } = await supabase.from("questions").select("*, question_options(*)").eq("quiz_id", id).order("sort_order");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{quiz?.title}</h1>
      <Card>
        <CardHeader><CardTitle>Add Question</CardTitle></CardHeader>
        <CardContent>
          <form action={addQuestion.bind(null, id)} className="space-y-3">
            <textarea name="question_text" placeholder="Question text" required className="w-full rounded-lg border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-900" rows={2} />
            <select name="question_type" className="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900">
              <option value="mcq">mcq</option>
              <option value="single_choice">single_choice</option>
            </select>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {[0,1,2,3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="radio" name="correct" value={i} />
                  <Input name={`option_${i}`} placeholder={`Option ${i + 1}`} />
                </div>
              ))}
            </div>
            <Input name="explanation" placeholder="Explanation (optional)" />
            <Input name="points" type="number" placeholder="Points" defaultValue={1} />
            <Button type="submit">Add Question</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {(questions ?? []).map((q: any, idx: number) => (
          <Card key={q.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="font-medium">{idx + 1}. {q.question_text}</div>
                  <ul className="mt-2 space-y-1 text-sm">
                    {(q.question_options ?? []).map((o: any) => (
                      <li key={o.id} className={o.is_correct ? "text-green-600 font-medium" : ""}>{o.option_text}{o.is_correct ? " ✓" : ""}</li>
                    ))}
                  </ul>
                  {q.explanation && <p className="mt-2 text-xs text-slate-500">Explanation: {q.explanation}</p>}
                </div>
                <form action={deleteQuestion.bind(null, q.id, id)}>
                  <Button size="sm" variant="destructive" type="submit">Delete</Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
