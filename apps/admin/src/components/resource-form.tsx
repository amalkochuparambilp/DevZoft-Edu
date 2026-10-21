import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSubmitButton } from "@/components/form-submit-button";
import { createResource, updateResource } from "@/lib/actions/resources";
import type { ResourceTaxonomy } from "@/lib/resource-taxonomy";

const TYPES = [
  "pdf",
  "notes",
  "ebook",
  "video",
  "audio",
  "article",
  "worksheet",
  "question_paper",
  "external_link",
];
const STATUSES = ["draft", "in_review", "published", "unpublished", "archived"];

interface ResourceRecord {
  title: string;
  slug: string;
  description: string | null;
  resource_type: string;
  status: string;
  language: string | null;
  education_level_id: string | null;
  category_id: string | null;
  course_id: string | null;
  semester_id: string | null;
  subject_id: string | null;
  topic_id: string | null;
  thumbnail_url: string | null;
  file_url: string | null;
  external_url: string | null;
  featured: boolean;
}

type ResourceOption = ResourceTaxonomy[keyof ResourceTaxonomy];

function TaxonomySelect({
  label,
  name,
  options,
  value,
}: {
  label: string;
  name: string;
  options: ResourceOption;
  value?: string | null;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      <select
        name={name}
        defaultValue={value ?? ""}
        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">Not assigned</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function ResourceForm({
  initial,
  id,
  taxonomy,
}: {
  initial?: ResourceRecord;
  id?: string;
  taxonomy: ResourceTaxonomy;
}) {
  async function saveResource(formData: FormData) {
    "use server";
    if (id) return updateResource(id, formData);
    return createResource(formData);
  }

  return (
    <form action={saveResource} className="max-w-4xl space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Resource information</CardTitle>
          <p className="text-sm text-slate-500">
            Add a clear title and description so learners can find the right
            material.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Title">
              <input
                name="title"
                defaultValue={initial?.title}
                required
                maxLength={160}
                placeholder="e.g. Introduction to algebra"
                className={inputClass}
              />
            </Field>
            <Field label="URL slug">
              <input
                name="slug"
                defaultValue={initial?.slug}
                required
                maxLength={180}
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                title="Use lowercase letters, numbers, and hyphens."
                placeholder="introduction-to-algebra"
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Description">
            <textarea
              name="description"
              defaultValue={initial?.description ?? ""}
              rows={4}
              maxLength={5000}
              placeholder="What will learners find in this resource?"
              className={`${inputClass} h-auto min-h-28 py-3`}
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Resource type">
              <select
                name="resource_type"
                defaultValue={initial?.resource_type ?? "article"}
                className={inputClass}
              >
                {TYPES.map((type) => (
                  <option key={type} value={type}>
                    {labelize(type)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Publishing status">
              <select
                name="status"
                defaultValue={initial?.status ?? "draft"}
                className={inputClass}
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {labelize(status)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Language">
              <input
                name="language"
                defaultValue={initial?.language ?? "en"}
                maxLength={10}
                placeholder="en"
                className={inputClass}
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Curriculum</CardTitle>
          <p className="text-sm text-slate-500">
            Optionally connect this resource to a learning level and topic.
          </p>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <TaxonomySelect
            label="Education level"
            name="education_level_id"
            options={taxonomy.educationLevels}
            value={initial?.education_level_id}
          />
          <TaxonomySelect
            label="Category"
            name="category_id"
            options={taxonomy.categories}
            value={initial?.category_id}
          />
          <TaxonomySelect
            label="Course"
            name="course_id"
            options={taxonomy.courses}
            value={initial?.course_id}
          />
          <TaxonomySelect
            label="Semester"
            name="semester_id"
            options={taxonomy.semesters}
            value={initial?.semester_id}
          />
          <TaxonomySelect
            label="Subject"
            name="subject_id"
            options={taxonomy.subjects}
            value={initial?.subject_id}
          />
          <TaxonomySelect
            label="Topic"
            name="topic_id"
            options={taxonomy.topics}
            value={initial?.topic_id}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media and visibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <Field label="Thumbnail URL">
            <input
              name="thumbnail_url"
              type="url"
              defaultValue={initial?.thumbnail_url ?? ""}
              placeholder="https://example.com/thumbnail.jpg"
              className={inputClass}
            />
          </Field>
          <Field label="File URL">
            <input
              name="file_url"
              type="url"
              defaultValue={initial?.file_url ?? ""}
              placeholder="https://example.com/resource.pdf"
              className={inputClass}
            />
          </Field>
          <Field label="External URL">
            <input
              name="external_url"
              type="url"
              defaultValue={initial?.external_url ?? ""}
              placeholder="https://"
              className={inputClass}
            />
          </Field>
          <label className="flex w-fit cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={initial?.featured ?? false}
              className="size-4 accent-blue-600"
            />
            Feature this resource
          </label>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <FormSubmitButton className="min-w-32">
          {id ? "Save changes" : "Create resource"}
        </FormSubmitButton>
        <Link href="/resources">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
        <span className="text-xs text-slate-400">
          Changes are saved to your learning platform.
        </span>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function labelize(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (character) =>
    character.toUpperCase(),
  );
}

const inputClass =
  "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100";
