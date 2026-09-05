import { useSyncExternalStore } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthSnapshot = { session: Session | null; loading: boolean };

let snapshot: AuthSnapshot = { session: null, loading: true };
let started = false;
const listeners = new Set<() => void>();

function publish(next: AuthSnapshot) {
  snapshot = next;
  listeners.forEach((listener) => listener());
}

function startAuth() {
  if (started || typeof window === "undefined") return;
  started = true;

  supabase.auth.onAuthStateChange((_event, nextSession) => {
    publish({ session: nextSession, loading: false });
  });

  void supabase.auth.getSession().then(({ data, error }) => {
    publish({ session: error ? null : data.session, loading: false });
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  startAuth();
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return snapshot;
}

const serverSnapshot: AuthSnapshot = { session: null, loading: true };

export function useAuth() {
  const auth = useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
  return { ...auth, user: auth.session?.user ?? null };
}
