import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    allowedRoles?: ('citizen' | 'volunteer' | 'admin')[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { user, profile, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
        );
    }

    // No user -> redirect to login
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // User exists but no profile -> error (should not happen with proper AuthContext)
    if (!profile) {
        console.error('[ProtectedRoute] User exists but profile is missing');
        return <Navigate to="/login" replace />;
    }

    // Check role-based access
    if (allowedRoles && !allowedRoles.includes(profile.role as any)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}
