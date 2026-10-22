import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/card";
import { togglePublish } from "@/lib/actions/resources";
import { RESOURCE_STATUSES, RESOURCE_TYPES } from "@/lib/resource-taxonomy";

const filterClass =
  "h-11 min-w-0 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    type?: string;
    featured?: string;
  }>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();
  let query = supabase
    .from("resources")
    .select("id,title,slug,status,resource_type,featured,created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  if (sp.q?.trim()) query = query.ilike("title", `%${sp.q.trim()}%`);
  if (RESOURCE_STATUSES.some((status) => status === sp.status)) {
    query = query.eq("status", sp.status!);
  }
  if (RESOURCE_TYPES.some((type) => type === sp.type)) {
    query = query.eq("resource_type", sp.type!);
  }
  if (sp.featured === "true" || sp.featured === "false") {
    query = query.eq("featured", sp.featured === "true");
  }
  const { data: resources, error } = await query;
  if (error) {
    throw new Error(`Unable to load resources: ${error.message}`);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
            Learning library
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Resources
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage the learning materials available in the mobile app.
          </p>
        </div>
        <Link href="/resources/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">New resource</Button>
        </Link>
      </div>
      <form className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 xl:grid-cols-[minmax(200px,1.5fr)_repeat(3,minmax(140px,1fr))_auto]">
        <label className="sr-only" htmlFor="resource-search">
          Search resources
        </label>
        <input
          id="resource-search"
          name="q"
          defaultValue={sp.q}
          placeholder="Search resource titles..."
          className={filterClass}
        />
        <label className="sr-only" htmlFor="resource-type">
          Filter by resource type
        </label>
        <select
          id="resource-type"
          name="type"
          defaultValue={sp.type}
          className={filterClass}
        >
          <option value="">All types</option>
          {RESOURCE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor="resource-status">
          Filter by status
        </label>
        <select
          id="resource-status"
          name="status"
          defaultValue={sp.status}
          className={filterClass}
        >
          <option value="">All statuses</option>
          {RESOURCE_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor="resource-featured">
          Filter by featured status
        </label>
        <select
          id="resource-featured"
          name="featured"
          defaultValue={sp.featured}
          className={filterClass}
        >
          <option value="">Featured and standard</option>
          <option value="true">Featured</option>
          <option value="false">Not featured</option>
        </select>
        <div className="flex gap-2 sm:col-span-2 xl:col-span-1">
          <Button type="submit" variant="secondary" className="flex-1 sm:flex-none">
            Filter
          </Button>
          <Link
            href="/resources"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Reset
          </Link>
        </div>
      </form>
      <div className="flex items-center justify-between text-sm">
        <p className="font-semibold text-slate-800">Resource library</p>
        <p className="text-slate-500">{resources.length} shown · up to 100</p>
      </div>
      <div className="space-y-3 md:hidden">
        {resources.map((resource) => (
          <Card key={resource.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="break-words font-semibold text-slate-900">
                  {resource.title}
                </h2>
                <p className="mt-1 break-all text-xs text-slate-400">
                  {resource.slug}
                </p>
              </div>
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
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="rounded-lg bg-slate-100 px-2.5 py-1 capitalize">
                {resource.resource_type.replaceAll("_", " ")}
              </span>
              {resource.featured && (
                <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-amber-700">
                  Featured
                </span>
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
              <Link
                href={`/resources/${resource.id}`}
                className="inline-flex h-9 items-center rounded-lg px-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
              >
                Edit
              </Link>
              <form
                action={togglePublish.bind(
                  null,
                  resource.id,
                  resource.status !== "published",
                )}
              >
                <Button
                  type="submit"
                  size="sm"
                  variant={resource.status === "published" ? "outline" : "secondary"}
                >
                  {resource.status === "published" ? "Unpublish" : "Publish"}
                </Button>
              </form>
            </div>
          </Card>
        ))}
      </div>
      <Card className="hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Featured</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => (
                <tr key={resource.id} className="border-t border-slate-100">
                  <td className="max-w-sm p-4">
                    <span className="block truncate font-semibold text-slate-800">
                      {resource.title}
                    </span>
                    <span className="mt-1 block truncate text-xs text-slate-400">
                      {resource.slug}
                    </span>
                  </td>
                  <td className="p-4 capitalize">
                    {resource.resource_type.replaceAll("_", " ")}
                  </td>
                  <td className="p-4">
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
                  </td>
                  <td className="p-4">{resource.featured ? "Yes" : "No"}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/resources/${resource.id}`}
                        className="rounded-lg px-3 py-2 font-semibold text-blue-700 hover:bg-blue-50"
                      >
                        Edit
                      </Link>
                      <form
                        action={togglePublish.bind(
                          null,
                          resource.id,
                          resource.status !== "published",
                        )}
                      >
                        <Button
                          type="submit"
                          size="sm"
                          variant={
                            resource.status === "published"
                              ? "outline"
                              : "secondary"
                          }
                        >
                          {resource.status === "published"
                            ? "Unpublish"
                            : "Publish"}
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {resources.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-500">
                    No resources match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      {resources.length === 0 && (
        <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 md:hidden">
          No resources match these filters.
        </p>
      )}
    </div>
  );
}
