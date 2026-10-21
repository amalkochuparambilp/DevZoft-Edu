import ResourceForm from "@/components/resource-form";
import { getResourceTaxonomy } from "@/lib/resource-taxonomy";

export default async function NewResourcePage() {
  const taxonomy = await getResourceTaxonomy();
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
          Learning library
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Create a resource
        </h1>
      </div>
      <ResourceForm taxonomy={taxonomy} />
    </div>
  );
}
