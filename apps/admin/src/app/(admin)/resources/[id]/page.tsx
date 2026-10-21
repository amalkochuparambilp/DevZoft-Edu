import { createClient } from "@/lib/supabase/server";
import ResourceForm from "@/components/resource-form";
import { getResourceTaxonomy } from "@/lib/resource-taxonomy";
import { notFound } from "next/navigation";

export default async function EditResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [
    { data: resource, error },
    taxonomy,
  ] = await Promise.all([
    supabase.from("resources").select("*").eq("id", id).single(),
    getResourceTaxonomy(),
  ]);
  if (error?.code === "PGRST116" || !resource) notFound();
  if (error) throw new Error(`Unable to load resource: ${error.message}`);
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
          Learning library
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Edit resource
        </h1>
      </div>
      <ResourceForm initial={resource} id={id} taxonomy={taxonomy} />
    </div>
  );
}
