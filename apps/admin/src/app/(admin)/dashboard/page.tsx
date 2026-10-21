import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = await createClient();
  const [
    { count: users },
    { count: resources },
    { count: published },
    { count: drafts },
    { count: quizzes },
    { count: announcements },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("resources").select("*", { count: "exact", head: true }),
    supabase.from("resources").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("resources").select("*", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("quizzes").select("*", { count: "exact", head: true }),
    supabase.from("announcements").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Registered Users", value: users ?? 0 },
    { label: "Total Resources", value: resources ?? 0 },
    { label: "Published", value: published ?? 0 },
    { label: "Drafts", value: drafts ?? 0 },
    { label: "Quizzes", value: quizzes ?? 0 },
    { label: "Announcements", value: announcements ?? 0 },
  ];

  const { data: recentResources } = await supabase
    .from("resources").select("id,title,status,created_at").order("created_at", { ascending: false }).limit(5);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader><CardTitle className="text-sm text-slate-500">{s.label}</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold">{s.value}</div></CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Recent Resources</CardTitle></CardHeader>
        <CardContent>
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {(recentResources ?? []).map((r: any) => (
              <li key={r.id} className="py-2 flex justify-between">
                <span>{r.title}</span>
                <span className="text-xs text-slate-500">{r.status}</span>
              </li>
            ))}
            {(!recentResources || recentResources.length === 0) && <li className="py-2 text-slate-500">No resources yet.</li>}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
