export const dynamic = "force-dynamic";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/resources", label: "Resources", icon: "📚" },
  { href: "/categories", label: "Categories & Curriculum", icon: "🗂️" },
  { href: "/quizzes", label: "Quizzes", icon: "📝" },
  { href: "/announcements", label: "Announcements", icon: "📣" },
  { href: "/users", label: "Users", icon: "👥" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
  { href: "/audit", label: "Audit Logs", icon: "🧾" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", user.id).single();

  async function signOut() {
    "use server";
    const s = await createClient();
    await s.auth.signOut();
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="text-lg font-bold text-blue-600">DevZoft Learning</div>
          <div className="text-xs text-slate-500">Admin CMS</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
              <span>{n.icon}</span><span>{n.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="font-medium">{profile?.display_name ?? user.email}</div>
          <form action={signOut}><button className="mt-2 text-red-600 hover:underline">Sign out</button></form>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="font-bold text-blue-600">DevZoft Learning</div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
