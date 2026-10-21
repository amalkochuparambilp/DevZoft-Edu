import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { deleteQuiz } from "@/lib/actions/quizzes";

export default async function QuizzesPage() {
  const supabase = await createClient();
  const { data: quizzes } = await supabase.from("quizzes").select("*").order("created_at", { ascending: false });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quizzes</h1>
        <Link href="/quizzes/new"><Button>New Quiz</Button></Link>
      </div>
      <Card>
        <CardContent className="pt-6">
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {(quizzes ?? []).map((q: any) => (
              <li key={q.id} className="py-3 flex items-center justify-between">
                <div>
                  <Link href={`/quizzes/${q.id}`} className="font-medium text-blue-600 hover:underline">{q.title}</Link>
                  <div className="text-xs text-slate-500">{q.status}</div>
                </div>
                <form action={deleteQuiz.bind(null, q.id)}>
                  <Button size="sm" variant="destructive" type="submit">Delete</Button>
                </form>
              </li>
            ))}
            {(!quizzes || quizzes.length === 0) && <li className="py-3 text-slate-500">No quizzes yet.</li>}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
