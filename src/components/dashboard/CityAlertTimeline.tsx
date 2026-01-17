
import { useState } from "react";
import {
    AlertTriangle, Clock, MapPin, Share2, ChevronRight, RefreshCw, Radio
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useCityAlerts, type AlertType } from "@/hooks/use-city-alerts";

export function CityAlertTimeline() {
    const [filter, setFilter] = useState<'All' | AlertType>('All');
    const { alerts, loading, refresh } = useCityAlerts();

    const filteredAlerts = filter === 'All' ? alerts : alerts.filter(a => a.type === filter);

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        toast.success("Alert link copied to clipboard!");
    };

    return (
        <Card className="p-4 rounded-[2rem] border-0 bg-white/50 backdrop-blur-sm shadow-xl dark:bg-slate-900/50 h-[600px] flex flex-col relative overflow-hidden group/card transition-all hover:bg-white/80">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 px-2 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-slate-800 dark:text-gray-100 leading-none">City Alerts</h3>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">
                            {loading ? "Updating..." : "Live Feed"}
                        </p>
                    </div>
                </div>
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => refresh()}
                        className={cn("h-8 w-8 rounded-full text-slate-400 hover:text-slate-600", loading && "animate-spin")}
                    >
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-4 px-1 scrollbar-hide snap-x relative z-10">
                {['All', 'Emergency', 'Traffic', 'Weather', 'Utility', 'News'].map(tag => (
                    <Badge
                        key={tag}
                        variant={filter === tag ? 'default' : 'outline'}
                        className={cn(
                            "cursor-pointer snap-start flex-shrink-0 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-wide transition-all",
                            filter === tag
                                ? "bg-slate-800 text-white shadow-lg shadow-slate-200 hover:bg-slate-700 border-transparent transform scale-105"
                                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300"
                        )}
                        onClick={() => setFilter(tag as any)}
                    >
                        {tag}
                    </Badge>
                ))}
            </div>

            {/* Timeline Feed */}
            <ScrollArea className="flex-1 -mx-4 px-4 relative z-10">
                <div className="space-y-4 relative pl-4 border-l-2 border-slate-100 dark:border-slate-800 ml-3 pt-2 pb-6">
                    {filteredAlerts.length === 0 && !loading && (
                        <div className="text-center py-10 text-slate-400 text-sm flex flex-col items-center">
                            <Radio className="w-8 h-8 mb-2 opacity-50" />
                            No active alerts in this category.
                        </div>
                    )}

                    {filteredAlerts.map((alert, idx) => {
                        const Icon = alert.icon;
                        return (
                            <div key={alert.id} className="relative group animate-in slide-in-from-left-4 fade-in duration-500 fill-mode-both" style={{ animationDelay: `${idx * 100}ms` }}>
                                {/* Detailed Card */}
                                <div className={cn(
                                    "relative ml-5 p-4 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden",
                                    "hover:shadow-lg hover:-translate-y-1 hover:border-slate-300",
                                    alert.severity === 'critical'
                                        ? "bg-red-50/50 border-red-100 hover:border-red-200 hover:shadow-red-100/50"
                                        : "bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700"
                                )}>
                                    {/* Timeline Dot Connection */}
                                    <div className={cn(
                                        "absolute -left-[29px] top-6 w-3.5 h-3.5 rounded-full border-[3px] border-white ring-1 ring-slate-100 z-10 transition-all duration-500",
                                        "group-hover:scale-125 group-hover:ring-2",
                                        alert.severity === 'critical' ? "bg-red-500 ring-red-200 animate-pulse" :
                                            alert.severity === 'high' ? "bg-orange-500 ring-orange-200" :
                                                alert.severity === 'medium' ? "bg-blue-500 ring-blue-200" : "bg-slate-400"
                                    )} />

                                    {/* Connector Line Highlight on Hover */}
                                    <div className="absolute -left-[23px] top-0 bottom-0 w-[2px] bg-slate-200 origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100 z-0" />

                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2.5">
                                            <div className={cn("p-2 rounded-xl transition-colors",
                                                alert.severity === 'critical' ? "bg-red-100 text-red-600" :
                                                    alert.severity === 'medium' ? "bg-orange-100 text-orange-600" :
                                                        "bg-slate-100 text-slate-600"
                                            )}>
                                                {Icon ? <Icon className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <span className={cn("text-[10px] font-bold uppercase tracking-wider block mb-0.5",
                                                    alert.severity === 'critical' ? "text-red-500" : "text-slate-500"
                                                )}>{alert.type}</span>
                                                <h4 className="font-bold text-sm text-slate-800 dark:text-gray-100 leading-tight">
                                                    {alert.title}
                                                </h4>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono bg-slate-50 px-2 py-1 rounded-full whitespace-nowrap">
                                            <Clock className="w-3 h-3" /> {alert.time}
                                        </span>
                                    </div>

                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3 pl-[3.25rem]">
                                        {alert.desc}
                                    </p>

                                    <div className="flex items-center justify-between pl-[3.25rem] mt-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-full">
                                            <MapPin className="w-3 h-3 text-slate-400" />
                                            {alert.location}
                                        </div>

                                        <div className="flex gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-slate-100 hover:text-indigo-600" onClick={handleShare}>
                                                <Share2 className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button size="icon" className="h-7 w-7 rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-sm" onClick={(e) => { e.stopPropagation(); toast("Opening map location..."); }}>
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
        </Card>
    );
}
