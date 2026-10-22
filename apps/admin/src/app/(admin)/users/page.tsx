import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const sp = await searchParams;
  const supabase = await createClient();
  let q = supabase.from("profiles").select("id,display_name,email,created_at").order("created_at", { ascending: false }).limit(100);
  if (sp.q) q = q.ilike("email", `%${sp.q}%`);
  const { data: users } = await q;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Users</h1>
      <form className="flex flex-col gap-2 sm:flex-row">
        <input name="q" defaultValue={sp.q} placeholder="Search email..." className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm" />
        <button className="h-11 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white sm:w-auto">Search</button>
      </form>
      <Card>
        <CardHeader><CardTitle>Registered Users</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead><tr><th className="text-left p-2">Name</th><th className="text-left p-2">Email</th><th className="text-left p-2">Joined</th></tr></thead>
            <tbody>
              {(users ?? []).map((u: any) => (
                <tr key={u.id} className="border-t border-slate-200 dark:border-slate-800">
                  <td className="p-2">{u.display_name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
