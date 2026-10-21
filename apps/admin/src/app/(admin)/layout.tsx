export const dynamic = "force-dynamic";

import { LogOut, ShieldAlert } from "lucide-react";
import { signOutAdmin } from "@/lib/actions/auth";
import { AdminActionFeedback } from "@/components/admin-action-feedback";
import {
  AdminBrand,
  AdminMobileNavigation,
  AdminSidebar,
} from "@/components/admin-navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: hasAccess, error: permissionError }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle(),
      supabase.rpc("has_permission", { perm: "admin.access" }),
    ]);

  if (permissionError || hasAccess !== true) {
    if (permissionError) {
      console.error("CMS access permission check failed");
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10">
        <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <AdminBrand />
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
            <ShieldAlert size={23} />
          </div>
          <h1 className="mt-5 text-xl font-bold tracking-tight text-slate-900">
            Admin access required
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {permissionError
              ? "The CMS could not verify your admin permissions. Confirm that the Supabase database migrations and role permissions are configured."
              : "You are signed in, but your account does not have permission to access the CMS. Ask a Super Admin to assign an admin role."}
          </p>
          <form action={signOutAdmin} className="mt-6">
            <Button type="submit" variant="outline">
              <LogOut size={16} />
              Sign out
            </Button>
          </form>
        </section>
      </div>
    );
  }

  const displayName = profile?.display_name?.trim() || user.email || "Admin";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <AdminMobileNavigation />
            <div className="lg:hidden">
              <AdminBrand />
            </div>
            <div className="hidden text-sm font-medium text-slate-500 lg:block">
              Content management
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden max-w-52 truncate text-right sm:block">
              <p className="truncate text-xs font-semibold text-slate-800">
                {displayName}
              </p>
              <p className="text-[10px] text-slate-400">Administrator</p>
            </div>
            <div
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700 ring-1 ring-blue-100"
            >
              {initial}
            </div>
            <form action={signOutAdmin}>
              <button
                type="submit"
                className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <LogOut size={15} />
                <span className="hidden sm:inline">Sign out</span>
                <span className="sm:hidden">Logout</span>
              </button>
            </form>
          </div>
        </header>
        <main className="w-full flex-1">
          <div className="mx-auto w-full max-w-[1440px] p-5 sm:p-8">
            <AdminActionFeedback />
            {children}
          </div>
        </main>
        <footer className="border-t border-slate-200/80 px-5 py-4 text-center text-[11px] text-slate-400 sm:px-8">
          DevZoft Learning · Administration
        </footer>
      </div>
    </div>
  );
}
