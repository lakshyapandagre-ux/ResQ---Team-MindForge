import { createContext, useContext, useEffect, useState, useRef } from "react";
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
  avatar_url?: string;
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
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
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
  resetPassword: async () => { },
  updatePassword: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const resolvingRef = useRef(false); // Ref to prevent double-fetching

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

      // Create a race between the session fetch and a 5-second timeout
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Auth Init Timeout")), 5000)
      );

      const {
        data: { session },
      } = (await Promise.race([sessionPromise, timeoutPromise])) as any;

      if (session?.user) {
        setUser(session.user);
        await loadProfile(session.user);
      }
    } catch (err: any) {
      if (err.message === "Auth Init Timeout") {
        console.warn("[Auth] Initialization timed out - proceeding as logged out.");
      } else if (!err?.message?.includes('AbortError') && err?.name !== 'AbortError') {
        console.error("[Auth] Init error", err);
      }
    } finally {
      if (resolvingRef.current) {
        // If profile load is still running in background, we might want to respect it, 
        // but for initAuth, we want to unblock UI.
        // We do nothing special, assuming loadProfile handles its own state or finishes later.
      }
      setLoading(false);
    }
  };

  const loadProfile = async (user: any, retries = 3): Promise<void> => {
    if (resolvingRef.current) {
      console.log("[Auth] Profile load already in progress, skipping.");
      return;
    }
    resolvingRef.current = true;

    setProfileError(null);
    try {
      console.log(`[Auth] Loading profile... (Attempts left: ${retries})`);

      // Add a small delay if retrying
      if (retries < 3) await new Promise(r => setTimeout(r, 1000));

      // Race condition to prevent hanging
      const fetchPromise = db.getOrCreateProfile(user);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Profile Load Timeout")), 8000)
      );

      const data = await Promise.race([fetchPromise, timeoutPromise]);

      setProfile(data as Profile);
      console.log("[Auth] Profile loaded:", data);

    } catch (err: any) {
      // Ignore specific AbortError logging
      if (!err?.message?.includes('AbortError') && err.message !== "Profile Load Timeout") {
        console.error("[Auth] Profile load failed:", err);
      }

      // Retry logic
      if (retries > 0) {
        // Log retry attempt for debugging
        if (err?.name === 'AbortError' || err.message === "Profile Load Timeout") {
          console.log(`[Auth] Retrying fetch... (${retries})`);
        }
        resolvingRef.current = false; // Reset lock for retry
        return loadProfile(user, retries - 1);
      }

      // FALLBACK: If all retries fail, use a temporary profile to allow access
      console.warn("[Auth] Using fallback profile due to load failure.");
      const fallbackProfile: Profile = {
        id: user.id,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Citizen',
        email: user.email || '',
        role: 'citizen',
        city: 'Indore',
        status: 'active',
        points: 0,
        reports_count: 0,
        resolved_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setProfile(fallbackProfile);
      setProfileError(null); // Clear error since we are "handling" it via fallback

    } finally {
      resolvingRef.current = false;
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
    try {
      await supabase.auth.signOut();
    } catch (error: any) {
      // Ignore AbortError which happens if we sign out while other requests are pending
      if (error?.name === 'AbortError' || error?.message?.includes('AbortError')) {
        console.log("[Auth] Sign out request aborted pending fetches (normal behavior)");
      } else {
        console.error("[Auth] Sign out error:", error);
      }
    } finally {
      // Always clear local state
      setUser(null);
      setProfile(null);
      setProfileError(null);
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    if (error) throw error;
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, profileError, signIn, signUp, signOut, refreshProfile, resetPassword, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
