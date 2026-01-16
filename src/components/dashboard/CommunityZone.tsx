
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Users, MessageSquare, Plus, UserPlus, Trophy, Sparkles
} from "lucide-react";
import { JoinSquadModal } from "./JoinSquadModal";

// Dummy Volunteers Data
const NEARBY_VOLUNTEERS = [
    { id: 1, name: "Rahul S.", role: "First Aid", status: "online", img: "https://i.pravatar.cc/150?u=1", points: 1250 },
    { id: 2, name: "Priya M.", role: "Rescue", status: "busy", img: "https://i.pravatar.cc/150?u=2", points: 980 },
    { id: 3, name: "Amit K.", role: "Cleanup", status: "offline", img: "https://i.pravatar.cc/150?u=3", points: 750 },
    { id: 4, name: "Sneha L.", role: "Medical", status: "online", img: "https://i.pravatar.cc/150?u=4", points: 1540 },
    { id: 5, name: "Vikram R.", role: "Traffic", status: "online", img: "https://i.pravatar.cc/150?u=5", points: 890 }
];

export function CommunityZone() {
    const [voted, setVoted] = useState<string | null>(null);
    const [votes, setVotes] = useState({
        "Vijay Nagar": 45,
        "Palasia": 30,
        "Rajwada": 15,
        "Bhawarkua": 10
    });

    const handleVote = (option: string) => {
        if (voted) return;
        setVoted(option);
        setVotes(prev => ({
            ...prev,
            [option as keyof typeof votes]: prev[option as keyof typeof votes] + 1
        }));
    };

    const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

    return (
        <div className="space-y-6">

            {/* 1. Nearby Volunteers Card - Enhanced */}
            <Card className="p-6 rounded-[2rem] border-0 bg-white shadow-xl shadow-indigo-100/50 dark:bg-slate-900/50 dark:shadow-none overflow-visible relative">
                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-50 rounded-full blur-2xl opacity-60 pointer-events-none" />

                <div className="flex items-center justify-between mb-6 relative">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-100 rounded-xl text-indigo-600">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 leading-tight">
                                Squad Members
                            </h3>
                            <p className="text-xs font-medium text-slate-400">Active near you</p>
                        </div>
                    </div>
                    <JoinSquadModal>
                        <Button size="sm" className="h-9 rounded-full px-4 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:scale-105">
                            <UserPlus className="w-3.5 h-3.5 mr-1.5" /> Join
                        </Button>
                    </JoinSquadModal>
                </div>

                <div className="flex items-start gap-4 overflow-x-auto pb-4 pt-1 scrollbar-hide -mx-4 px-4 snap-x">
                    {NEARBY_VOLUNTEERS.map((vol, idx) => (
                        <div key={vol.id} className="group relative flex flex-col items-center min-w-[85px] cursor-pointer snap-center">
                            {/* Rank Badge for Top Volunteers */}
                            {idx === 3 && (
                                <div className="absolute -top-2 right-1 z-10">
                                    <div className="bg-amber-400 text-white p-1 rounded-full border-2 border-white shadow-sm ring-1 ring-amber-100">
                                        <Trophy className="w-2.5 h-2.5" />
                                    </div>
                                </div>
                            )}

                            <div className="relative mb-2">
                                <div className="relative rounded-full p-1 bg-gradient-to-tr from-indigo-100 to-white dark:from-slate-800 dark:to-slate-700 group-hover:from-indigo-200 transition-colors">
                                    <Avatar className="w-14 h-14 border-2 border-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                                        <AvatarImage src={vol.img} />
                                        <AvatarFallback>{vol.name[0]}</AvatarFallback>
                                    </Avatar>
                                </div>
                                <span className={`absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${vol.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' :
                                        vol.status === 'busy' ? 'bg-amber-500' : 'bg-slate-300'
                                    }`} />
                            </div>

                            <div className="text-center">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block leading-tight group-hover:text-indigo-600 transition-colors">{vol.name}</span>
                                <Badge variant="secondary" className="mt-1.5 px-2 py-0.5 h-auto text-[9px] font-bold bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors border-0">
                                    {vol.role}
                                </Badge>
                            </div>
                        </div>
                    ))}
                    <div className="flex flex-col items-center justify-center min-w-[70px] snap-center">
                        <Button variant="ghost" className="w-14 h-14 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                            <Plus className="w-6 h-6" />
                        </Button>
                        <span className="text-[10px] font-bold mt-2 text-slate-400">View All</span>
                    </div>
                </div>
            </Card>

            {/* 2. Community Poll - Enhanced */}
            <Card className="p-6 rounded-[2rem] border-0 bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-xl shadow-indigo-200/50 dark:shadow-none relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-[0.03] rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                            <MessageSquare className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-indigo-100">Live Poll</span>
                        <Badge className="ml-auto bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Active
                        </Badge>
                    </div>

                    <h4 className="text-lg font-bold text-white leading-snug mb-6">
                        Where should we focus our next <span className="text-amber-300">Community Cleanup</span>?
                    </h4>

                    <div className="space-y-3">
                        {Object.entries(votes).map(([option, count]) => {
                            const percent = Math.round((count / totalVotes) * 100);
                            const isSelected = voted === option;

                            return (
                                <div
                                    key={option}
                                    onClick={() => handleVote(option)}
                                    className={`group relative h-12 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden ${voted
                                            ? 'bg-black/20'
                                            : 'bg-white/10 hover:bg-white/20 active:scale-[0.98]'
                                        }`}
                                >
                                    {/* Progress Bar Background */}
                                    {voted && (
                                        <div
                                            className="absolute inset-y-0 left-0 bg-white/20 backdrop-blur-md z-0 transition-all duration-1000 ease-out"
                                            style={{ width: `${percent}%` }}
                                        />
                                    )}

                                    {/* Selected Indicator */}
                                    {isSelected && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 z-20" />
                                    )}

                                    <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
                                        <div className="flex items-center gap-3">
                                            {/* Check Circle */}
                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-amber-400 bg-amber-400' : 'border-white/40 group-hover:border-white/60'
                                                }`}>
                                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-indigo-900" />}
                                            </div>
                                            <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-indigo-50'}`}>
                                                {option}
                                            </span>
                                        </div>

                                        {voted && (
                                            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
                                                <div className="flex -space-x-1.5 opacity-60">
                                                    {[...Array(Math.min(3, Math.ceil(count / 10)))].map((_, i) => (
                                                        <Avatar key={i} className="w-5 h-5 border border-indigo-900/50">
                                                            <AvatarImage src={`https://i.pravatar.cc/100?u=${i + option}`} />
                                                        </Avatar>
                                                    ))}
                                                </div>
                                                <span className="text-sm font-bold text-white">
                                                    {percent}%
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-5 flex items-center justify-between text-indigo-200 text-xs font-medium px-1">
                        <span>{totalVotes} citizens voted</span>
                        <span>Ends in 14h 32m</span>
                    </div>
                </div>
            </Card>

        </div>
    );
}
