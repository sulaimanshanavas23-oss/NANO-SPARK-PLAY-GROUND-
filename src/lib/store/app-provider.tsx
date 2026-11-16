"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseClient, isSupabaseConfigured } from "@/src/lib/supabase/client";

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  provider: "email" | "google" | "demo";
  createdAt: string;
};

export type ActivityEntry = {
  id: string;
  kind: "lab" | "tool";
  refId: string;
  at: string;
};

export type ProgressEntry = {
  visits: number;
  percent: number;
  lastVisitedAt: string;
};

export type Favorites = {
  labs: string[];
  tools: string[];
};

type AuthResult = { error: string | null; message?: string };

type AppContextValue = {
  hydrated: boolean;
  authReady: boolean;
  profile: UserProfile | null;
  cloudEnabled: boolean;
  favorites: Favorites;
  recent: ActivityEntry[];
  progress: Record<string, ProgressEntry>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (name: string, email: string, password: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  signOut: () => Promise<void>;
  toggleFavorite: (kind: "lab" | "tool", id: string) => void;
  isFavorite: (kind: "lab" | "tool", id: string) => boolean;
  recordLabVisit: (labId: string) => void;
  recordToolView: (toolId: string) => void;
};

const STORAGE = {
  profile: "nano.profile.v1",
  favorites: "nano.favorites.v1",
  recent: "nano.recent.v1",
  progress: "nano.progress.v1",
  names: "nano.demo.names.v1",
};

const emptyFavorites: Favorites = { labs: [], tools: [] };

const AppContext = createContext<AppContextValue | null>(null);

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage may be unavailable in private mode */
  }
}

function profileFromUser(user: User): UserProfile {
  const provider =
    user.app_metadata?.provider === "google" ? "google" : "email";
  const name =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Nano Student";
  return {
    id: user.id,
    email: user.email ?? "",
    name,
    provider,
    createdAt: user.created_at ?? new Date().toISOString(),
  };
}

function displayNameFromEmail(email: string) {
  const raw = email.split("@")[0] ?? "student";
  return raw
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [favorites, setFavorites] = useState<Favorites>(emptyFavorites);
  const [recent, setRecent] = useState<ActivityEntry[]>([]);
  const [progress, setProgress] = useState<Record<string, ProgressEntry>>({});
  const cloudEnabled = isSupabaseConfigured;
  const supabase = useRef(getSupabaseClient());
  const profileRef = useRef<UserProfile | null>(null);
  const progressRef = useRef<Record<string, ProgressEntry>>({});
  const favoritesRef = useRef<Favorites>(emptyFavorites);

  profileRef.current = profile;
  progressRef.current = progress;
  favoritesRef.current = favorites;

  useEffect(() => {
    setFavorites(readJSON<Favorites>(STORAGE.favorites, emptyFavorites));
    setRecent(readJSON<ActivityEntry[]>(STORAGE.recent, []));
    setProgress(readJSON<Record<string, ProgressEntry>>(STORAGE.progress, {}));
    setProfile(readJSON<UserProfile | null>(STORAGE.profile, null));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeJSON(STORAGE.favorites, favorites);
  }, [favorites, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    writeJSON(STORAGE.recent, recent);
  }, [recent, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    writeJSON(STORAGE.progress, progress);
  }, [progress, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (profile) writeJSON(STORAGE.profile, profile);
    else window.localStorage.removeItem(STORAGE.profile);
  }, [profile, hydrated]);

  useEffect(() => {
    const client = supabase.current;
    if (!client) {
      setAuthReady(true);
      return;
    }

    let active = true;

    client.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session?.user) {
        setProfile(profileFromUser(data.session.user));
      }
      setAuthReady(true);
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setProfile(profileFromUser(session.user));
      else setProfile(null);
      setAuthReady(true);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const client = supabase.current;
    const current = profile;
    if (!client || !current || current.provider === "demo") return;

    let active = true;
    (async () => {
      try {
        const [favRes, actRes, progRes] = await Promise.all([
          client
            .from("favorites")
            .select("item_type,item_id")
            .eq("user_id", current.id),
          client
            .from("activities")
            .select("id,item_type,item_id,created_at")
            .eq("user_id", current.id)
            .order("created_at", { ascending: false })
            .limit(20),
          client
            .from("learning_progress")
            .select("lab_id,percent,visits,last_visited_at")
            .eq("user_id", current.id),
        ]);
        if (!active) return;
        if (favRes.data) {
          const labs = favRes.data
            .filter((row) => row.item_type === "lab")
            .map((row) => row.item_id);
          const tools = favRes.data
            .filter((row) => row.item_type === "tool")
            .map((row) => row.item_id);
          setFavorites((current) => ({
            labs: Array.from(new Set([...current.labs, ...labs])),
            tools: Array.from(new Set([...current.tools, ...tools])),
          }));
        }
        if (actRes.data) {
          const mapped = actRes.data.map((row) => ({
            id: row.id,
            kind: row.item_type,
            refId: row.item_id,
            at: row.created_at,
          })) as ActivityEntry[];
          setRecent((current) => {
            const merged = [...mapped];
            current.forEach((entry) => {
              if (!merged.some((item) => item.id === entry.id)) merged.push(entry);
            });
            return merged
              .sort((a, b) => +new Date(b.at) - +new Date(a.at))
              .slice(0, 20);
          });
        }
        if (progRes.data) {
          setProgress((current) => {
            const next = { ...current };
            progRes.data.forEach((row) => {
              const existing = next[row.lab_id];
              if (!existing || row.visits > existing.visits) {
                next[row.lab_id] = {
                  visits: row.visits,
                  percent: row.percent,
                  lastVisitedAt: row.last_visited_at,
                };
              }
            });
            return next;
          });
        }
      } catch {
        /* Cloud sync is optional; local state remains the source of truth offline. */
      }
    })();

    return () => {
      active = false;
    };
  }, [profile]);

  const pushActivity = useCallback((kind: "lab" | "tool", refId: string) => {
    setRecent((current) => {
      const entry: ActivityEntry = {
        id: `${kind}-${refId}-${Date.now()}`,
        kind,
        refId,
        at: new Date().toISOString(),
      };
      const deduped = current.filter(
        (item) => !(item.kind === kind && item.refId === refId),
      );
      return [entry, ...deduped].slice(0, 20);
    });
  }, []);

  const recordLabVisit = useCallback(
    (labId: string) => {
      const now = new Date().toISOString();
      const existing = progressRef.current[labId];
      const visits = (existing?.visits ?? 0) + 1;
      const percent = Math.min(90, 25 + (visits - 1) * 15);
      const entry: ProgressEntry = { visits, percent, lastVisitedAt: now };
      progressRef.current = { ...progressRef.current, [labId]: entry };
      setProgress(progressRef.current);
      pushActivity("lab", labId);

      const client = supabase.current;
      const current = profileRef.current;
      if (client && current && current.provider !== "demo") {
        void client
          .from("learning_progress")
          .upsert(
            {
              user_id: current.id,
              lab_id: labId,
              visits,
              percent,
              last_visited_at: now,
            },
            { onConflict: "user_id,lab_id" },
          )
          .then(() => undefined);
        void client
          .from("activities")
          .insert({ user_id: current.id, item_type: "lab", item_id: labId })
          .then(() => undefined);
      }
    },
    [pushActivity],
  );

  const recordToolView = useCallback(
    (toolId: string) => {
      pushActivity("tool", toolId);
      const client = supabase.current;
      const current = profileRef.current;
      if (client && current && current.provider !== "demo") {
        void client
          .from("activities")
          .insert({ user_id: current.id, item_type: "tool", item_id: toolId })
          .then(() => undefined);
      }
    },
    [pushActivity],
  );

  const toggleFavorite = useCallback(
    (kind: "lab" | "tool", id: string) => {
      const key = kind === "lab" ? "labs" : "tools";
      const currentFavorites = favoritesRef.current;
      const list = currentFavorites[key];
      const exists = list.includes(id);
      const next: Favorites = {
        ...currentFavorites,
        [key]: exists ? list.filter((item) => item !== id) : [...list, id],
      };
      favoritesRef.current = next;
      setFavorites(next);

      const client = supabase.current;
      const currentProfile = profileRef.current;
      if (!client || !currentProfile || currentProfile.provider === "demo") {
        return;
      }
      if (!exists) {
        void client
          .from("favorites")
          .upsert(
            { user_id: currentProfile.id, item_type: kind, item_id: id },
            { onConflict: "user_id,item_type,item_id" },
          )
          .then(() => undefined);
      } else {
        void client
          .from("favorites")
          .delete()
          .match({ user_id: currentProfile.id, item_type: kind, item_id: id })
          .then(() => undefined);
      }
    },
    [],
  );

  const isFavorite = useCallback(
    (kind: "lab" | "tool", id: string) =>
      (kind === "lab" ? favorites.labs : favorites.tools).includes(id),
    [favorites],
  );

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const cleanEmail = email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return { error: "Enter a valid email address." };
      }
      if (password.length < 6) {
        return { error: "Password must be at least 6 characters." };
      }

      const client = supabase.current;
      if (client) {
        const { data, error } = await client.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (error) return { error: error.message };
        if (data.user) setProfile(profileFromUser(data.user));
        return { error: null };
      }

      const names = readJSON<Record<string, string>>(STORAGE.names, {});
      setProfile({
        id: `demo-${cleanEmail}`,
        email: cleanEmail,
        name: names[cleanEmail] || displayNameFromEmail(cleanEmail),
        provider: "demo",
        createdAt: new Date().toISOString(),
      });
      return { error: null };
    },
    [],
  );

  const signUp = useCallback(
    async (
      name: string,
      email: string,
      password: string,
    ): Promise<AuthResult> => {
      const cleanEmail = email.trim().toLowerCase();
      if (name.trim().length < 2) return { error: "Enter your name." };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return { error: "Enter a valid email address." };
      }
      if (password.length < 6) {
        return { error: "Password must be at least 6 characters." };
      }

      const client = supabase.current;
      if (client) {
        const { data, error } = await client.auth.signUp({
          email: cleanEmail,
          password,
          options: { data: { full_name: name.trim() } },
        });
        if (error) return { error: error.message };
        if (!data.session) {
          return {
            error: null,
            message:
              "Account created. Check your inbox to confirm your email, then sign in.",
          };
        }
        if (data.user) setProfile(profileFromUser(data.user));
        return { error: null };
      }

      const names = readJSON<Record<string, string>>(STORAGE.names, {});
      names[cleanEmail] = name.trim();
      writeJSON(STORAGE.names, names);
      setProfile({
        id: `demo-${cleanEmail}`,
        email: cleanEmail,
        name: name.trim(),
        provider: "demo",
        createdAt: new Date().toISOString(),
      });
      return { error: null };
    },
    [],
  );

  const signInWithGoogle = useCallback(async (): Promise<AuthResult> => {
    const client = supabase.current;
    if (client) {
      const { error } = await client.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
      if (error) return { error: error.message };
      return { error: null, message: "Redirecting to Google…" };
    }

    setProfile({
      id: `demo-google-${Date.now()}`,
      email: "student@nanospark.demo",
      name: "Nano Student",
      provider: "google",
      createdAt: new Date().toISOString(),
    });
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    const client = supabase.current;
    if (client) {
      await client.auth.signOut();
    }
    setProfile(null);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      hydrated,
      authReady,
      profile,
      cloudEnabled,
      favorites,
      recent,
      progress,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      toggleFavorite,
      isFavorite,
      recordLabVisit,
      recordToolView,
    }),
    [
      hydrated,
      authReady,
      profile,
      cloudEnabled,
      favorites,
      recent,
      progress,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      toggleFavorite,
      isFavorite,
      recordLabVisit,
      recordToolView,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
}
