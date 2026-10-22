import { createClient } from "@/lib/supabase/server";
import { createAnnouncement, deleteAnnouncement } from "@/lib/actions/announcements";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/card";

export default async function AnnouncementsPage() {
  const supabase = await createClient();
  const { data: items } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Announcements</h1>
      <Card>
        <CardHeader><CardTitle>New Announcement</CardTitle></CardHeader>
        <CardContent>
          <form action={createAnnouncement} className="space-y-3">
            <Input name="title" placeholder="Title" required />
            <textarea name="body" placeholder="Body" required className="w-full rounded-lg border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-900" rows={3} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <select name="target_audience" className="h-11 min-w-0 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700">
                <option value="all">all</option>
                <option value="students">students</option>
                <option value="teachers">teachers</option>
                <option value="admins">admins</option>
              </select>
              <select name="status" className="h-11 min-w-0 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700">
                <option value="draft">draft</option>
                <option value="published">published</option>
              </select>
            </div>
            <Button type="submit">Create</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {(items ?? []).map((a: any) => (
              <li key={a.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="font-medium">{a.title}</div>
                  <div className="text-xs text-slate-500">{a.status} · {a.target_audience}</div>
                </div>
                <form action={deleteAnnouncement.bind(null, a.id)}>
                  <Button size="sm" variant="destructive" type="submit">Delete</Button>
                </form>
              </li>
            ))}
            {(!items || items.length === 0) && <li className="py-3 text-slate-500">No announcements.</li>}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
