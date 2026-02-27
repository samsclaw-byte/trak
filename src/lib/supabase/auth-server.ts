import { createClient } from "@/lib/supabase/server";

/** Returns the current user id from Supabase session, or null if unauthenticated. */
export async function getUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}
