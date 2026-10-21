"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

const errorMessages: Record<string, string> = {
  sign_in: "Your session has expired. Sign in again and retry.",
  permission:
    "Your account is missing permission for this action. Ask a Super Admin to review your role.",
  duplicate: "That name or slug is already in use. Choose a different one.",
  related:
    "This item is connected to other records and cannot be changed or deleted yet.",
  configuration:
    "The CMS database setup is incomplete. Check that all Supabase migrations have been applied.",
  unknown:
    "The change could not be saved. Check your connection and Supabase setup, then try again.",
  logout: "We could not sign you out. Please try again.",
};

export function AdminActionFeedback() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const reason = searchParams.get("reason");
  const [notice, setNotice] = useState<{
    isError: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (action !== "error" && action !== "saved") return;

    const isError = action === "error";
    setNotice({
      isError,
      message: isError
        ? errorMessages[reason ?? "unknown"] ?? errorMessages.unknown
        : "Your changes have been saved.",
    });
    const params = new URLSearchParams(searchParams.toString());
    params.delete("action");
    params.delete("reason");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [action, pathname, reason, router, searchParams]);

  if (!notice) return null;

  return (
    <div
      role={notice.isError ? "alert" : "status"}
      className={`mb-6 flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm shadow-sm ${
        notice.isError
          ? "border-rose-200 bg-rose-50 text-rose-800"
          : "border-emerald-200 bg-emerald-50 text-emerald-800"
      }`}
    >
      {notice.isError ? (
        <AlertCircle size={19} className="mt-0.5 shrink-0" />
      ) : (
        <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
      )}
      <p className="flex-1 leading-6">{notice.message}</p>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => setNotice(null)}
        className="rounded-lg p-1 opacity-70 hover:bg-black/5 hover:opacity-100"
      >
        <X size={16} />
      </button>
    </div>
  );
}
