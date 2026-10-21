"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/card";
import { Card, CardContent } from "@/components/ui/card";
import { createResource, updateResource } from "@/lib/actions/resources";

const TYPES = ["pdf","notes","ebook","video","audio","article","worksheet","question_paper","external_link"];
const STATUSES = ["draft","in_review","published","unpublished","archived"];

export default function ResourceForm({ initial, id }: { initial?: any; id?: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      if (id) await updateResource(id, fd);
      else await createResource(fd);
      router.push("/resources");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input name="title" defaultValue={initial?.title} required />
            </div>
            <div>
              <label className="text-sm font-medium">Slug</label>
              <Input name="slug" defaultValue={initial?.slug} required />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea name="description" defaultValue={initial?.description ?? ""} className="w-full rounded-lg border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-900" rows={4} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Type</label>
              <select name="resource_type" defaultValue={initial?.resource_type ?? "article"} className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900">
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <select name="status" defaultValue={initial?.status ?? "draft"} className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Language</label>
              <Input name="language" defaultValue={initial?.language ?? "en"} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Education Level ID</label>
              <Input name="education_level_id" defaultValue={initial?.education_level_id ?? ""} />
            </div>
            <div>
              <label className="text-sm font-medium">Category ID</label>
              <Input name="category_id" defaultValue={initial?.category_id ?? ""} />
            </div>
            <div>
              <label className="text-sm font-medium">Subject ID</label>
              <Input name="subject_id" defaultValue={initial?.subject_id ?? ""} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Course ID</label>
              <Input name="course_id" defaultValue={initial?.course_id ?? ""} />
            </div>
            <div>
              <label className="text-sm font-medium">Semester ID</label>
              <Input name="semester_id" defaultValue={initial?.semester_id ?? ""} />
            </div>
            <div>
              <label className="text-sm font-medium">Topic ID</label>
              <Input name="topic_id" defaultValue={initial?.topic_id ?? ""} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Thumbnail URL</label>
            <Input name="thumbnail_url" defaultValue={initial?.thumbnail_url ?? ""} />
          </div>
          <div>
            <label className="text-sm font-medium">File URL</label>
            <Input name="file_url" defaultValue={initial?.file_url ?? ""} />
          </div>
          <div>
            <label className="text-sm font-medium">External URL</label>
            <Input name="external_url" defaultValue={initial?.external_url ?? ""} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" defaultChecked={initial?.featured} /> Featured
          </label>
        </CardContent>
      </Card>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
