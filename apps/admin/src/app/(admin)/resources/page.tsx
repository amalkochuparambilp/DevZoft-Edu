import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/card";

export default async function ResourcesPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const sp = await searchParams;
  const supabase = await createClient();
  let query = supabase.from("resources").select("id,title,slug,status,resource_type,featured,created_at").order("created_at", { ascending: false }).limit(100);
  if (sp.q) query = query.ilike("title", `%${sp.q}%`);
  if (sp.status) query = query.eq("status", sp.status);
  const { data: resources } = await query;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Resources</h1>
        <Link href="/resources/new"><Button>New Resource</Button></Link>
      </div>
      <form className="flex gap-2">
        <input name="q" defaultValue={sp.q} placeholder="Search title..." className="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
        <select name="status" defaultValue={sp.status} className="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900">
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <Button type="submit" variant="secondary">Filter</Button>
      </form>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Type</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Featured</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(resources ?? []).map((r: any) => (
              <tr key={r.id} className="border-t border-slate-200 dark:border-slate-800">
                <td className="p-3">{r.title}</td>
                <td className="p-3">{r.resource_type}</td>
                <td className="p-3"><Badge variant={r.status === "published" ? "success" : r.status === "draft" ? "warning" : "default"}>{r.status}</Badge></td>
                <td className="p-3">{r.featured ? "Yes" : "No"}</td>
                <td className="p-3 flex gap-2">
                  <Link href={`/resources/${r.id}`} className="text-blue-600 hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
            {(!resources || resources.length === 0) && (
              <tr><td colSpan={5} className="p-6 text-center text-slate-500">No resources found.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
