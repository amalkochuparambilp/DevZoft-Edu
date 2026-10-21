import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";

export default async function AuditPage() {
  const supabase = await createClient();
  const { data: logs } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(100);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Audit Logs</h1>
      <Card>
        <CardContent className="pt-6">
          <table className="w-full text-sm">
            <thead><tr><th className="text-left p-2">Action</th><th className="text-left p-2">Target</th><th className="text-left p-2">When</th></tr></thead>
            <tbody>
              {(logs ?? []).map((l: any) => (
                <tr key={l.id} className="border-t border-slate-200 dark:border-slate-800">
                  <td className="p-2">{l.action}</td>
                  <td className="p-2">{l.target_type} {l.target_id}</td>
                  <td className="p-2">{new Date(l.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!logs || logs.length === 0) && <p className="text-slate-500">No logs.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
