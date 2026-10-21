import { createQuiz } from "@/lib/actions/quizzes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/card";
import { Card, CardContent } from "@/components/ui/card";

export default function NewQuizPage() {
  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-2xl font-bold">New Quiz</h1>
      <Card><CardContent className="pt-6">
        <form action={createQuiz} className="space-y-4">
          <Input name="title" placeholder="Title" required />
          <Input name="slug" placeholder="Slug" required />
          <textarea name="description" placeholder="Description" className="w-full rounded-lg border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-900" rows={3} />
          <select name="status" className="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900">
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
          <Input name="time_limit_seconds" type="number" placeholder="Time limit (seconds)" />
          <Input name="passing_score" type="number" placeholder="Passing score %" defaultValue={50} />
          <Input name="education_level_id" placeholder="Education level ID" />
          <Input name="subject_id" placeholder="Subject ID" />
          <Button type="submit">Create</Button>
        </form>
      </CardContent></Card>
    </div>
  );
}
