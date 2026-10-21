import { createClient } from "@/lib/supabase/server";
import { updateSetting } from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/card";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("app_settings").select("*").order("key");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Platform Settings</h1>
      <div className="space-y-4">
        {(settings ?? []).map((s: any) => (
          <Card key={s.key}>
            <CardHeader><CardTitle className="text-base">{s.key}</CardTitle></CardHeader>
            <CardContent>
              <form action={async (fd) => { "use server"; await updateSetting(s.key, String(fd.get("value") ?? "")); }} className="flex gap-2">
                <Input name="value" defaultValue={JSON.stringify(s.value)} />
                <Button type="submit" size="sm">Save</Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
