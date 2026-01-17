import { useRef, useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import gsap from "gsap";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";

interface Announcement {
    id: string;
    title: string;
    message: string;
    created_at: string;
    author_name?: string;
}

export function AnnouncementsPanel() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const data = await db.getAnnouncements();
                setAnnouncements(data || []);
            } catch (err) {
                console.error("Failed to fetch announcements", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    useEffect(() => {
        if (!loading && containerRef.current) {
            gsap.fromTo(containerRef.current.children,
                { y: 10, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power2.out" }
            );
        }
    }, [loading, announcements]);

    if (!loading && announcements.length === 0) {
        return null; // Don't show if empty
    }

    return (
        <Card className="border-none shadow-sm bg-indigo-50 dark:bg-slate-900/50 mb-6">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-indigo-600" />
                    <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">
                        Official Announcements
                    </CardTitle>
                </div>
                {/* <Badge variant="secondary" className="bg-white text-indigo-600 shadow-sm animate-pulse">
                    Live Updates
                </Badge> */}
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
                {loading ? (
                    <div className="space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-3/4" />
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-1/2" />
                    </div>
                ) : (
                    <div ref={containerRef} className="space-y-3">
                        {announcements.map((item) => (
                            <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-xl" />
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">
                                        {item.title}
                                    </h4>
                                    <span className="text-[10px] text-slate-400 font-medium bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-800">
                                        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {item.message}
                                </p>
                                <div className="mt-2 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-400">
                                        By {item.author_name || 'Admin'}
                                    </span>
                                    {/* <Button variant="ghost" size="sm" className="h-6 text-xs text-indigo-600 hover:text-indigo-700 p-0 hover:bg-transparent">
                                         Read More
                                     </Button> */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
