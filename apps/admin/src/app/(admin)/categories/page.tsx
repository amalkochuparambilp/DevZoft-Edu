import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createCategory, deleteCategory, createEducationLevel, createCourse, createSubject } from "@/lib/actions/categories";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const [{ data: levels }, { data: categories }, { data: courses }, { data: subjects }] = await Promise.all([
    supabase.from("education_levels").select("*").order("sort_order"),
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("courses").select("*").order("sort_order"),
    supabase.from("subjects").select("*").order("sort_order"),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Categories & Curriculum</h1>

      <Card>
        <CardHeader><CardTitle>Add Education Level</CardTitle></CardHeader>
        <CardContent>
          <form action={createEducationLevel} className="flex flex-wrap gap-2 items-end">
            <input name="name" placeholder="Name" required className="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
            <input name="slug" placeholder="Slug" required className="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
            <input name="sort_order" type="number" placeholder="Order" className="h-10 w-20 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
            <Button type="submit" size="sm">Add</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Add Category</CardTitle></CardHeader>
        <CardContent>
          <form action={createCategory} className="flex flex-wrap gap-2 items-end">
            <input name="name" placeholder="Name" required className="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
            <input name="slug" placeholder="Slug" required className="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
            <select name="kind" className="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900">
              <option value="resource">resource</option>
              <option value="class">class</option>
              <option value="subject">subject</option>
            </select>
            <select name="education_level_id" className="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900">
              <option value="">Level</option>
              {(levels ?? []).map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
            <Button type="submit" size="sm">Add</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Add Course</CardTitle></CardHeader>
        <CardContent>
          <form action={createCourse} className="flex flex-wrap gap-2 items-end">
            <input name="name" placeholder="Name" required className="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
            <input name="slug" placeholder="Slug" required className="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
            <select name="education_level_id" className="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900">
              <option value="">Level</option>
              {(levels ?? []).map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
            <Button type="submit" size="sm">Add</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Add Subject</CardTitle></CardHeader>
        <CardContent>
          <form action={createSubject} className="flex flex-wrap gap-2 items-end">
            <input name="name" placeholder="Name" required className="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
            <input name="slug" placeholder="Slug" required className="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
            <select name="education_level_id" className="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900">
              <option value="">Level</option>
              {(levels ?? []).map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
            <select name="course_id" className="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900">
              <option value="">Course</option>
              {(courses ?? []).map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <Button type="submit" size="sm">Add</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Categories</CardTitle></CardHeader>
        <CardContent>
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {(categories ?? []).map((c: any) => (
              <li key={c.id} className="py-2 flex items-center justify-between">
                <span>{c.name} <span className="text-xs text-slate-500">({c.kind})</span></span>
                <form action={async () => { "use server"; await deleteCategory(c.id); }}>
                  <Button size="sm" variant="destructive" type="submit">Delete</Button>
                </form>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Courses</CardTitle></CardHeader>
        <CardContent>
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {(courses ?? []).map((c: any) => <li key={c.id} className="py-2">{c.name}</li>)}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Subjects</CardTitle></CardHeader>
        <CardContent>
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {(subjects ?? []).map((s: any) => <li key={s.id} className="py-2">{s.name}</li>)}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
