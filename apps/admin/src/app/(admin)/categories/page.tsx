import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createCategory, deleteCategory, createEducationLevel, createCourse, createSubject } from "@/lib/actions/categories";

const fieldClass =
  "h-11 min-w-0 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

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
          <form action={createEducationLevel} className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <input name="name" placeholder="Name" required className={fieldClass} />
            <input name="slug" placeholder="Slug" required className={fieldClass} />
            <input name="sort_order" type="number" placeholder="Order" className={fieldClass} />
            <Button type="submit" size="sm" className="w-full sm:w-auto">Add level</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Add Category</CardTitle></CardHeader>
        <CardContent>
          <form action={createCategory} className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <input name="name" placeholder="Name" required className={fieldClass} />
            <input name="slug" placeholder="Slug" required className={fieldClass} />
            <select name="kind" className={fieldClass}>
              <option value="resource">resource</option>
              <option value="class">class</option>
              <option value="subject">subject</option>
            </select>
            <select name="education_level_id" className={fieldClass}>
              <option value="">Level</option>
              {(levels ?? []).map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
            <Button type="submit" size="sm" className="w-full sm:w-auto">Add category</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Add Course</CardTitle></CardHeader>
        <CardContent>
          <form action={createCourse} className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <input name="name" placeholder="Name" required className={fieldClass} />
            <input name="slug" placeholder="Slug" required className={fieldClass} />
            <select name="education_level_id" className={fieldClass}>
              <option value="">Level</option>
              {(levels ?? []).map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
            <Button type="submit" size="sm" className="w-full sm:w-auto">Add course</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Add Subject</CardTitle></CardHeader>
        <CardContent>
          <form action={createSubject} className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <input name="name" placeholder="Name" required className={fieldClass} />
            <input name="slug" placeholder="Slug" required className={fieldClass} />
            <select name="education_level_id" className={fieldClass}>
              <option value="">Level</option>
              {(levels ?? []).map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
            <select name="course_id" className={fieldClass}>
              <option value="">Course</option>
              {(courses ?? []).map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <Button type="submit" size="sm" className="w-full sm:w-auto">Add subject</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Categories</CardTitle></CardHeader>
        <CardContent>
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {(categories ?? []).map((c: any) => (
              <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                <span className="min-w-0 break-words">{c.name} <span className="text-xs text-slate-500">({c.kind})</span></span>
                <form action={deleteCategory.bind(null, c.id)}>
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
