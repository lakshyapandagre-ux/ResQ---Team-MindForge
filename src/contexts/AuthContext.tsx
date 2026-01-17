import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => { },
  refreshProfile: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

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

  const loadProfile = async (user: any) => {
    try {
      console.log("[Auth] Loading profile...");

      // Create a timeout promise that rejects after 10 seconds
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Profile load timed out")), 10000)
      );

      // Race the DB query against the timeout
      const { data, error } = await Promise.race([
        supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle(),
        timeoutPromise
      ]) as any;

      if (error) {
        throw error;
      }

      if (!data) {
        console.warn("[Auth] Profile missing, creating...");

        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            email: user.email,
            name: user.email?.split('@')[0] || 'User', // Fallback name
            role: "citizen",
            city: "Indore",
            status: "active",
            points: 0,
            reports_count: 0,
            resolved_count: 0
          })
          .select()
          .single();

        if (insertError) throw insertError;

        setProfile(newProfile as Profile);
        console.log("[Auth] Profile created:", newProfile);
      } else {
        setProfile(data as Profile);
        console.log("[Auth] Profile loaded:", data);
      }
    } catch (err) {
      console.error("[Auth] Profile load failed:", err);
      // Ensure we don't block the app if profile fails
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
