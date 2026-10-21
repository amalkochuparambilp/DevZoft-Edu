import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export type AdminPermission =
  | "admin.access"
  | "content.create"
  | "content.edit"
  | "content.delete"
  | "curriculum.manage"
  | "quiz.manage"
  | "announcements.manage"
  | "settings.manage";

type AdminClient = Awaited<ReturnType<typeof createClient>>;

export type ActionFailure =
  | "sign_in"
  | "permission"
  | "invalid"
  | "duplicate"
  | "related"
  | "configuration"
  | "unknown";

function errorCode(error: unknown): string | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }
  return undefined;
}

export function actionFailure(error: unknown): ActionFailure {
  if (error instanceof AdminActionError) return error.failure;
  if (
    error instanceof Error &&
    error.message === "Missing Supabase environment variables."
  ) {
    return "configuration";
  }

  switch (errorCode(error)) {
    case "42501":
      return "permission";
    case "22P02":
    case "23514":
      return "invalid";
    case "23505":
      return "duplicate";
    case "23503":
      return "related";
    case "PGRST202":
    case "PGRST205":
      return "configuration";
    default:
      return "unknown";
  }
}

class AdminActionError extends Error {
  constructor(readonly failure: ActionFailure) {
    super(failure);
  }
}

export function rejectInvalidInput(): never {
  throw new AdminActionError("invalid");
}

export async function requireAdminPermission(
  supabase: AdminClient,
  user: User | null,
  permission: AdminPermission,
) {
  if (!user) throw new AdminActionError("sign_in");

  const { data, error } = await supabase.rpc("has_permission", {
    perm: permission,
  });
  if (error) throw error;
  if (data !== true) throw new AdminActionError("permission");
}

export async function runAdminAction(
  permission: AdminPermission,
  errorPath: string,
  successPath: string,
  operation: (supabase: AdminClient, user: User) => Promise<void>,
): Promise<never> {
  let supabase: AdminClient | undefined;
  let failure: ActionFailure | undefined;

  try {
    supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    await requireAdminPermission(supabase, user, permission);
    if (!user) throw new AdminActionError("sign_in");
    await operation(supabase, user);
  } catch (error) {
    failure = actionFailure(error);
    console.error("Admin action failed", { permission, failure });
  }

  if (failure) {
    redirect(`${errorPath}?action=error&reason=${failure}`);
  }

  if (!supabase) {
    redirect(`${errorPath}?action=error&reason=configuration`);
  }

  revalidatePath(errorPath);
  if (successPath !== errorPath) revalidatePath(successPath);
  redirect(`${successPath}?action=saved`);
}
