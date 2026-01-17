import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { db } from "@/lib/db";

// Use the Profile type from db.ts or define a compatible one here.
// To avoid circular dependencies if we imported from db, we redefine it slightly or import if possible.
// For now, let's make it fully compatible with db.ts Profile.

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "citizen" | "volunteer" | "admin";
  city: string;
  status: string;
  points: number;
  reports_count: number;
  resolved_count: number;
  area_id?: string;
  language?: string;
  notification_preferences?: any;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

interface AuthContextType {
  user: any;
  profile: Profile | null;
  loading: boolean;
  profileError: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, data?: any) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  profileError: null,
  signIn: async () => { },
  signUp: async () => { },
  signOut: async () => { },
  refreshProfile: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("[Auth] State change:", event);

        if (session?.user) {
          setUser(session.user);
          await loadProfile(session.user);
        } else {
          setUser(null);
          setProfile(null);
          setProfileError(null);
        }

        setLoading(false);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const initAuth = async () => {
    try {
      console.log("[Auth] Init started");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        await loadProfile(session.user);
      }
    } catch (err) {
      console.error("[Auth] Init error", err);
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async (user: any, retries = 3): Promise<void> => {
    setProfileError(null);
    try {
      console.log(`[Auth] Loading profile... (Attempts left: ${retries})`);

      // Add a small delay if retrying
      if (retries < 3) await new Promise(r => setTimeout(r, 1000));

      const data = await db.getOrCreateProfile(user);

      setProfile(data as Profile);
      console.log("[Auth] Profile loaded:", data);

    } catch (err: any) {
      console.error("[Auth] Profile load failed:", err);
      // Retry logic
      if (retries > 0) {
        return loadProfile(user, retries - 1);
      }
      setProfileError(err.message || "Failed to load profile");
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // Auth state listener will handle the rest (user set, profile load)
  };

  const signUp = async (email: string, password: string, metaData?: any) => {
    // We explicitly set options to prevent auto-login loops if confirmation is needed
    // But currently Supabase behaves based on project config.
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metaData,
        // Redirect to a specific confirmation page or login?
        // User requested: "Confirmation link should redirect to localhost in dev / vercel in prod"
        // We use window.location.origin to get the current domain dynamically
        emailRedirectTo: `${window.location.origin}/login`
      }
    });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, profileError, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
