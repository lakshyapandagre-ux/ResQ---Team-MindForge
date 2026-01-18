
import { useState, useEffect } from "react";
import { ShieldCheck, AlertCircle, Siren, Timer, Activity } from "lucide-react";
import { StatusMetricCard } from "./StatusMetricCard";
import { StatCardSkeleton } from "@/components/skeletons/StatCardSkeleton";
import { supabase } from "@/lib/supabase";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";

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

    const [loading, setLoading] = useState(true);

    // Embla Carousel Hook
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", () => setSelectedIndex(emblaApi.selectedScrollSnap()));
    }, [emblaApi]);

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
            setLoading(false);
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

    const slides = [
        {
            id: 'safe-zones',
            component: (
                <StatusMetricCard
                    icon={ShieldCheck}
                    value={stats.safeZones}
                    label="Safety Score"
                    subLabel="City-wide"
                    suffix="%"
                    color="text-emerald-400"
                    bgColor="bg-emerald-400/20"
                />
            )
        },
        {
            id: 'issues',
            component: (
                <StatusMetricCard
                    icon={AlertCircle}
                    value={stats.activeIssues}
                    label="Active Issues"
                    subLabel="Being Resolved"
                    color="text-amber-400"
                    bgColor="bg-amber-400/20"
                />
            )
        },
        {
            id: 'emergency',
            component: (
                <StatusMetricCard
                    icon={Siren}
                    value={stats.emergencies}
                    label="Emergencies"
                    subLabel={stats.emergencies > 0 ? "Action Required" : "All Clear"}
                    isCritical={stats.emergencies > 0}
                    color={stats.emergencies > 0 ? "text-red-500" : "text-green-400"}
                    bgColor={stats.emergencies > 0 ? "bg-red-500/20" : "bg-green-400/20"}
                />
            )
        },
        {
            id: 'response',
            component: (
                <StatusMetricCard
                    icon={Timer}
                    value={stats.avgResponseMin}
                    label="Avg Response"
                    subLabel="Minutes"
                    suffix="m"
                    color="text-cyan-400"
                    bgColor="bg-cyan-400/20"
                />
            )
        }
    ];

    return (
        <div className="relative w-full overflow-hidden rounded-[2.5rem] shadow-xl group md:min-h-[220px] transition-all duration-500 hover:shadow-2xl">
            {/* Lively Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&auto=format&fit=crop&q=80"
                    alt="City Skyline"
                    className="h-full w-full object-cover transition-transform duration-[30s] ease-linear scale-100 group-hover:scale-110"
                />

                {/* Dynamic Gradient Overlay */}
                <div className={cn(
                    "absolute inset-0 transition-colors duration-1000 mix-blend-multiply",
                    stats.emergencies > 0
                        ? "bg-gradient-to-r from-red-900/90 to-slate-900/80"
                        : "bg-gradient-to-r from-teal-900/95 via-emerald-900/80 to-slate-900/50"
                )} />
                <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 px-6 py-6 flex flex-col justify-center h-full">

                {/* Header Row */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", stats.emergencies > 0 ? 'bg-red-400' : 'bg-emerald-400')}></span>
                            <span className={cn("relative inline-flex rounded-full h-3 w-3", stats.emergencies > 0 ? 'bg-red-500' : 'bg-emerald-500')}></span>
                        </span>
                        <span className="text-xs font-extrabold uppercase tracking-widest text-white/90 drop-shadow-sm">
                            Live Status
                        </span>
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex gap-1.5">
                        {slides.map((_, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "h-1.5 rounded-full transition-all duration-300 shadow-sm",
                                    idx === selectedIndex ? "w-4 bg-white" : "w-1.5 bg-white/30"
                                )}
                            />
                        ))}
                    </div>
                </div>

                {/* Carousel */}
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex -ml-4">
                        {slides.map((slide) => (
                            <div key={slide.id} className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] pl-4">
                                <div className="h-full transform transition-all duration-300 hover:-translate-y-1">
                                    {loading ? <StatCardSkeleton /> : slide.component}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4 text-[10px] text-white/60 font-medium text-center md:text-left flex items-center gap-1.5">
                    <Activity className="h-3 w-3" />
                    Updates automatically in real-time
                </div>
            </div>
        </div>
    );
}
