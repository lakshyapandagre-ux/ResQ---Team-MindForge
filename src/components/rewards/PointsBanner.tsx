
import { Progress } from "@/components/ui/progress";
import { Sparkles, Trophy, ChevronRight } from "lucide-react";

interface PointsBannerProps {
    points: number;
    onOpenGuide: () => void;
}

export function PointsBanner({ points, onOpenGuide }: PointsBannerProps) {
    // Level logic
    const nextLevel = Math.ceil((points + 1) / 500) * 500;
    const progress = (points % 500) / 500 * 100;
    const level = Math.floor(points / 500) + 1;

    return (
        <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 p-4 mb-8">
            <div className="container max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

                {/* Points Display */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="h-12 w-12 rounded-full bg-yellow-400 text-yellow-900 flex items-center justify-center shadow-lg shadow-yellow-200">
                        <Trophy className="w-6 h-6 fill-current animate-pulse" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your Balance</div>
                        <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                            {points.toLocaleString()} <span className="text-sm font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-md">PTS</span>
                        </div>
                    </div>
                </div>

                {/* Level Progress */}
                <div className="flex-1 w-full md:max-w-md">
                    <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-slate-500">Level {level} Citizen</span>
                        <span className="text-teal-600">{points} / {nextLevel} PTS</span>
                    </div>
                    <div className="relative">
                        <Progress value={progress} className="h-3 bg-slate-100 dark:bg-slate-800" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-200 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-slate-500 font-bold z-10 translate-x-1/2">
                            L{level + 1}
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 text-right">
                        Earn {nextLevel - points} more points to reach Level {level + 1}
                    </p>
                </div>

                {/* CTA - Maybe link to how to earn */}
                <div className="hidden md:flex items-center justify-end">
                    <div
                        className="flex items-center text-sm font-bold text-indigo-600 hover:underline cursor-pointer"
                        onClick={onOpenGuide}
                    >
                        <Sparkles className="w-4 h-4 mr-2" /> How to earn more <ChevronRight className="w-4 h-4" />
                    </div>
                </div>

            </div>
        </div>
    );
}
