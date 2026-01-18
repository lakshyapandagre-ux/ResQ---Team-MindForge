import { useRef, useEffect } from "react";
import {
    Megaphone,
    TrendingUp,
    Plus,
    Users,
    Gift
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import { QuickActions } from "@/components/dashboard/QuickActions";
// import { db } from "@/lib/db";
// import { supabase } from "@/lib/supabase";

import { CityStatusBar } from "./CityStatusBar";
import { ImpactPanel } from "./ImpactPanel";
import { CityAlertTimeline } from "./CityAlertTimeline";
import { CommunityZone } from "./CommunityZone";
import { CityHeatmap } from "@/components/maps/CityHeatmap";
import { JoinSquadModal } from "./JoinSquadModal";
import { CityHeroLeaderboard } from "./CityHeroLeaderboard";
import { AnnouncementsPanel } from "./AnnouncementsPanel";
import { NearbyCivicCarousel } from "./NearbyCivicCarousel";

// ... inside render buffer ...
{/* Dynamic Content Grid */ }
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

    {/* LEFT: Live Alerts Timeline (7 cols) */}
    <div className="lg:col-span-7 space-y-4">
        <CityAlertTimeline />
    </div>

    {/* RIGHT: Community Zone (5 cols) */}
    <div className="lg:col-span-5 space-y-6">
        <CommunityZone />
    </div>
</div>

{/* City Hero Leaderboard */ }
<CityHeroLeaderboard />

{/* Join the Squad - Bottom Call to Action */ }
<JoinSquadCard count={250} />




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
    const navigate = useNavigate();

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
                    <div className="flex flex-col group cursor-pointer transition-opacity hover:opacity-80" onClick={() => navigate('/rewards')}>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 group-hover:text-teal-600 transition-colors">
                            Total Impact <Gift className="w-3 h-3 mb-0.5" />
                        </span>
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


function JoinSquadCard({ count }: { count: number }) {
    return (
        <JoinSquadModal>
            <div
                className="relative overflow-hidden rounded-[2.5rem] shadow-xl group cursor-pointer w-full text-left"
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
        </JoinSquadModal>
    );
}

import { useAuth } from "@/contexts/AuthContext";

export function CommunityDashboard() {
    // const { data: reports, isLoading: reportsLoading } = useReports(); // Unused
    // const { data: volunteers } = useVolunteers(); // Unused
    const navigate = useNavigate();
    const { profile } = useAuth();

    // Remove local fetch, rely on context

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


    return (
        <div className="min-h-screen bg-slate-50/50 pb-24 pt-4 md:pt-6 dark:bg-slate-950 font-sans selection:bg-teal-100">
            <div ref={containerRef} className="w-full max-w-7xl mx-auto space-y-6 md:space-y-8 px-4 sm:px-6 md:px-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm ring-2 ring-slate-100 cursor-pointer" onClick={() => navigate('/profile')}>
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile ? profile.name : 'Citizen'}`} />
                            <AvatarFallback>{profile ? profile.name[0] : 'C'}</AvatarFallback>
                        </Avatar>
                        <div onClick={() => navigate('/profile')} className="cursor-pointer group">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                {(() => {
                                    const hour = new Date().getHours();
                                    if (hour < 12) return 'Good Morning,';
                                    if (hour < 18) return 'Good Afternoon,';
                                    return 'Good Evening,';
                                })()}
                                <span className=" bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                                    {profile ? profile.name.split(' ')[0] : 'Citizen'}
                                </span>
                            </h2>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 group-hover:text-teal-600 transition-colors">
                                <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider text-slate-400">
                                    LVL {profile ? Math.floor(profile.points / 100) + 1 : 1}
                                </span>
                                <span>Metropolis Guardian</span>
                            </div>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="relative rounded-full bg-white shadow-sm border border-slate-100 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800">
                        <span className="absolute right-3 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                        <Megaphone className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </Button>
                </div>

                {/* Hero */}
                <CityStatusBar />

                {/* Announcements Panel (Added) */}
                <AnnouncementsPanel />

                {/* Impact Panel */}
                <ImpactPanel profile={profile} />

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

                {/* Nearby Civic Carousel */}
                <NearbyCivicCarousel />

                {/* ActivityHub */}
                <ActivityHub stats={{
                    points: profile ? profile.points : 0,
                    reports: profile ? profile.reports_count : 0,
                    resolved: profile ? profile.resolved_count : 0
                }} />

                {/* Dynamic Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT: Live Alerts Timeline (7 cols) */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Heatmap Section */}
                        <CityHeatmap />

                        <CityAlertTimeline />
                    </div>

                    {/* RIGHT: Community Zone (5 cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        <CommunityZone />
                    </div>
                </div>

                {/* City Hero Leaderboard */}
                <CityHeroLeaderboard />

                {/* Join the Squad - Bottom Call to Action */}
                <JoinSquadCard count={250} />

                {/* Floating Action Button for Mobile */}
                <div className="fixed bottom-24 right-6 z-40 md:hidden pointer-events-none">
                    <div className="pointer-events-auto shadow-xl rounded-full">
                        <Button
                            size="icon"
                            className="h-14 w-14 rounded-full bg-teal-600 hover:bg-teal-700 shadow-none border-none"
                            onClick={() => navigate('/complaints')}
                        >
                            <Plus className="h-6 w-6 text-white" />
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
