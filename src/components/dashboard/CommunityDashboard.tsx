import { useRef, useEffect, useState } from "react";
import {
    AlertTriangle,
    Asterisk,
    Calendar,
    ChevronRight,
    CloudLightning,
    Construction,
    Megaphone,
    Plus,
    Users,
    TrendingUp,
    Briefcase,
    MapPin,
    Clock
} from "lucide-react";
import { useReports } from "@/hooks/use-reports";
import { useVolunteers } from "@/hooks/use-volunteers";
import SplitText from "@/components/SplitText";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

// --- Components for the new design ---

function HeroCard() {
    const navigate = useNavigate();
    return (
        <div className="relative w-full overflow-hidden rounded-[2.5rem] shadow-xl shadow-emerald-900/20 group">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&auto=format&fit=crop&q=80"
                    alt="City Skyline"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-teal-900/90 via-emerald-800/80 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col gap-6 p-8 text-white">
                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
                    <span className="text-xs font-medium uppercase tracking-wider text-emerald-100/90 bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm">System Live</span>
                </div>

                <div className="space-y-2 mt-2">
                    <h2 className="text-3xl font-bold leading-tight md:text-4xl text-white drop-shadow-sm">Stay Connected</h2>
                    <p className="max-w-[90%] text-sm text-emerald-50/90 md:text-base font-medium leading-relaxed">
                        Report issues, track status, and help make our city safer for everyone.
                    </p>
                </div>

                <Button
                    variant="secondary"
                    className="group mt-4 w-fit rounded-full bg-white/95 px-6 py-6 text-teal-800 hover:bg-white border-none shadow-lg backdrop-blur-md"
                    onClick={() => navigate('/complaints')}
                >
                    <Plus className="mr-2 h-5 w-5 rounded-full bg-teal-800 p-0.5 text-white transition-transform group-hover:rotate-90" />
                    <span className="text-base font-semibold">Report Now</span>
                    <ChevronRight className="ml-2 h-4 w-4 opacity-50 transition-transform group-hover:translate-x-1" />
                </Button>
            </div>
        </div>
    );
}



function ServiceItem({ image, title, sub, type }: { image: string, title: string, sub: string, type: string }) {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(`/services?type=${type}`)}
            className="group relative flex min-w-[200px] cursor-pointer items-center gap-4 rounded-[1.5rem] bg-white p-3 pr-6 shadow-sm transition-all hover:scale-[1.02] dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden"
        >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl">
                <img src={image} alt={title} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
            </div>
            <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{title}</h4>
                <p className="text-xs font-medium text-slate-400">{sub}</p>
            </div>
        </div>
    );
}

function ActivityHub({ stats }: { stats: { points: number, reports: number, resolved: number } }) {
    // Calculate pseudo-score
    const total = stats.reports || 1;
    const rate = Math.round((stats.resolved / total) * 100) || 0;
    const score = rate;
    const circumference = 2 * Math.PI * 40; // r=40
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="rounded-[2.5rem] bg-white p-6 shadow-sm dark:bg-slate-900 border border-slate-100 dark:border-slate-800 relative overflow-hidden">
            {/* Subtle background tech pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 dark:bg-slate-800/50" />

            <div className="mb-6 flex items-center justify-between relative z-10">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Activity Hub</h3>
                    <p className="text-xs text-slate-400">Personal performance</p>
                </div>
                <div className="rounded-full bg-slate-100 p-2 dark:bg-slate-800">
                    <TrendingUp className="h-5 w-5 text-slate-400" />
                </div>
            </div>

            <div className="flex flex-col items-center gap-8 md:flex-row md:justify-around relative z-10">
                {/* Gauge */}
                <div className="relative flex h-32 w-32 items-center justify-center">
                    <svg className="h-full w-full rotate-[-90deg]">
                        <circle
                            cx="64"
                            cy="64"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-slate-100 dark:text-slate-800"
                        />
                        <circle
                            cx="64"
                            cy="64"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="text-teal-500 transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-2xl font-bold text-slate-800 dark:text-white">{score}%</span>
                        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Rate</span>
                    </div>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Impact</span>
                        <span className="text-2xl font-bold text-teal-600">{stats.points} Points</span>
                    </div>
                    <div className="col-span-2 h-[1px] w-full bg-slate-100 dark:bg-slate-800"></div>
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total</span>
                        <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{stats.reports}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Solved</span>
                        <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{stats.resolved}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AlertItem({ report, image }: { report: any, image?: string }) {
    const isCritical = report.priority === 'critical' || report.priority === 'high';
    const bg = isCritical ? 'bg-red-50' : 'bg-blue-50';
    const iconColor = isCritical ? 'text-red-500' : 'text-blue-500';
    const Icon = isCritical ? AlertTriangle : CloudLightning;

    return (
        <div className="group flex cursor-pointer items-stretch gap-4 rounded-[2rem] bg-white p-3 shadow-sm transition-all hover:translate-y-[-2px] hover:shadow-md dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden">
            {/* Image Thumbnail */}
            <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden bg-slate-100">
                {image ? (
                    <img src={image} alt="Alert" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                    <div className={cn("h-full w-full flex items-center justify-center", bg)}>
                        <Icon className={cn("h-8 w-8", iconColor)} />
                    </div>
                )}
                <div className={cn("absolute top-2 left-2 p-1 rounded-full bg-white/90 backdrop-blur-sm shadow-sm", iconColor)}>
                    <Icon className="h-3 w-3" />
                </div>
            </div>

            <div className="flex-1 py-1 pr-2 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <Badge variant="secondary" className={cn("text-[10px] font-bold uppercase tracking-wider px-2 h-5", isCritical ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600")}>
                            {report.category || "Alert"}
                        </Badge>
                        <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-1 text-sm">{report.title}</h4>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {report.description || "Emergency report near the reported area. Please proceed with caution."}
                    </p>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-2">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate max-w-[150px]">Downtown District</span>
                </div>
            </div>
        </div>
    );
}

function JoinSquadCard({ count }: { count: number }) {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate('/join-squad')}
            className="relative overflow-hidden rounded-[2.5rem] shadow-xl group cursor-pointer"
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&auto=format&fit=crop&q=80"
                    alt="Volunteers"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-900/80 group-hover:bg-slate-900/70 transition-colors" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
            </div>

            <div className="relative z-10 flex flex-col p-8 text-white h-full">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-white">Join the Squad</h3>
                        <div className="mt-2 flex items-center gap-2">
                            <div className="flex -space-x-3">
                                <Avatar className="border-2 border-slate-900 w-8 h-8">
                                    <AvatarImage src="https://i.pravatar.cc/100?img=1" />
                                    <AvatarFallback>V1</AvatarFallback>
                                </Avatar>
                                <Avatar className="border-2 border-slate-900 w-8 h-8">
                                    <AvatarImage src="https://i.pravatar.cc/100?img=5" />
                                    <AvatarFallback>V2</AvatarFallback>
                                </Avatar>
                                <Avatar className="border-2 border-slate-900 w-8 h-8">
                                    <AvatarImage src="https://i.pravatar.cc/100?img=8" />
                                    <AvatarFallback>V3</AvatarFallback>
                                </Avatar>
                            </div>
                            <span className="text-sm font-medium text-slate-300 ml-1">{count}+ locals active</span>
                        </div>
                    </div>
                </div>

                <Button className="mt-auto w-full rounded-xl bg-white py-6 text-slate-900 hover:bg-teal-50 border-none shadow-lg">
                    <span className="text-sm font-bold uppercase tracking-widest">Volunteer Now</span>
                    <Users className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

export function CommunityDashboard() {
    const { data: reports, isLoading: reportsLoading } = useReports();
    const { data: volunteers } = useVolunteers();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const data = await db.getOrCreateProfile(user);
                setProfile(data);
            }
        };
        fetchUser();
    }, []);

    // Animation on mount
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(containerRef.current.children,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power3.out" }
            );
        }
    }, []);

    // Filter critical reports for Alerts
    const criticalReports = reports?.filter(r => r.priority === 'high' || r.priority === 'critical').slice(0, 3) || [];
    const activeVolunteersCount = volunteers?.length || 500;

    return (
        <div className="min-h-screen bg-slate-50/50 pb-32 pt-6 dark:bg-slate-950 font-sans selection:bg-teal-100">
            <div ref={containerRef} className="container mx-auto max-w-md space-y-8 px-6 md:max-w-2xl lg:max-w-4xl">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm ring-2 ring-slate-100 cursor-pointer" onClick={() => navigate('/profile')}>
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile ? profile.name : 'Citizen'}`} />
                            <AvatarFallback>{profile ? profile.name[0] : 'C'}</AvatarFallback>
                        </Avatar>
                        <div onClick={() => navigate('/profile')} className="cursor-pointer">
                            <SplitText
                                text={`Hi, ${profile ? profile.name : 'Citizen'}`}
                                className="text-lg font-bold text-slate-800 dark:text-slate-100"
                                delay={50}
                            />
                            <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">Metropolis Guardian</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="relative rounded-full bg-white shadow-sm border border-slate-100 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800">
                        <span className="absolute right-3 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                        <Megaphone className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </Button>
                </div>

                {/* Hero */}
                <HeroCard />

                {/* Quick Actions */}
                <QuickActions />

                {/* City Services Scroll */}
                <div>
                    <div className="mb-4 flex items-center justify-between px-1">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">City Services</h3>
                        <div className="text-xs font-bold text-teal-600 cursor-pointer hover:underline">View All</div>
                    </div>
                    <div className="hide-scrollbar -mx-6 flex gap-4 overflow-x-auto px-6 pb-4">
                        <ServiceItem
                            image="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=150&auto=format&fit=crop&q=60"
                            title="Waste Pick-up"
                            sub="Tue, Oct 24"
                            type="garbage"
                        />
                        <ServiceItem
                            image="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=150&auto=format&fit=crop&q=60"
                            title="Parking Permit"
                            sub="Renew: 12d"
                            type="road"
                        />
                        <ServiceItem
                            image="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=150&auto=format&fit=crop&q=60"
                            title="Electricity"
                            sub="Due: $45.20"
                            type="electricity"
                        />
                        <ServiceItem
                            image="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&auto=format&fit=crop&q=60"
                            title="Community Wifi"
                            sub="Active"
                            type="electricity"
                        />
                    </div>
                </div>

                {/* ActivityHub */}
                <ActivityHub stats={{
                    points: profile ? profile.points : 0,
                    reports: profile ? profile.reports_count : 0,
                    resolved: profile ? profile.resolved_count : 0
                }} />

                {/* City Alerts */}
                <div>
                    <div className="mb-4 flex items-center justify-between px-1">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">City Alerts</h3>
                        <div className="flex cursor-pointer items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-teal-600" onClick={() => navigate('/city-alerts')}>
                            See All <ChevronRight className="h-3 w-3" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        {reportsLoading ? (
                            <div className="h-24 w-full animate-pulse rounded-[2rem] bg-white dark:bg-slate-900 shadow-sm" />
                        ) : criticalReports.length > 0 ? (
                            criticalReports.map((report, idx) => (
                                <AlertItem
                                    key={report.id}
                                    report={report}
                                    image={idx === 0 ? "https://images.unsplash.com/photo-1584282470729-0524ba3acb8c?w=200&auto=format&fit=crop&q=60" : undefined}
                                />
                            ))
                        ) : (
                            // Show dummy data if no real critical alerts, to match the vibe
                            <>
                                <div className="group flex cursor-pointer items-stretch gap-4 rounded-[2rem] bg-white p-3 shadow-sm transition-all hover:translate-y-[-2px] hover:shadow-md dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden">
                                    <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1584282470729-0524ba3acb8c?w=200&auto=format&fit=crop&q=60" alt="Construction" className="h-full w-full object-cover" />
                                        <div className="absolute top-2 left-2 p-1 rounded-full bg-white/90">
                                            <Construction className="h-3 w-3 text-orange-500" />
                                        </div>
                                    </div>
                                    <div className="flex-1 py-1 pr-2 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <Badge variant="secondary" className="bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-wider px-2 h-5">Road Work</Badge>
                                                <span className="text-[10px] font-medium text-slate-400">1h ago</span>
                                            </div>
                                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Road Closure: 5th Ave</h4>
                                            <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">Emergency repairs near the main intersection.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="group flex cursor-pointer items-stretch gap-4 rounded-[2rem] bg-white p-3 shadow-sm transition-all hover:translate-y-[-2px] hover:shadow-md dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden">
                                    <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=200&auto=format&fit=crop&q=60" alt="Rain" className="h-full w-full object-cover" />
                                        <div className="absolute top-2 left-2 p-1 rounded-full bg-white/90">
                                            <CloudLightning className="h-3 w-3 text-blue-500" />
                                        </div>
                                    </div>
                                    <div className="flex-1 py-1 pr-2 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <Badge variant="secondary" className="bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider px-2 h-5">Weather</Badge>
                                                <span className="text-[10px] font-medium text-slate-400">2h ago</span>
                                            </div>
                                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Heavy Rain Warning</h4>
                                            <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">Flash flood warning in low lying areas next 3 hours.</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Join the Squad */}
                <JoinSquadCard count={activeVolunteersCount} />

                {/* Floating Action Button for Mobile */}
                <div className="fixed bottom-24 right-6 z-40 md:hidden pointer-events-none">
                    <div className="pointer-events-auto shadow-xl rounded-full">
                        <Button size="icon" className="h-14 w-14 rounded-full bg-teal-600 hover:bg-teal-700 shadow-none border-none">
                            <Plus className="h-6 w-6 text-white" />
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
