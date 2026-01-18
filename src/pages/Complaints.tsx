import React, { useState, useEffect } from "react";
import { Plus, Filter, Flame, MapPin, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportForm } from "@/components/complaints/ReportForm";
import { PostCard } from "@/components/complaints/PostCard";
import type { Complaint } from "@/components/complaints/types";
import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export function Complaints() {
    const [activeTab, setActiveTab] = useState("trending");
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(3);
    const [userLoc, setUserLoc] = useState<{ lat: number, lng: number } | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);

    const isMounted = React.useRef(true);

    useEffect(() => {
        return () => { isMounted.current = false; };
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await db.getComplaints(
                activeTab as any,
                userLoc?.lat,
                userLoc?.lng
            );

            if (!isMounted.current) return;

            // Transform data to match Complaint interface
            const transformed: Complaint[] = data.map((item: any) => ({
                id: item.id,
                title: item.title,
                description: item.description,
                category: item.category,
                location: item.location,
                lat: item.lat,
                lng: item.lng,
                images: item.images || [],
                status: item.status,
                priority: item.priority || "Medium",
                timeline: calculateTimeline(item.status),
                postedAt: formatDistanceToNow(new Date(item.created_at), { addSuffix: true }),
                created_at: item.created_at,
                author: item.author,
                stats: {
                    supports: item.supports_count,
                    comments: item.comments_count,
                    shares: 0 // Shares not tracked in DB yet
                },
                isSupported: item.user_has_supported,
                isFollowed: false // Follow logic can be added later
            }));

            setComplaints(transformed);
        } catch (error: any) {
            if (error.name === 'AbortError') return;
            console.error(error);
            if (isMounted.current) {
                const msg = error.message || "Failed to load complaints";
                setError(msg);
                toast.error(msg);
            }
        } finally {
            if (isMounted.current) {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab, userLoc]);

    // Realtime Subscriptions
    useEffect(() => {
        const channel = supabase
            .channel('complaints-feed')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'complaints' }, (_payload) => {
                // Determine if we should optimistically add it based on tab
                if (activeTab === 'latest' || activeTab === 'all' || activeTab === 'trending') {
                    // Just refetch for simplicity or splice in if critical
                    toast.info("New complaint reported!");
                    fetchData();
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [activeTab]); // Re-subscribe if tab changes mostly to keep context, though global sub is fine too

    const handleNearMe = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported");
            return;
        }
        toast.info("Fetching your location...");
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setActiveTab("near_me");
            },
            (err) => {
                console.error(err);
                toast.error("Unable to access location");
            }
        );
    };

    const handleNewComplaint = () => {
        setIsMobileOpen(false);
        fetchData();
    };

    const displayedComplaints = complaints.slice(0, visibleCount);

    return (
        <div className="flex flex-col gap-8 min-h-screen pb-20 max-w-5xl mx-auto">

            {/* --- SECTION 1: Civic Feed (Now Top) --- */}
            <div className="space-y-6">

                {/* Header & Filters */}
                <div className="py-4 px-1 lg:px-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <div>
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                                Civic Feed
                            </h1>
                            <p className="text-sm text-slate-500">Real-time issues reported by citizens</p>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Button
                                variant={activeTab === 'near_me' ? 'secondary' : 'outline'}
                                size="sm"
                                className="hidden sm:flex"
                                onClick={handleNearMe}
                            >
                                <MapPin className="mr-2 h-4 w-4" /> Near Me
                            </Button>
                            <Button variant="outline" size="sm" className="hidden sm:flex">
                                <Filter className="mr-2 h-4 w-4" /> Filter
                            </Button>
                        </div>
                    </div>

                    <Tabs defaultValue="trending" value={activeTab} onValueChange={(val) => { setActiveTab(val); setVisibleCount(3); }} className="w-full">
                        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                            <TabsTrigger value="trending" className="text-xs sm:text-sm">
                                <Flame className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Trending
                            </TabsTrigger>
                            <TabsTrigger value="latest" className="text-xs sm:text-sm">
                                <Clock className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Latest
                            </TabsTrigger>
                            <TabsTrigger value="critical" className="text-xs sm:text-sm">
                                <AlertTriangle className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Critical
                            </TabsTrigger>
                            <TabsTrigger value="near_me" className="text-xs sm:text-sm lg:hidden">
                                <MapPin className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Near
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Feed Content */}
                <div className="space-y-6">
                    {isLoading ? (
                        // Skeletons
                        [1, 2, 3].map((i) => (
                            <div key={i} className="h-64 bg-slate-100 rounded-xl animate-pulse" />
                        ))
                    ) : error ? (
                        <div className="text-center py-20 bg-red-50 rounded-xl border border-red-100">
                            <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />
                            <h3 className="text-lg font-bold text-red-700">Unable to load feed</h3>
                            <p className="text-red-600 mb-4">{error}</p>
                            <Button variant="outline" onClick={fetchData} className="border-red-200 hover:bg-red-100 text-red-700">
                                Retry
                            </Button>
                        </div>
                    ) : (
                        displayedComplaints.map((complaint) => (
                            <div key={complaint.id} className="animate-in slide-in-from-bottom-4 duration-500 fade-in fill-mode-backwards" style={{ animationDelay: `${Number(complaint.id.substring(0, 2)) * 10 || 100}ms` }}>
                                <PostCard complaint={complaint} />
                            </div>
                        ))
                    )}

                    {!isLoading && !error && complaints.length === 0 && (
                        <div className="text-center py-20 text-slate-400">
                            <p>No complaints found.</p>
                            {activeTab === 'near_me' && <p className="text-xs mt-2">Try adjusting your location or checking other tabs.</p>}
                        </div>
                    )}
                </div>

                {/* Show More Button */}
                {!isLoading && complaints.length > 3 && (
                    <div className="flex justify-center pt-2">
                        <Button
                            variant="outline"
                            onClick={() => setVisibleCount(prev => prev === 3 ? complaints.length : 3)}
                            className="min-w-[150px]"
                        >
                            {visibleCount === 3 ? `Show All (${complaints.length})` : "Show Less"}
                        </Button>
                    </div>
                )}
            </div>

            {/* --- SECTION 2: Form (Moved to Bottom) --- */}
            <div className="mt-8 border-t border-slate-200 pt-8">
                <div className="max-w-3xl mx-auto">
                    <ReportForm onSuccess={handleNewComplaint} />
                </div>
            </div>

        </div>
    );

    {/* --- MOBILE FAB (Floating Action Button) --- */ }
    <div className="lg:hidden fixed bottom-24 right-4 z-40">
        <Dialog open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <DialogTrigger asChild>
                <Button className="h-14 w-14 rounded-full shadow-xl bg-indigo-600 hover:bg-indigo-700 transition-transform active:scale-95 flex items-center justify-center">
                    <Plus className="h-6 w-6 text-white" />
                </Button>
            </DialogTrigger>
            <DialogContent className="p-0 border-0 bg-transparent shadow-none max-w-none w-full h-[85vh] bottom-0 top-auto translate-y-0 data-[state=open]:slide-in-from-bottom-full rounded-t-2xl">
                <div className="bg-white h-full rounded-t-2xl overflow-y-auto p-4 shadow-2xl">
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" /> {/* Handle */}
                    <ReportForm onSuccess={handleNewComplaint} />
                </div>
            </DialogContent>
        </Dialog>
    </div>

}

function calculateTimeline(status: string): number {
    switch (status?.toLowerCase()) {
        case 'submitted': return 10;
        case 'pending': return 10;
        case 'verified': return 35;
        case 'assigned': return 60;
        case 'in_progress': return 80;
        case 'resolved': return 100;
        default: return 0;
    }
}
