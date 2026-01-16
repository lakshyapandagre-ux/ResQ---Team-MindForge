import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { db, type Profile } from "@/lib/db";


interface AuthContextType {
    session: Session | null;
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    isAdmin: boolean;
    isVolunteer: boolean;
    refreshProfile: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    profile: null,
    loading: true,
    isAdmin: false,
    isVolunteer: false,
    refreshProfile: async () => { },
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshProfile = async () => {
        if (!user) return;
        try {
            const data = await db.getOrCreateProfile(user);
            setProfile(data);
            if (import.meta.env.DEV) {
                console.log('[Auth] Profile refreshed:', data);
            }
        } catch (error) {
            console.error("[Auth] Error refreshing profile:", error);
            // Don't force logout - just log error
        }
    };

    useEffect(() => {
        let mounted = true;

        // Safety timeout to prevent infinite loading
        const safetyTimer = setTimeout(() => {
            if (mounted && loading) {
                console.warn("[Auth] Safety timeout triggered - forcing app load");
                setLoading(false);
            }
        }, 5000);

        const init = async () => {
            console.log("[Auth] Init started");
            try {
                const { data: { session } } = await supabase.auth.getSession();
                console.log("[Auth] Session fetched:", session ? "Found" : "None");

                if (!mounted) return;

                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    console.log("[Auth] Fetching profile...");
                    try {
                        const p = await db.getOrCreateProfile(session.user);
                        console.log("[Auth] Profile fetched:", p ? "Success" : "Failed");
                        if (mounted) setProfile(p);
                    } catch (e: any) {
                        console.error("[Auth] Profile fetch failed:", e);
                    }
                }
            } catch (err: any) {
                const isAbort = err.name === 'AbortError' ||
                    err.message?.includes('AbortError') ||
                    JSON.stringify(err).includes('AbortError');

                if (!isAbort) {
                    console.error("[Auth] Init error:", err);
                }

                // Fallback profile to prevent lockout
                if (session?.user && !profile) {
                    console.warn("[Auth] Using fallback profile due to error");
                    setProfile({
                        id: session.user.id,
                        name: session.user.email?.split('@')[0] || 'User',
                        email: session.user.email || '',
                        role: 'citizen',
                        status: 'active',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        city: 'Indore',
                        points: 0,
                        reports_count: 0,
                        resolved_count: 0
                    });
                }
            } finally {
                console.log("[Auth] Init finished");
                if (mounted) setLoading(false);
            }
        };

        init();

        const { data: listener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!mounted) return;
                console.log(`[Auth] Auth state changed: ${event}`);

                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    try {
                        const p = await db.getOrCreateProfile(session.user);
                        if (mounted) setProfile(p);
                    } catch (e: any) {
                        // Check for AbortError in various formats (standard Error or Supabase error)
                        const isAbort = e.name === 'AbortError' ||
                            e.message?.includes('AbortError') ||
                            JSON.stringify(e).includes('AbortError');

                        if (!isAbort) {
                            console.error("[Auth] Profile refresh error:", e);
                        }

                        // Fallback profile
                        setProfile({
                            id: session.user.id,
                            name: session.user.email?.split('@')[0] || 'User',
                            email: session.user.email || '',
                            role: 'citizen',
                            status: 'active',
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                            city: 'Indore',
                            points: 0,
                            reports_count: 0,
                            resolved_count: 0
                        });
                    }
                } else {
                    if (mounted) setProfile(null);
                }

                if (mounted) setLoading(false);
            }
        );

        return () => {
            mounted = false;
            clearTimeout(safetyTimer);
            listener.subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        if (import.meta.env.DEV) {
            console.log('[Auth] Signing out');
        }
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setProfile(null);
    };

    const isAdmin = profile?.role === 'admin';
    const isVolunteer = profile?.role === 'volunteer' || profile?.role === 'admin';

    return (
        <AuthContext.Provider value={{
            session,
            user,
            profile,
            loading,
            isAdmin,
            isVolunteer,
            refreshProfile,
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    );
}
