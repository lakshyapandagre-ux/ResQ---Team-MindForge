import { useState } from "react";
import {
    MapPin, MoreHorizontal, AlertTriangle, Bell, ChevronLeft, ChevronRight
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { CityMap } from "@/components/maps/MapComponents"; // Removed - causing issues
import { cn } from "@/lib/utils";
import type { Complaint } from "./types";
import { toast } from "sonner";
import { SupportButton } from "./SupportButton";
import { ShareMenu } from "./ShareMenu";
import { CommentDrawer } from "./CommentDrawer";
import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";

interface PostCardProps {
    complaint: Complaint;
}

export function PostCard({ complaint }: PostCardProps) {
    const [currentImage, setCurrentImage] = useState(0);
    const [isSupported, setIsSupported] = useState(complaint.isSupported);
    const [supportCount, setSupportCount] = useState(complaint.stats.supports);
    const [isFollowed, setIsFollowed] = useState(complaint.isFollowed);
    const [actionLoading, setActionLoading] = useState(false);

    const handleSupport = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast.error("Please login to support");
            return;
        }

        // Optimistic Update
        const previousState = isSupported;
        const previousCount = supportCount;

        setIsSupported(!isSupported);
        setSupportCount(prev => isSupported ? prev - 1 : prev + 1);

        try {
            setActionLoading(true);
            const added = await db.toggleSupport(complaint.id, user.id);
            if (added !== !previousState) {
                // Determine if we need to correct state (shouldn't happen if logic matches)
            }
            toast.success(added ? "Supported Issue" : "Removed Support");
        } catch (error) {
            // Revert on error
            setIsSupported(previousState);
            setSupportCount(previousCount);
            toast.error("Failed to update support");
        } finally {
            setActionLoading(false);
        }
    };

    const handleFollow = () => {
        setIsFollowed(!isFollowed);
        toast.success(isFollowed ? "Unfollowed Issue" : "Following Issue Updates");
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImage((prev) => (prev + 1) % complaint.images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImage((prev) => (prev - 1 + complaint.images.length) % complaint.images.length);
    };

    const statusColors: Record<string, string> = {
        "submitted": "bg-yellow-100 text-yellow-700 border-yellow-200",
        "pending": "bg-yellow-100 text-yellow-700 border-yellow-200",
        "verified": "bg-blue-100 text-blue-700 border-blue-200",
        "assigned": "bg-purple-100 text-purple-700 border-purple-200",
        "in_progress": "bg-indigo-100 text-indigo-700 border-indigo-200",
        "resolved": "bg-emerald-100 text-emerald-700 border-emerald-200",
    };

    const priorityColors: Record<string, string> = {
        "Low": "bg-slate-100 text-slate-600",
        "Medium": "bg-orange-50 text-orange-600",
        "High": "bg-red-50 text-red-600",
        "Critical": "bg-red-100 text-red-700 animate-pulse",
    };

    return (
        <Card className="group overflow-hidden border-slate-200 hover:shadow-lg transition-all duration-300">
            {/* Header / Author Info */}
            <CardHeader className="p-4 flex flex-row items-center gap-3 space-y-0">
                <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-transparent group-hover:ring-indigo-100 transition-all">
                    <AvatarImage src={complaint.author.avatar} />
                    <AvatarFallback>{complaint.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold truncate">{complaint.author.name}</p>
                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal">
                            {complaint.author.role}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{complaint.postedAt}</span>
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleFollow}>
                            <Bell className="mr-2 h-4 w-4" /> {isFollowed ? "Unfollow" : "Turn on notifications"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                            <AlertTriangle className="mr-2 h-4 w-4" /> Report content
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>

            {/* Image Carousel */}
            {complaint.images && complaint.images.length > 0 ? (
                <div className="relative aspect-video bg-slate-100">
                    <img
                        src={complaint.images[currentImage]}
                        alt={complaint.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />

                    {complaint.images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {complaint.images.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "h-1.5 rounded-full transition-all shadow-sm",
                                            idx === currentImage ? "w-4 bg-white" : "w-1.5 bg-white/50"
                                        )}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className={cn("border shadow-sm backdrop-blur-md uppercas", statusColors[complaint.status.toLowerCase()] || statusColors['pending'])}>
                            {complaint.status}
                        </Badge>
                        {complaint.priority === "Critical" && (
                            <Badge className={cn("border shadow-sm backdrop-blur-md", priorityColors[complaint.priority])}>
                                CRITICAL
                            </Badge>
                        )}
                    </div>
                </div>
            ) : null}

            {/* Content */}
            <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg leading-tight">{complaint.title}</h3>
                    <Badge variant="outline" className="shrink-0">{complaint.category}</Badge>
                </div>

                {/* Location Badge */}
                {/* Map View Temporarily Disabled - Leaflet removed */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold w-fit">
                    <MapPin className="h-3.5 w-3.5 fill-indigo-200" />
                    {complaint.location}
                </div>
                {/* <Dialog>
                    <DialogTrigger asChild>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold w-fit cursor-pointer hover:bg-indigo-100 transition-colors">
                            <MapPin className="h-3.5 w-3.5 fill-indigo-200" />
                            {complaint.location}
                        </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
                        <div className="h-[300px] w-full">
                            <CityMap
                                markers={[{
                                    id: complaint.id,
                                    lat: complaint.lat || 22.7196,
                                    lng: complaint.lng || 75.8577,
                                    title: complaint.title,
                                    description: complaint.location
                                }]}
                                centerLat={complaint.lat || 22.7196}
                                centerLng={complaint.lng || 75.8577}
                                height="100%"
                            />
                        </div>
                        <div className="p-4 bg-white">
                            <h3 className="font-bold">{complaint.title}</h3>
                            <p className="text-sm text-muted-foreground">{complaint.location}</p>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${complaint.lat || 22.7196},${complaint.lng || 75.8577}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-indigo-600 hover:underline mt-2 inline-block"
                            >
                                Open in Google Maps
                            </a>
                        </div>
                    </DialogContent>
                </Dialog> */}

                <p className="text-sm text-slate-600 line-clamp-3">
                    {complaint.description}
                </p>

                {/* Progress Status */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                        <span className="flex items-center gap-1.5">
                            <div className={cn("h-2 w-2 rounded-full animate-pulse",
                                complaint.status === 'Resolved' ? "bg-emerald-500" : "bg-blue-500"
                            )} />
                            {complaint.status}
                        </span>
                        <span>{complaint.timeline}%</span>
                    </div>
                    <Progress value={complaint.timeline} className="h-2" />
                </div>
            </CardContent>

            {/* Actions */}
            <CardFooter className="p-2 border-t bg-slate-50/50 grid grid-cols-3 gap-1">
                <SupportButton
                    isSupported={isSupported}
                    count={supportCount}
                    onClick={handleSupport}
                    isLoading={actionLoading}
                />

                <CommentDrawer complaintId={complaint.id} commentCount={complaint.stats.comments} />

                <ShareMenu complaintId={complaint.id} title={complaint.title} />
            </CardFooter>
        </Card >
    );
}
