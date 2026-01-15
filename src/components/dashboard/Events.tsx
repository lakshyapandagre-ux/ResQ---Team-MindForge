import { useState } from "react";
import {
    Calendar, MapPin, Heart, Share2, Bookmark,
    User, CheckCircle2, Clock, Filter
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// --- Types ---
type EventStatus = 'live' | 'upcoming';
type EventCategory = 'Social' | 'Health' | 'Emergency' | 'Environment' | 'Education';

interface CivicEvent {
    id: string;
    image: string;
    title: string;
    organizer: string;
    date: string;
    time: string;
    location: string;
    description: string;
    participantCount: number;
    status: EventStatus;
    category: EventCategory;
    isFundraiser?: boolean;
    targetAmount?: number;
    raisedAmount?: number;
    volunteerSlots?: number;
    filledSlots?: number;
}

// --- Dummy Data ---
const EVENTS_DATA: CivicEvent[] = [
    {
        id: "1",
        image: "https://images.unsplash.com/photo-1615461066841-6116e61058f5?q=80&w=1000&auto=format&fit=crop",
        title: "Mega Blood Donation Camp",
        organizer: "Indore Red Cross Society",
        date: "Today",
        time: "10:00 AM - 5:00 PM",
        location: "Palasia Square, Indore",
        description: "Join us to save lives. Urgent requirement for O+ and B- blood types. Refreshments provided for all donors.",
        participantCount: 128,
        status: "live",
        category: "Health",
        isFundraiser: false
    },
    {
        id: "2",
        image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1000&auto=format&fit=crop",
        title: "Flood Relief Fundraiser Marathon",
        organizer: "Indore Runners Club",
        date: "March 20, 2024",
        time: "6:00 AM",
        location: "Rajwada Palace, Indore",
        description: "Run for a cause! All proceeds go directly to flood relief efforts in low-lying areas. 5k and 10k categories.",
        participantCount: 450,
        status: "upcoming",
        category: "Social",
        isFundraiser: true,
        targetAmount: 500000,
        raisedAmount: 325000
    },
    {
        id: "3",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5b43?q=80&w=1000&auto=format&fit=crop",
        title: "Tree Plantation Drive 2024",
        organizer: "Green Indore Initiative",
        date: "March 22, 2024",
        time: "8:00 AM - 11:00 AM",
        location: "Vijay Nagar Park, Indore",
        description: "Help us plant 500 saplings this weekend. Gloves and tools will be provided. Bring your own water bottle.",
        participantCount: 85,
        status: "upcoming",
        category: "Environment",
        volunteerSlots: 50,
        filledSlots: 32
    },
    {
        id: "4",
        image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop",
        title: "Emergency Fire Drill & Workshop",
        organizer: "Indore Fire Department",
        date: "March 25, 2024",
        time: "11:00 AM",
        location: "Collector Office Grounds",
        description: "Learn essential fire safety skills and extiguisher usage from professionals. Open to all citizens.",
        participantCount: 200,
        status: "upcoming",
        category: "Emergency"
    },
    {
        id: "5",
        image: "https://images.unsplash.com/photo-1616634358826-6136d8d85f8f?q=80&w=1000&auto=format&fit=crop",
        title: "Clean Indore Campaign",
        organizer: "Swachh Bharat Mission",
        date: "Every Sunday",
        time: "7:00 AM",
        location: "Bhawarkua Main Road",
        description: "Let's keep our city No. 1! Join the weekly cleaning drive. This week's focus: Plastic waste reduction.",
        participantCount: 1500,
        status: "live",
        category: "Environment",
        volunteerSlots: 100,
        filledSlots: 85
    },
    {
        id: "6",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop",
        title: "Free General Health Checkup",
        organizer: "MY Hospital Team",
        date: "Tomorrow",
        time: "10:00 AM - 2:00 PM",
        location: "Annapurna Temple Complex",
        description: "Free consultation for BP, Diabetes, and General Health. Medicine distribution for seniors.",
        participantCount: 60,
        status: "upcoming",
        category: "Health"
    }
];

export function Events() {
    const [activeFilter, setActiveFilter] = useState<string>("All");

    const filters = ["All", "Live Now", "Upcoming", "Volunteering", "Fundraising"];

    const filteredEvents = EVENTS_DATA.filter(event => {
        if (activeFilter === "All") return true;
        if (activeFilter === "Live Now") return event.status === "live";
        if (activeFilter === "Upcoming") return event.status === "upcoming";
        if (activeFilter === "Volunteering") return event.volunteerSlots !== undefined;
        if (activeFilter === "Fundraising") return event.isFundraiser;
        return true;
    });

    return (
        <div className="max-w-4xl mx-auto pb-24 animate-in fade-in duration-500 px-4 md:px-6">

            {/* Header Section */}
            <div className="mb-8 space-y-4 pt-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600 leading-tight">
                            Events Near You
                        </h1>
                        <p className="text-muted-foreground mt-2 text-sm md:text-base">
                            Stay connected with social drives, health camps & emergency drills in Indore.
                        </p>
                    </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                    <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                    {filters.map(filter => (
                        <Badge
                            key={filter}
                            variant={activeFilter === filter ? "default" : "secondary"}
                            className={cn(
                                "cursor-pointer rounded-full px-4 py-2 whitespace-nowrap transition-all text-xs md:text-sm border",
                                activeFilter === filter
                                    ? "bg-slate-900 border-slate-900 hover:bg-slate-800"
                                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                            )}
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter === "Live Now" && <span className="mr-2 inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                            {filter}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Events Feed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>

            {filteredEvents.length === 0 && (
                <div className="text-center py-20">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">No events found</h3>
                    <p className="text-sm text-muted-foreground">Try changing the filters or check back later.</p>
                </div>
            )}

        </div>
    );
}

function EventCard({ event }: { event: CivicEvent }) {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    return (
        <Card className="group flex flex-col overflow-hidden border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px] h-full bg-white dark:bg-slate-900">
            {/* Event Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {event.status === "live" ? (
                        <Badge className="bg-red-600 hover:bg-red-700 text-white border-0 shadow-lg shadow-red-500/30 animate-pulse flex items-center gap-1.5 px-2 py-0.5 text-[10px] md:text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            LIVE
                        </Badge>
                    ) : (
                        <Badge className="bg-white/90 hover:bg-white text-slate-900 border-0 shadow-sm backdrop-blur-md px-2 py-0.5 text-[10px] md:text-xs font-semibold">
                            Upcoming
                        </Badge>
                    )}
                    <Badge variant="secondary" className="bg-black/50 hover:bg-black/60 text-white backdrop-blur-md border-0 text-[10px] md:text-xs">
                        {event.category}
                    </Badge>
                </div>

                {/* Like/Save Overlay Actions */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-sm" onClick={() => setIsLiked(!isLiked)}>
                        <Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")} />
                    </Button>
                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-sm" onClick={() => setIsSaved(!isSaved)}>
                        <Bookmark className={cn("h-4 w-4", isSaved && "fill-blue-500 text-blue-500")} />
                    </Button>
                </div>
            </div>

            <CardContent className="flex flex-col flex-1 p-4 md:p-5">
                {/* Header */}
                <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center">
                            <User className="h-3 w-3 text-slate-500" />
                        </div>
                        <span className="text-xs font-medium text-slate-500 line-clamp-1">{event.organizer}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{event.title}</h3>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs md:text-sm text-slate-600">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            {event.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            {event.time}
                        </span>
                        <span className="flex items-center gap-1.5 w-full md:w-auto mt-1 md:mt-0">
                            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[200px]">{event.location}</span>
                        </span>
                    </div>
                </div>

                <div className="flex-1">
                    <p className="text-xs md:text-sm text-slate-500 leading-relaxed mb-4 line-clamp-3">
                        {event.description}
                    </p>

                    {/* Fundraising Progress */}
                    {event.isFundraiser && event.targetAmount && event.raisedAmount && (
                        <div className="mb-4 space-y-2">
                            <div className="flex justify-between text-xs font-medium">
                                <span className="text-orange-700">₹{event.raisedAmount.toLocaleString()} raised</span>
                                <span className="text-slate-400">of ₹{event.targetAmount.toLocaleString()}</span>
                            </div>
                            <div className="h-2 w-full bg-orange-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                                    style={{ width: `${(event.raisedAmount / event.targetAmount) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="mt-4 pt-4 border-t border-slate-100 gap-3 grid grid-cols-2">
                    <EventRegistrationModal event={event} />
                    <Button variant="outline" className="w-full text-slate-600 border-slate-200 hover:bg-slate-50">
                        <Share2 className="mr-2 h-3.5 w-3.5" /> Share
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function EventRegistrationModal({ event }: { event: CivicEvent }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setIsOpen(false);
        toast.success("Successfully Registered! 🎉", {
            description: `You're all set for ${event.title}. We've sent details to your phone.`
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-200">
                    {event.status === 'live' ? 'Join Now' : 'Register'}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md mx-4 rounded-2xl">
                <DialogHeader>
                    <DialogTitle>Register for Event</DialogTitle>
                    <DialogDescription>
                        Confirm your spot for <strong>{event.title}</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="h-12 w-12 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                            <img src={event.image} className="h-full w-full object-cover" alt="" />
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-sm truncate">{event.date} • {event.time}</p>
                            <p className="text-xs text-muted-foreground truncate">{event.location}</p>
                        </div>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="Enter your name" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" placeholder="+91 98765 43210" required />
                        </div>

                        <div className="flex items-start gap-2 pt-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                            <span className="text-xs text-muted-foreground">
                                I agree to receive event updates and reminders via WhatsApp/SMS.
                            </span>
                        </div>

                        <Button type="submit" className="w-full mt-2 rounded-xl">
                            Confirm Registration
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
