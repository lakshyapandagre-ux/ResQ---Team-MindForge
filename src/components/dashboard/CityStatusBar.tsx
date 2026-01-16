import { useState, useEffect } from "react";
import { ShieldCheck, AlertCircle, Siren, Timer } from "lucide-react";
import { StatusMetricCard } from "./StatusMetricCard";
import { supabase } from "@/lib/supabase";

interface CityStats {
    safeZones: number;
    activeIssues: number;
    emergencies: number;
    avgResponseMin: number;
}

export function CityStatusBar() {
    const [stats, setStats] = useState<CityStats>({
        safeZones: 98,
        activeIssues: 0,
        emergencies: 0,
        avgResponseMin: 12
    });

    useEffect(() => {
        const fetchStats = async () => {
            // 1. Active Issues
            const { count: issueCount } = await supabase
                .from('complaints')
                .select('*', { count: 'exact', head: true })
                .neq('status', 'Resolved');

            // 2. Active Emergencies
            const { count: emergencyCount } = await supabase
                .from('emergencies')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'active');

            setStats(prev => ({
                ...prev,
                activeIssues: issueCount || 0,
                emergencies: emergencyCount || 0,
                // Simple calculation for safe zones based on issues
                safeZones: Math.max(80, 100 - ((issueCount || 0) * 0.5)),
            }));
        };

        fetchStats();

        // Realtime Subscription
        const channel = supabase
            .channel('city-stats')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'complaints' }, () => fetchStats())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'emergencies' }, () => fetchStats())
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <div className="relative w-full overflow-hidden rounded-[2.5rem] shadow-2xl shadow-emerald-900/20 group md:min-h-[200px]">
            {/* Background Image Parallax/Static */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&auto=format&fit=crop&q=80"
                    alt="City Skyline"
                    className="h-full w-full object-cover transition-transform duration-[20s] ease-linear group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-teal-900/95 via-emerald-900/80 to-slate-900/50 mix-blend-multiply" />
                <div className="absolute inset-0 bg-black/20" /> {/* Extra darken for text contrast */}
            </div>

            {/* Content Container */}
            <div className="relative z-10 p-5 md:p-8 flex flex-col justify-center h-full">

                {/* Header (Optional, small status indicator) */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-bold uppercase tracking-widest text-emerald-100/90 drop-shadow-md">
                            Live City Status
                        </span>
                    </div>
                    <div className="text-[10px] bg-white/10 px-2 py-1 rounded backdrop-blur text-white/80 font-mono">
                        UPDATED NOW
                    </div>
                </div>

                {/* Metrics Grid */}
                {/* Mobile: Horizontal Scroll (snap-x), Tablet: 2x2, Desktop: 1x4 */}
                <div className="flex overflow-x-auto pb-4 md:pb-0 gap-3 md:gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 snap-x snap-mandatory hide-scrollbar">

                    {/* 1. Safe Zones */}
                    <div className="min-w-[85%] md:min-w-0 snap-center">
                        <StatusMetricCard
                            icon={ShieldCheck}
                            value={stats.safeZones}
                            label="Safe Zones"
                            subLabel="Operational"
                            suffix="%"
                            color="text-emerald-400"
                            bgColor="bg-emerald-400/20"
                        />
                    </div>

                    {/* 2. Active Issues */}
                    <div className="min-w-[85%] md:min-w-0 snap-center">
                        <StatusMetricCard
                            icon={AlertCircle}
                            value={stats.activeIssues}
                            label="Active Issues"
                            subLabel="Being Resolved"
                            color="text-amber-400"
                            bgColor="bg-amber-400/20"
                        />
                    </div>

                    {/* 3. Emergency Alerts */}
                    <div className="min-w-[85%] md:min-w-0 snap-center">
                        <StatusMetricCard
                            icon={Siren}
                            value={stats.emergencies}
                            label="Emergencies"
                            subLabel={stats.emergencies > 0 ? "Action Required" : "All Clear"}
                            isCritical={stats.emergencies > 0}
                            color={stats.emergencies > 0 ? "text-red-500" : "text-slate-300"}
                            bgColor={stats.emergencies > 0 ? "bg-red-500/20" : "bg-white/10"}
                        />
                    </div>

                    {/* 4. Response Time */}
                    <div className="min-w-[85%] md:min-w-0 snap-center">
                        <StatusMetricCard
                            icon={Timer}
                            value={stats.avgResponseMin}
                            label="Avg Response"
                            subLabel="Minutes"
                            suffix="m"
                            color="text-cyan-400"
                            bgColor="bg-cyan-400/20"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}
