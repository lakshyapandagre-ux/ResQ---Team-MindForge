
import { useState, useEffect } from "react";
import { LeaderboardRow } from "./LeaderboardRow";
import { LeaderboardTabs } from "./LeaderboardTabs";
import { Trophy, Crown, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

// Mock Data Types
interface HeroProfile {
    id: string;
    name: string;
    avatar_url: string;
    city: string;
    points: number;
    reports_count: number;
    resolved_count: number;
    rank_change?: 'up' | 'down' | 'same';
}

// MOCK_HEROES replaced by Supabase data

function PodiumItem({ hero, rank }: { hero: HeroProfile, rank: number }) {
    if (!hero) return null;

    // Config for podium places
    const isFirst = rank === 1;
    const isSecond = rank === 2;
    const isThird = rank === 3;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rank * 0.1, duration: 0.5 }}
            className={cn(
                "relative flex flex-col items-center",
                isFirst ? "order-2 -mt-6 z-10" :
                    isSecond ? "order-1 mt-4" :
                        "order-3 mt-8"
            )}
        >
            {/* Crown/Medal */}
            <div className="mb-2">
                {isFirst && <Crown className="w-8 h-8 text-yellow-500 fill-yellow-200 drop-shadow-lg animate-bounce" />}
                {isSecond && <div className="text-2xl">🥈</div>}
                {isThird && <div className="text-2xl">🥉</div>}
            </div>

            {/* Avatar with Glow */}
            <div className={cn(
                "relative rounded-full p-1",
                isFirst ? "bg-gradient-to-b from-yellow-300 to-yellow-600 shadow-xl shadow-yellow-200/50" :
                    isSecond ? "bg-gradient-to-b from-slate-300 to-slate-500 shadow-lg" :
                        "bg-gradient-to-b from-amber-300 to-amber-700 shadow-lg"
            )}>
                <Avatar className={cn(
                    "border-4 border-white dark:border-slate-900",
                    isFirst ? "w-24 h-24" : "w-16 h-16"
                )}>
                    <AvatarImage src={hero.avatar_url} />
                    <AvatarFallback>{hero.name[0]}</AvatarFallback>
                </Avatar>

                {/* Rank Badge */}
                <div className={cn(
                    "absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs border-2 border-white",
                    isFirst ? "bg-yellow-500 text-white" :
                        isSecond ? "bg-slate-500 text-white" :
                            "bg-amber-600 text-white"
                )}>
                    {rank}
                </div>
            </div>

            {/* Name & Stats */}
            <div className="text-center mt-3">
                <h3 className={cn("font-bold text-slate-900 dark:text-white line-clamp-1 max-w-[120px]", isFirst ? "text-lg" : "text-sm")}>
                    {hero.name}
                </h3>
                <div className="flex items-center justify-center gap-1 font-bold text-teal-600">
                    <Sparkles className="w-3 h-3" />
                    <span>{hero.points}</span>
                </div>
            </div>
        </motion.div>
    );
}

import { useAuth } from "@/contexts/AuthContext";

export function CityHeroLeaderboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');
    const [heroes, setHeroes] = useState<HeroProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHeroes = async () => {
            setLoading(true);
            try {
                // 1. Fetch Profiles for Leaderboard
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id, name, city, points, reports_count, resolved_count')
                    .order('points', { ascending: false })
                    .limit(10);
                // ... logic continues ...

                if (error) {
                    console.error("Fetch error:", error);
                    return;
                }

                if (data) {
                    const mapped = data.map((p: any) => ({
                        id: p.id,
                        name: p.name || 'Citizen',
                        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name || p.id}`,
                        city: p.city || 'Indore',
                        points: p.points || 0,
                        reports_count: p.reports_count || 0,
                        resolved_count: p.resolved_count || 0,
                        rank_change: 'same' as const
                    }));
                    setHeroes(mapped);
                }
            } catch (err) {
                console.error("Leaderboard error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHeroes();
    }, [activeTab]);

    const podiumHeroes = heroes.slice(0, 3);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-[2.5rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm overflow-hidden relative"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-yellow-500 fill-current" />
                        City Heroes
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">Top contributors making Indore safer</p>
                </div>
                <LeaderboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            {loading ? (
                <div className="h-[400px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                </div>
            ) : (
                <>
                    {/* Podium */}
                    <div className="flex justify-center items-end gap-2 md:gap-8 mb-10 min-h-[180px]">
                        <PodiumItem hero={podiumHeroes[1]} rank={2} />
                        <PodiumItem hero={podiumHeroes[0]} rank={1} />
                        <PodiumItem hero={podiumHeroes[2]} rank={3} />
                    </div>

                    {/* List */}
                    <div className="bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                        <div className="space-y-1">
                            {heroes.map((hero, index) => {
                                const rank = index + 1;
                                // List heroes ranked 4 onwards
                                if (rank <= 3) return null;

                                return (
                                    <motion.div
                                        key={hero.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <LeaderboardRow
                                            rank={rank}
                                            name={hero.name}
                                            avatar={hero.avatar_url}
                                            points={hero.points}
                                            reports={hero.reports_count}
                                            resolved={hero.resolved_count}
                                            isCurrentUser={hero.id === user?.id}
                                        />
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Always show current user if they are not in the list (e.g. they are rank 50) - simplified for demo */}
                        {/* {heroes.find(h => h.id === '4') && heroes.findIndex(h => h.id === '4') > 6 && (
                             <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <LeaderboardRow ... /> 
                             </div>
                        )} */}
                    </div>
                </>
            )}

            {/* Decorative Background Gradients */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl -z-10 translate-y-1/2 -translate-x-1/2" />
        </motion.div>
    );
}
