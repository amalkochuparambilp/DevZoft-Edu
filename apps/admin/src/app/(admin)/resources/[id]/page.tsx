import { createClient } from "@/lib/supabase/server";
import ResourceForm from "@/components/resource-form";
import { notFound } from "next/navigation";

export default async function EditResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: resource } = await supabase.from("resources").select("*").eq("id", id).single();
  if (!resource) notFound();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Edit Resource</h1>
      <ResourceForm initial={resource} id={id} />
    </div>
  );
}
