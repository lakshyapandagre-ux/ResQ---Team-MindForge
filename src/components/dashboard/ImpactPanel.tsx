
import {
    Flag,
    CheckCircle2,
    HeartHandshake,
    Zap,
    MapPin,
    AlertTriangle,
    LifeBuoy
} from "lucide-react";
import { ProgressRing } from "./ProgressRing";
import { RankBadge, type Rank } from "./RankBadge";
import { StatCounter } from "./StatCounter";
import { AchievementBadge } from "./AchievementBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { Profile } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface ImpactStats {
    points: number;
    reports: number;
    resolved: number;
    helped: number;
}

interface ImpactPanelProps {
    profile: Profile | null;
}


// ... imports ...

export function ImpactPanel({ profile }: ImpactPanelProps) {
    const navigate = useNavigate();
    const [helpedCount, setHelpedCount] = useState(0);

    useEffect(() => {
        const fetchHelps = async () => {
            if (!profile?.id) return;
            const { count } = await supabase
                .from('supports')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', profile.id);
            setHelpedCount(count || 0);
        };
        fetchHelps();
    }, [profile?.id]);

    // Derived stats from profile or defaults
    const stats: ImpactStats = {
        points: profile?.points || 0,
        reports: profile?.reports_count || 0,
        resolved: profile?.resolved_count || 0,
        helped: helpedCount
    };

    // Logic for Rank
    const getRankInfo = (points: number): { current: Rank, next: Rank, max: number } => {
        if (points < 100) return { current: 'Bronze', next: 'Silver', max: 100 };
        if (points < 300) return { current: 'Silver', next: 'Gold', max: 300 };
        return { current: 'Gold', next: 'Gold', max: 1000 };
    };

    const rankInfo = getRankInfo(stats.points);
    const progressPercent = Math.min(100, Math.round((stats.points / rankInfo.max) * 100));

    return (
        <Card className="relative overflow-hidden border-0 bg-white/50 backdrop-blur-md shadow-xl dark:bg-slate-900/50 dark:border-slate-800 rounded-[2rem]">
            {/* Decorative Background Gradients */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-teal-500/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 md:p-8">

                {/* LEFT: Progress Circle & Rank */}
                <div className="md:col-span-4 flex flex-row md:flex-col items-center justify-between md:justify-center relative gap-4">
                    <div className="relative shrink-0">
                        {/* Mobile Size: 110, Desktop: 160. Inline style used for specific overrides, but component takes simple number. 
                            We can toggle 'size' prop based on screen breadth or simply pick a middle ground 130 and adjust scaling.
                            Better approach: Render scale wrapper.
                        */}
                        <div className="scale-75 md:scale-100 origin-left md:origin-center">
                            <ProgressRing
                                progress={progressPercent}
                                size={160}
                                strokeWidth={12}
                                color={
                                    rankInfo.current === 'Gold' ? "text-yellow-500" :
                                        rankInfo.current === 'Silver' ? "text-slate-400" : "text-amber-600"
                                }
                            >
                                <div className="flex flex-col items-center gap-1">
                                    <RankBadge rank={rankInfo.current} size="lg" showTitle={false} />
                                    <div className="text-center">
                                        <p className="text-3xl font-black text-slate-800 dark:text-white leading-none">
                                            <StatCounter value={stats.points} />
                                        </p>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">XP Points</p>
                                    </div>
                                </div>
                            </ProgressRing>
                        </div>

                        {/* Next Rank Badge Bubble */}
                        {rankInfo.current !== 'Gold' && (
                            <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 p-1.5 rounded-full shadow-md border border-slate-100 dark:border-slate-700 animate-bounce-slow scale-75 md:scale-100">
                                <div className="text-[8px] font-bold text-center mb-0.5 text-slate-400">NEXT</div>
                                <RankBadge rank={rankInfo.next} size="sm" showTitle={false} />
                            </div>
                        )}
                    </div>

                    {/* Text Info - Moved to side on Mobile, Bottom on Desktop */}
                    <div className="text-left md:text-center flex-1 flex flex-col items-start md:items-center">
                        <h3 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 mb-1">
                            {rankInfo.current} Guardian
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-[180px] md:max-w-none mb-4">
                            You are <span className="font-bold text-slate-900 dark:text-white">{rankInfo.max - stats.points} XP</span> away from unlocking <span className="font-bold text-indigo-600 dark:text-indigo-400">{rankInfo.next}</span> level.
                        </p>

                        <Button
                            className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-9 text-xs font-bold shadow-lg shadow-slate-900/20 active:scale-95 transition-all"
                            onClick={() => navigate('/incidents')}
                        >
                            Report Issue +50 XP
                        </Button>
                    </div>
                </div>

                {/* RIGHT: Stats Grid & Badges */}
                <div className="md:col-span-8 flex flex-col justify-between gap-6">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white/60 dark:bg-slate-800/60 rounded-2xl p-4 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm transition-transform hover:-translate-y-1">
                            <div className="bg-blue-50 text-blue-600 p-2 rounded-full mb-2">
                                <Flag className="h-5 w-5" />
                            </div>
                            <span className="text-2xl font-bold text-slate-800 dark:text-white">
                                <StatCounter value={stats.reports} />
                            </span>
                            <span className="text-[10px] font-bold uppercase text-slate-400">Reports</span>
                        </div>

                        <div className="bg-white/60 dark:bg-slate-800/60 rounded-2xl p-4 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm transition-transform hover:-translate-y-1">
                            <div className="bg-green-50 text-green-600 p-2 rounded-full mb-2">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <span className="text-2xl font-bold text-slate-800 dark:text-white">
                                <StatCounter value={stats.resolved} />
                            </span>
                            <span className="text-[10px] font-bold uppercase text-slate-400">Resolved</span>
                        </div>

                        <div className="bg-white/60 dark:bg-slate-800/60 rounded-2xl p-4 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm transition-transform hover:-translate-y-1">
                            <div className="bg-purple-50 text-purple-600 p-2 rounded-full mb-2">
                                <HeartHandshake className="h-5 w-5" />
                            </div>
                            <span className="text-2xl font-bold text-slate-800 dark:text-white">
                                <StatCounter value={stats.helped} />
                            </span>
                            <span className="text-[10px] font-bold uppercase text-slate-400">Helped</span>
                        </div>
                    </div>

                    {/* Achievements Section */}
                    <div className="bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl p-4 border border-dashed border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Recent Badges</span>
                            <span className="text-[10px] text-indigo-500 font-bold cursor-pointer hover:underline" onClick={() => navigate('/profile')}>View All</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 overflow-x-auto hide-scrollbar py-2">
                            <AchievementBadge
                                icon={Zap}
                                title="First Report"
                                description="You filed your first civic report."
                                isUnlocked={stats.reports > 0}
                                dateUnlocked="Jan 2024"
                            />
                            <AchievementBadge
                                icon={MapPin}
                                title="Local Guide"
                                description="Reported issues in 3 different zones."
                                isUnlocked={stats.reports >= 3}
                            />
                            <AchievementBadge
                                icon={AlertTriangle}
                                title="Spotter"
                                description="Reported 10+ active hazards."
                                isUnlocked={stats.reports >= 10}
                            />
                            <AchievementBadge
                                icon={LifeBuoy}
                                title="Samaritan"
                                description="Helped 50+ citizens."
                                isUnlocked={stats.helped >= 50}
                            />
                            <AchievementBadge
                                icon={CheckCircle2}
                                title="Fixer"
                                description="Had 5 reports marked resolved."
                                isUnlocked={stats.resolved >= 5}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </Card>
    );
}
