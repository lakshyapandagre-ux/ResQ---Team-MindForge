
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { db } from "@/lib/db";
import { Calendar, AlertTriangle, Search, HeartHandshake, ChevronRight, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CarouselCardSkeleton } from "@/components/skeletons/CarouselCardSkeleton";

interface CategoryData {
    id: string;
    title: string;
    count: number | null;
    description: string;
    icon: any;
    color: string;
    // bgGradient: string; // Replaced by more complex styling
    bgImage: string;
    actionLabel: string;
    route: string;
    accentColor: string;
}

export function NearbyCivicCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: false, dragFree: true });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();

    const { data: stats = { events: 0, missing: 0, complaints: 0, volunteer: 0 }, isLoading: loading } = useQuery({
        queryKey: ['civic-pulse'],
        queryFn: async () => {
            // Fetch real data counts with safe fallbacks
            const [events, missing, complaints] = await Promise.all([
                db.getEvents().catch(() => []),
                db.getMissingReports().catch(() => []),
                db.getComplaints('latest').catch(() => [])
            ]);

            return {
                events: events.length,
                missing: missing.length,
                complaints: complaints.length,
                volunteer: 12 // Simulated 'active' count for now
            };
        }
    });

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", () => {
            setSelectedIndex(emblaApi.selectedScrollSnap());
        });
    }, [emblaApi]);

    const scrollTo = (index: number) => emblaApi && emblaApi.scrollTo(index);

    const categories: CategoryData[] = [
        {
            id: 'events',
            title: 'Events Near You',
            count: stats.events,
            description: 'Community drives, workshops & meetups happening this week.',
            icon: Calendar,
            color: 'text-indigo-600 dark:text-indigo-400',
            bgImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&auto=format&fit=crop&q=60',
            accentColor: 'bg-indigo-500',
            actionLabel: 'View Events',
            route: '/events'
        },
        {
            id: 'missing',
            title: 'Missing Reports',
            count: stats.missing,
            description: 'Help locate missing neighbors. Your eyes can save a life.',
            icon: Search,
            color: 'text-amber-600 dark:text-amber-400',
            bgImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&auto=format&fit=crop&q=60',
            accentColor: 'bg-amber-500',
            actionLabel: 'Help Search',
            route: '/missing'
        },
        {
            id: 'complaints',
            title: 'Active Issues',
            count: stats.complaints,
            description: 'Local problems reported nearby. Validate detailed reports.',
            icon: AlertTriangle,
            color: 'text-rose-600 dark:text-rose-400',
            bgImage: 'https://images.unsplash.com/photo-1542304229-8cb31b64be63?w=500&auto=format&fit=crop&q=60',
            accentColor: 'bg-rose-500',
            actionLabel: 'View Issues',
            route: '/complaints'
        },
        {
            id: 'volunteer',
            title: 'Squad Requests',
            count: stats.volunteer,
            description: 'Neighbors need help with groceries, repairs & emergency support.',
            icon: HeartHandshake,
            color: 'text-emerald-600 dark:text-emerald-400',
            bgImage: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=500&auto=format&fit=crop&q=60',
            accentColor: 'bg-emerald-500',
            actionLabel: 'Join Squad',
            route: '/join-squad'
        }
    ];

    if (loading) {
        return (
            <section className="w-full space-y-6 py-2">
                <div className="flex items-center justify-between px-1 mb-2">
                    <div className="space-y-1">
                        <div className="h-6 w-32 bg-slate-100 dark:bg-slate-800 rounded-md animate-pulse" />
                        <div className="h-3 w-20 bg-slate-50 dark:bg-slate-800/50 rounded-md animate-pulse" />
                    </div>
                </div>
                {/* Skeleton Carousel */}
                <div className="overflow-hidden py-2" ref={emblaRef}>
                    <div className="flex -ml-5 touch-pan-y py-2 pl-1">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_35%] pl-5">
                                <CarouselCardSkeleton />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full space-y-6 py-2">
            {/* Header with animated indicator */}
            <div className="flex items-center justify-between px-1">
                <div className="space-y-1">
                    <h3 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        Civic Pulse
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
                        </span>
                    </h3>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Happening nearby
                    </p>
                </div>

                {/* Styled Pagination Indicators */}
                <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-full">
                    {categories.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => scrollTo(idx)}
                            className={cn(
                                "h-1.5 rounded-full transition-all duration-500 ease-out",
                                selectedIndex === idx
                                    ? "w-6 bg-slate-800 dark:bg-teal-400"
                                    : "w-1.5 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400"
                            )}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Carousel Container */}
            <div className="overflow-hidden py-2" ref={emblaRef}>
                <div className="flex -ml-5 touch-pan-y py-2 pl-1">
                    {categories.map((cat, idx) => (
                        <div key={cat.id} className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_35%] pl-5">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                whileHover={{ y: -5, scale: 1.02 }}
                                className="group relative h-full overflow-hidden rounded-[2rem] bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800"
                            >
                                {/* Background Image with Gradient Overlay */}
                                <div className="absolute inset-0 z-0">
                                    <img
                                        src={cat.bgImage}
                                        alt=""
                                        className="h-full w-full object-cover opacity-10 dark:opacity-[0.07] group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-br from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 dark:to-transparent" />
                                    {/* Accent Blob */}
                                    <div className={cn("absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20", cat.accentColor)} />
                                </div>

                                {/* Content */}
                                <div className="relative z-10 p-6 flex flex-col h-full">

                                    {/* Top Row: Icon & Count Badge */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={cn(
                                            "p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700 group-hover:rotate-6 transition-transform",
                                            cat.color
                                        )}>
                                            <cat.icon className="h-6 w-6" />
                                        </div>

                                        {cat.count !== null && (
                                            <div className="flex flex-col items-end">
                                                <span className={cn(
                                                    "px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1",
                                                    cat.accentColor
                                                )}>
                                                    <Activity className="h-3 w-3" />
                                                    {cat.count > 0 ? `${cat.count} Active` : 'Quiet'}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Text Info */}
                                    <div className="mb-6 space-y-2">
                                        <h4 className="text-xl font-bold text-slate-800 dark:text-slate-50 group-hover:text-teal-600 transition-colors">
                                            {cat.title}
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                            {cat.description}
                                        </p>
                                    </div>

                                    {/* Action Area */}
                                    <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
                                        {/* <span className="text-xs font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">
                                            Tap to view
                                        </span> */}

                                        <Button
                                            onClick={() => navigate(cat.route)}
                                            className={cn(
                                                "w-full rounded-xl backdrop-blur-md transition-all shadow-none border-0",
                                                "bg-slate-50 text-slate-900 hover:bg-slate-100 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700",
                                                "group-hover:bg-teal-50 dark:group-hover:bg-teal-900/20 group-hover:text-teal-700 dark:group-hover:text-teal-300"
                                            )}
                                        >
                                            <span className="font-bold mr-auto">{cat.actionLabel}</span>
                                            <ChevronRight className="h-4 w-4 opacity-50 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
