import { useState, useEffect } from "react";
import { Plus, Filter, Flame, MapPin, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportForm } from "@/components/complaints/ReportForm";
import { PostCard } from "@/components/complaints/PostCard";
import type { Complaint } from "@/components/complaints/types";

// --- Mock Data ---
const MOCK_COMPLAINTS: Complaint[] = [
    {
        id: "1",
        title: "Major Pothole Causing Accidents",
        description: "A very deep pothole has formed near the main intersection. Several bikes have slipped. Needs urgent repair before monsoon worsens it.",
        category: "Roads",
        location: "Vijay Nagar Square",
        images: [
            "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1565514020125-638069d67566?q=80&auto=format&fit=crop"
        ],
        status: "Verified",
        priority: "High",
        timeline: 45,
        postedAt: "2h ago",
        author: { name: "Rahul Sharma", avatar: "https://github.com/shadcn.png", role: "Citizen" },
        stats: { supports: 124, comments: 12, shares: 5 },
        isSupported: false,
        isFollowed: false
    },
    {
        id: "2",
        title: "Streetlights dysfunctional in Sector 3",
        description: "Entire lane 4 is pitch dark at night. Safety concern for women returning from work. Complaints filed 3 times with no action.",
        category: "Electricity",
        location: "Sector 3, Palasia",
        images: ["https://images.unsplash.com/photo-1542452377-5264b9a4c840?q=80&auto=format&fit=crop"],
        status: "Pending",
        priority: "Medium",
        timeline: 10,
        postedAt: "5h ago",
        author: { name: "Priya Singh", avatar: "https://github.com/shadcn.png", role: "Volunteer" },
        stats: { supports: 89, comments: 8, shares: 15 },
        isSupported: true,
        isFollowed: true
    },
    {
        id: "3",
        title: "Garbage Dump Overflowing",
        description: "Foul smell spreading in residential area due to uncleared garbage dump for 4 days.",
        category: "Sanitation",
        location: "Bhawarkua Main Rd",
        images: ["https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&auto=format&fit=crop"],
        status: "In Progress",
        priority: "Critical",
        timeline: 60,
        postedAt: "1d ago",
        author: { name: "Amit Verma", avatar: "https://github.com/shadcn.png", role: "Citizen" },
        stats: { supports: 256, comments: 45, shares: 30 },
        isSupported: false,
        isFollowed: false
    }
];

export function Complaints() {
    const [activeTab, setActiveTab] = useState("trending");
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [complaints, setComplaints] = useState<Complaint[]>(MOCK_COMPLAINTS);
    const [isLoading, setIsLoading] = useState(true);

    // Filter Logic
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            let filtered = [...MOCK_COMPLAINTS];

            if (activeTab === 'critical') {
                filtered = filtered.filter(c => c.priority === 'High' || c.priority === 'Critical');
            } else if (activeTab === 'trending') {
                filtered.sort((a, b) => b.stats.supports - a.stats.supports);
            } else if (activeTab === 'latest') {
                // Mock sort by date (assuming id order or postedAt string, here just reverse original for demo)
                filtered = filtered.reverse();
            }

            setComplaints(filtered);
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [activeTab]);

    const handleNewComplaint = () => {
        setIsMobileOpen(false);
        // Add optimistic update if needed or refetch
    };

    return (
        <div className="max-w-[1400px] mx-auto min-h-screen pb-20">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* --- LEFT PANEL: Form (Desktop Sticky) --- */}
                <div className="hidden lg:block lg:col-span-4 sticky top-24">
                    <ReportForm onSuccess={handleNewComplaint} />
                </div>

                {/* --- RIGHT PANEL: Feed --- */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Header & Filters */}
                    <div className="sticky top-16 z-30 bg-secondary/95 backdrop-blur-sm py-4 -mx-4 px-4 lg:mx-0 lg:px-0 lg:static lg:bg-transparent lg:py-0 border-b lg:border-0 border-slate-200/50">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                            <div>
                                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                                    Civic Feed
                                </h1>
                                <p className="text-sm text-slate-500">Real-time issues reported by citizens</p>
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <Button variant="outline" size="sm" className="hidden sm:flex">
                                    <MapPin className="mr-2 h-4 w-4" /> Near Me
                                </Button>
                                <Button variant="outline" size="sm" className="hidden sm:flex">
                                    <Filter className="mr-2 h-4 w-4" /> Filter
                                </Button>
                            </div>
                        </div>

                        <Tabs defaultValue="trending" value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                    <div className="space-y-6 min-h-[500px]">
                        {isLoading ? (
                            // Skeletons
                            [1, 2, 3].map((i) => (
                                <div key={i} className="h-64 bg-slate-100 rounded-xl animate-pulse" />
                            ))
                        ) : (
                            complaints.map((complaint) => (
                                <div key={complaint.id} className="animate-in slide-in-from-bottom-4 duration-500 fade-in fill-mode-backwards" style={{ animationDelay: `${Number(complaint.id) * 100}ms` }}>
                                    <PostCard complaint={complaint} />
                                </div>
                            ))
                        )}

                        {!isLoading && complaints.length === 0 && (
                            <div className="text-center py-20 text-slate-400">
                                <p>No complaints found in this category.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* --- MOBILE FAB (Floating Action Button) --- */}
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

        </div>
    );
}
