
import { useState } from "react";
import {
    MapPin, Share2, ChevronRight, RefreshCw, Radio
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useCityAlerts, type AlertType } from "@/hooks/use-city-alerts";
import { ListItemSkeleton } from "@/components/skeletons/ListItemSkeleton";

export function CityAlertTimeline() {
    const [filter, setFilter] = useState<'All' | AlertType>('All');
    const { alerts, loading, refresh } = useCityAlerts();

    const filteredAlerts = filter === 'All' ? alerts : alerts.filter(a => a.type === filter);

    // handleShare removed as it was unused


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
                    {loading && (
                        <div className="space-y-2">
                            {[1, 2, 3].map(i => (
                                <ListItemSkeleton key={i} />
                            ))}
                        </div>
                    )}

                    {filteredAlerts.length === 0 && !loading && (
                        <div className="text-center py-10 text-slate-400 text-sm flex flex-col items-center">
                            <Radio className="w-8 h-8 mb-2 opacity-50" />
                            No active alerts in this category.
                        </div>
                    )}

                    {!loading && filteredAlerts.map((alert, idx) => {
                        // Icon variable removed as it was unused
                        return (
                            <div key={alert.id} className="relative group animate-in slide-in-from-left-4 fade-in duration-500 fill-mode-both pl-2" style={{ animationDelay: `${idx * 100}ms` }}>
                                {/* Timeline Connector */}
                                <div className="absolute left-[2px] top-8 bottom-0 w-[2px] bg-slate-100 dark:bg-slate-800 group-last:hidden" />
                                <div className={cn(
                                    "absolute left-[-5px] top-6 w-4 h-4 rounded-full border-[3px] border-white dark:border-slate-900 z-10 box-content transition-all duration-300",
                                    "group-hover:scale-125 group-hover:ring-4 group-hover:ring-slate-50 dark:group-hover:ring-slate-800",
                                    alert.severity === 'critical' ? "bg-red-500 ring-red-100" :
                                        alert.severity === 'high' ? "bg-orange-500 ring-orange-100" :
                                            alert.severity === 'medium' ? "bg-blue-500 ring-blue-100" : "bg-slate-300 ring-slate-100"
                                )} />

                                {/* Card Content */}
                                <div
                                    className={cn(
                                        "ml-6 relative rounded-2xl border bg-white dark:bg-slate-900 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 block",
                                        "active:scale-[0.99] cursor-default",
                                        alert.severity === 'critical'
                                            ? "border-red-100 dark:border-red-900/30"
                                            : "border-slate-100 dark:border-slate-800"
                                    )}
                                    onClick={() => window.open(alert.link, '_blank')}
                                >
                                    {/* Optional Image Banner */}
                                    {alert.imageUrl && (
                                        <div className="h-32 w-full overflow-hidden relative">
                                            <img src={alert.imageUrl} alt="News" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                                                <Badge variant="secondary" className="bg-white/90 text-slate-900 backdrop-blur-sm text-[10px] font-bold h-5 px-2 border-0">
                                                    {alert.type}
                                                </Badge>
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-4">
                                        <div className="flex justify-between items-start gap-3 mb-2">
                                            <div className="flex-1">
                                                {/* Only show type tag here if NO image, otherwise it's on the image */}
                                                {!alert.imageUrl && (
                                                    <span className={cn("text-[10px] font-bold uppercase tracking-wider mb-1 block",
                                                        alert.severity === 'critical' ? "text-red-500" : "text-slate-500"
                                                    )}>{alert.type}</span>
                                                )}
                                                <h4 className="font-bold text-sm text-slate-900 dark:text-gray-100 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                                    {alert.title}
                                                </h4>
                                            </div>
                                            <span className="shrink-0 text-[10px] font-medium text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full whitespace-nowrap">
                                                {alert.time}
                                            </span>
                                        </div>

                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-3">
                                            {alert.desc}
                                        </p>

                                        <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800 mt-2">
                                            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                                                <MapPin className="w-3 h-3 text-slate-400" />
                                                {alert.location}
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 w-7 rounded-full p-0 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigator.clipboard.writeText(alert.link || "");
                                                        toast.success("Link copied!");
                                                    }}
                                                >
                                                    <Share2 className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="h-7 rounded-full px-3 text-[10px] font-bold bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white transition-all shadow-none"
                                                >
                                                    Read
                                                    <ChevronRight className="w-3 h-3 ml-1" />
                                                </Button>
                                            </div>
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
