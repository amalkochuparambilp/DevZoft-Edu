import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CircleHelp,
  Megaphone,
  Plus,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const metricQueries = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("resources").select("*", { count: "exact", head: true }),
    supabase
      .from("resources")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("resources")
      .select("*", { count: "exact", head: true })
      .eq("status", "draft"),
    supabase.from("quizzes").select("*", { count: "exact", head: true }),
    supabase
      .from("announcements")
      .select("*", { count: "exact", head: true }),
  ]);
  const metricError = metricQueries.find((query) => query.error)?.error;
  if (metricError) {
    throw new Error(`Unable to load dashboard metrics: ${metricError.message}`);
  }

  const [users, resources, published, drafts, quizzes, announcements] =
    metricQueries.map((query) => query.count ?? 0);
  const { data: recentResources, error: resourceError } = await supabase
    .from("resources")
    .select("id,title,status,resource_type,created_at")
    .order("created_at", { ascending: false })
    .limit(6);
  if (resourceError) {
    throw new Error(`Unable to load recent resources: ${resourceError.message}`);
  }

  const metrics = [
    {
      label: "Registered learners",
      value: users,
      icon: Users,
      href: "/users",
      tone: "bg-violet-50 text-violet-600",
      trend: "Platform community",
    },
    {
      label: "Learning resources",
      value: resources,
      icon: BookOpen,
      href: "/resources",
      tone: "bg-blue-50 text-blue-600",
      trend: `${published} published`,
    },
    {
      label: "Draft resources",
      value: drafts,
      icon: ArrowDownRight,
      href: "/resources?status=draft",
      tone: "bg-amber-50 text-amber-600",
      trend: "Ready for review",
    },
    {
      label: "Quizzes",
      value: quizzes,
      icon: CircleHelp,
      href: "/quizzes",
      tone: "bg-emerald-50 text-emerald-600",
      trend: "Knowledge checks",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
            Workspace overview
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Good to see you.
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Here&apos;s what&apos;s happening across your learning platform.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/quizzes/new">
            <Button variant="outline">
              <Plus size={16} />
              New quiz
            </Button>
          </Link>
          <Link href="/resources/new">
            <Button>
              <Plus size={16} />
              Add resource
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Link key={metric.label} href={metric.href} className="group">
              <Card className="h-full transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <span
                      className={`flex size-10 items-center justify-center rounded-xl ${metric.tone}`}
                    >
                      <Icon size={19} />
                    </span>
                    <ArrowUpRight
                      size={17}
                      className="text-slate-300 transition group-hover:text-blue-600"
                    />
                  </div>
                  <p className="mt-5 text-sm font-medium text-slate-500">
                    {metric.label}
                  </p>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                    {metric.value.toLocaleString()}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">{metric.trend}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <CardTitle className="text-base">Recently added</CardTitle>
              <p className="mt-1 text-xs text-slate-500">
                The latest resources in your library
              </p>
            </div>
            <Link
              href="/resources"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              View library <ArrowRight size={14} />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {(recentResources ?? []).map((resource) => (
                <Link
                  key={resource.id}
                  href={`/resources/${resource.id}`}
                  className="flex items-center gap-3 px-5 py-4 transition hover:bg-slate-50 sm:px-6"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <BookOpen size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-800">
                      {resource.title}
                    </span>
                    <span className="mt-1 block text-xs text-slate-400">
                      {resource.resource_type.replaceAll("_", " ")} ·{" "}
                      {new Date(resource.created_at).toLocaleDateString()}
                    </span>
                  </span>
                  <Badge
                    variant={
                      resource.status === "published"
                        ? "success"
                        : resource.status === "draft"
                          ? "warning"
                          : "default"
                    }
                  >
                    {resource.status}
                  </Badge>
                </Link>
              ))}
              {(!recentResources || recentResources.length === 0) && (
                <div className="px-6 py-12 text-center">
                  <BookOpen className="mx-auto text-slate-300" size={30} />
                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    Your library is ready to grow
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Add a resource to get started.
                  </p>
                  <Link href="/resources/new" className="mt-3 inline-block">
                    <Button size="sm">Add first resource</Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader className="px-5 pb-3 pt-5">
              <CardTitle className="text-base">Quick actions</CardTitle>
              <p className="mt-1 text-xs text-slate-500">
                Common tasks, right where you need them
              </p>
            </CardHeader>
            <CardContent className="space-y-2 px-4 pb-4">
              <QuickAction
                href="/resources/new"
                icon={<BookOpen size={17} />}
                label="Create a learning resource"
              />
              <QuickAction
                href="/announcements"
                icon={<Megaphone size={17} />}
                label="Post an announcement"
              />
              <QuickAction
                href="/categories"
                icon={<Plus size={17} />}
                label="Manage curriculum"
              />
            </CardContent>
          </Card>
          <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                <Megaphone size={17} />
              </div>
              <p className="mt-3 text-sm font-bold text-slate-900">
                Platform updates
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                {announcements.toLocaleString()} announcements are available in
                your workspace.
              </p>
              <Link
                href="/announcements"
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-700"
              >
                Manage announcements <ArrowRight size={14} />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-3 text-xs font-semibold text-slate-700 transition hover:border-blue-100 hover:bg-blue-50/50 hover:text-blue-700"
    >
      <span className="text-blue-600">{icon}</span>
      <span className="flex-1">{label}</span>
      <ArrowRight size={14} className="text-slate-300" />
    </Link>
  );
}
