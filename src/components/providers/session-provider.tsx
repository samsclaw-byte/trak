"use client";

import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/** Session user shape used by the app (id, name, image for dashboard). */
export type SessionUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
};

function mapUser(user: User): SessionUser {
  const meta = user.user_metadata as Record<string, unknown> | undefined;
  return {
    id: user.id,
    email: user.email ?? null,
    name: (meta?.full_name as string) ?? (meta?.name as string) ?? null,
    image: (meta?.avatar_url as string) ?? (meta?.picture as string) ?? null,
  };
}

type Session = { user: SessionUser } | null;
type Status = "loading" | "authenticated" | "unauthenticated";

const SessionContext = createContext<{
  data: Session;
  status: Status;
  refetch: () => Promise<void>;
}>({
  data: null,
  status: "loading",
  refetch: async () => {},
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(null);
  const [status, setStatus] = useState<Status>("loading");
  const supabase = createClient();

  const refetch = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setSession(user ? { user: mapUser(user) } : null);
    setStatus(user ? "authenticated" : "unauthenticated");
  }, [supabase.auth]);

  useEffect(() => {
    refetch();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session?.user ? { user: mapUser(session.user) } : null);
      setStatus(session?.user ? "authenticated" : "unauthenticated");
    });
    return () => subscription.unsubscribe();
  }, [refetch, supabase.auth]);

  return (
    <SessionContext.Provider
      value={{
        data: session,
        status,
        refetch,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
