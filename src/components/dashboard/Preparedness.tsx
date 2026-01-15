
import { useState } from "react";
import {
    Heart, Droplets, Flame, Waves, House, Zap,
    MapPin, Phone, Navigation, ChevronRight,
    ShieldCheck, BriefcaseMedical, CheckCircle2,
    ShieldAlert, UserCheck, Search, Bookmark, BookmarkCheck
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// --- Types ---


interface EmergencyGuide {
    id: string;
    icon: any;
    title: string;
    desc: string;
    color: string;
    steps: string[];
    dos: string[];
    donts: string[];
}

interface KitItem {
    id: string;
    name: string;
    icon: any;
    category: string;
}

interface Location {
    id: string;
    name: string;
    type: string;
    area: string;
    distance: string;
    phone: string;
}

interface Drill {
    id: string;
    title: string;
    type: string;
    date: string;
    location: string;
    registered: boolean;
}

// --- Dummy Data ---
const EMERGENCY_GUIDES: EmergencyGuide[] = [
    {
        id: "cpr",
        icon: Heart,
        title: "Heart Attack / CPR",
        desc: "Perform compression-only CPR.",
        color: "bg-red-500",
        steps: [
            "Call emergency services immediately.",
            "Check breathing and responsiveness.",
            "Start chest compressions (100–120/min).",
            "Push hard and fast in center of chest.",
            "Continue until help arrives."
        ],
        dos: ["Keep elbows straight", "Interlock fingers", "Minimize interruptions"],
        donts: ["Do not stop unless exhausted", "Do not apply pressure on ribs"]
    },
    {
        id: "bleeding",
        icon: Droplets,
        title: "Heavy Bleeding",
        desc: "Control bleeding to save life.",
        color: "bg-rose-600",
        steps: [
            "Apply direct pressure on the wound.",
            "Use sterile bandage or clean cloth.",
            "Elevate the injured limb if possible.",
            "If blood soaks through, add more layers."
        ],
        dos: ["Wear gloves if possible", "Keep patient warm"],
        donts: ["Do not remove original dressing", "Do not use tourniquet unless trained"]
    },
    {
        id: "fire",
        icon: Flame,
        title: "Fire Accident",
        desc: "Evacuate immediately. Stay low.",
        color: "bg-orange-500",
        steps: [
            "Trigger the nearest fire alarm.",
            "Stay low to avoid smoke inhalation.",
            "Check doors for heat before opening.",
            "Use stairs, never elevators."
        ],
        dos: ["Cover nose/mouth with wet cloth", "Stop, Drop, and Roll if clothes catch fire"],
        donts: ["Do not hide in closets", "Do not return for belongings"]
    },
    {
        id: "flood",
        icon: Waves,
        title: "Flood Safety",
        desc: "Move to higher ground.",
        color: "bg-blue-600",
        steps: [
            "Evacuate to higher ground immediately.",
            "Avoid walking or driving through water.",
            "Disconnect electrical appliances.",
            "Listen to weather alerts."
        ],
        dos: ["Prepare emergency kit", "Follow official evacuation routes"],
        donts: ["Do not drink tap water", "Do not touch fallen wires"]
    },
    {
        id: "quake",
        icon: House,
        title: "Earthquake Safety",
        desc: "Drop, Cover, and Hold On.",
        color: "bg-amber-600",
        steps: [
            "Drop to your hands and knees.",
            "Cover your head and neck (under table).",
            "Hold on to your shelter until shaking stops.",
            "Evacuate if building is damaged."
        ],
        dos: ["Stay away from windows", "Protect head/neck"],
        donts: ["Do not run outside during shaking", "Do not use elevators"]
    },
    {
        id: "shock",
        icon: Zap,
        title: "Electric Shock",
        desc: "Do not touch the person.",
        color: "bg-yellow-500",
        steps: [
            "Turn off the power source if safe.",
            "Do NOT touch the person if still in contact.",
            "Use non-conductive object (wood) to separate.",
            "Begin CPR if no breathing."
        ],
        dos: ["Call for help immediately", "Keep victim warm"],
        donts: ["Do not touch with bare hands", "Do not use water on electrical fire"]
    }
];

const KIT_ITEMS: KitItem[] = [
    { id: "water", name: "Water (1L/person)", icon: Droplets, category: "Basics" },
    { id: "meds", name: "Essential Medicines", icon: BriefcaseMedical, category: "Health" },
    { id: "flash", name: "Flashlight", icon: Zap, category: "Tools" },
    { id: "power", name: "Power Bank", icon: Zap, category: "Tools" },
    { id: "docs", name: "Important Docs", icon: ShieldCheck, category: "Personal" },
    { id: "aid", name: "First Aid Kit", icon: BriefcaseMedical, category: "Health" }
];

const LOCATIONS: Location[] = [
    { id: "1", name: "MY Hospital", type: "Hospital", area: "Palasia", distance: "2.4 km", phone: "108" },
    { id: "2", name: "Rajwada Fire Station", type: "Fire Station", area: "Rajwada", distance: "4.1 km", phone: "101" },
    { id: "3", name: "Collector Relief Camp", type: "Shelter", area: "Vijay Nagar", distance: "1.2 km", phone: "0731-25555" },
    { id: "4", name: "Bhawarkua Police Station", type: "Police", area: "Bhawarkua", distance: "5.5 km", phone: "100" },
];

const DRILLS: Drill[] = [
    { id: "d1", title: "Earthquake Drill", type: "Drill", date: "Jan 20, 10:00 AM", location: "Vijay Nagar", registered: false },
    { id: "d2", title: "CPR Worksop", type: "Workshop", date: "Jan 22, 02:00 PM", location: "Palasia", registered: true },
    { id: "d3", title: "Flood Evacuation", type: "Training", date: "Feb 01, 09:00 AM", location: "Rajwada", registered: false },
];

export function Preparedness() {
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [bookmarked, setBookmarked] = useState<string[]>([]);

    const toggleItem = (id: string) => {
        setCheckedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleBookmark = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setBookmarked(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const filteredGuides = EMERGENCY_GUIDES.filter(g =>
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const progress = Math.round((checkedItems.length / KIT_ITEMS.length) * 100);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">

            {/* 🔝 HERO SECTION */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />
                <div className="relative p-8 md:p-12 flex flex-col items-start gap-6">
                    <Badge variant="outline" className="text-blue-200 border-blue-400/30 bg-blue-500/10 backdrop-blur-sm px-4 py-1.5">
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Civic Safety Initiative
                    </Badge>
                    <div className="space-y-2 max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Be Prepared. <span className="text-blue-400">Save Lives.</span>
                        </h1>
                        <p className="text-lg text-blue-100/80 leading-relaxed">
                            Disasters don't warn you, but preparation can save you. Learn what to do before, during, and after emergencies.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4 pt-2">
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg shadow-blue-900/20">
                            <BriefcaseMedical className="w-5 h-5 mr-2" />
                            View Emergency Guides
                        </Button>
                        <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md">
                            <MapPin className="w-5 h-5 mr-2" />
                            Nearby Help Centers
                        </Button>
                    </div>
                </div>
            </section>

            {/* 🟥 SECTION 1 — EMERGENCY ACTION GUIDES */}
            <section className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <ShieldAlert className="w-6 h-6 text-red-500" />
                        What To Do In Emergency
                    </h2>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search guides..."
                            className="pl-9 bg-white/50 backdrop-blur-sm border-blue-100 focus:border-blue-400 focus:ring-blue-100"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGuides.map((guide) => (
                        <Dialog key={guide.id}>
                            <DialogTrigger asChild>
                                <div className="group cursor-pointer relative overflow-hidden rounded-2xl bg-card border hover:border-blue-500/50 hover:shadow-lg transition-all duration-300">
                                    <div className={`h-2 w-full ${guide.color}`} />
                                    <div className="p-6 space-y-4">
                                        <div className={`w-12 h-12 rounded-xl ${guide.color} bg-opacity-10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                                            <guide.icon className={`w-6 h-6 ${guide.color.replace('bg-', 'text-')}`} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{guide.title}</h3>
                                            <p className="text-muted-foreground text-sm mt-1">{guide.desc}</p>
                                        </div>
                                        <div className="pt-2 flex items-center justify-between">
                                            <div className="flex items-center text-sm font-medium text-blue-600 group-hover:translate-x-1 transition-transform">
                                                View Steps <ChevronRight className="w-4 h-4 ml-1" />
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-transparent"
                                                onClick={(e) => toggleBookmark(e, guide.id)}
                                            >
                                                {bookmarked.includes(guide.id) ? (
                                                    <BookmarkCheck className="w-5 h-5 text-blue-600 fill-blue-100" />
                                                ) : (
                                                    <Bookmark className="w-5 h-5 text-slate-300 hover:text-blue-400" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2 text-2xl">
                                        <guide.icon className={`w-6 h-6 ${guide.color.replace('bg-', 'text-')}`} />
                                        {guide.title}
                                    </DialogTitle>
                                    <DialogDescription>Follow these steps strictly to ensure safety.</DialogDescription>
                                </DialogHeader>

                                <div className="mt-4 space-y-6">
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-blue-600">IMMEDIATE ACTIONS</h4>
                                        <div className="space-y-2">
                                            {guide.steps.map((step, idx) => (
                                                <div key={idx} className="flex gap-3 p-3 rounded-lg bg-secondary/50 items-center">
                                                    <div className="flex-none w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                        {idx + 1}
                                                    </div>
                                                    <p className="text-sm font-medium">{step}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-green-50/50 border border-green-100">
                                            <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4" /> DO's
                                            </h4>
                                            <ul className="space-y-2">
                                                {guide.dos.map((item, i) => (
                                                    <li key={i} className="text-sm text-green-800 flex items-start gap-2">
                                                        <span className="mt-1.5 w-1 h-1 rounded-full bg-green-500" /> {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="p-4 rounded-xl bg-red-50/50 border border-red-100">
                                            <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                                                <ShieldAlert className="w-4 h-4" /> DON'TS
                                            </h4>
                                            <ul className="space-y-2">
                                                {guide.donts.map((item, i) => (
                                                    <li key={i} className="text-sm text-red-800 flex items-start gap-2">
                                                        <span className="mt-1.5 w-1 h-1 rounded-full bg-red-500" /> {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 🟦 SECTION 2 — EMERGENCY KIT CHECKLIST */}
                <div className="lg:col-span-1 space-y-4 h-full">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <BriefcaseMedical className="w-6 h-6 text-blue-500" />
                        Emergency Kit
                    </h2>
                    <Card className="h-full border-0 shadow-lg bg-gradient-to-b from-blue-50 to-white">
                        <CardHeader>
                            <CardTitle className="text-lg">Your Preparedness</CardTitle>
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-blue-700">{progress}% Ready</span>
                                    <span className="text-muted-foreground">{checkedItems.length}/{KIT_ITEMS.length} Items</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {KIT_ITEMS.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => toggleItem(item.id)}
                                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${checkedItems.includes(item.id) ? 'bg-blue-100/50 border-blue-200' : 'bg-white hover:bg-slate-50'}`}
                                >
                                    <div className={`w-5 h-5 rounded border ${checkedItems.includes(item.id) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'} flex items-center justify-center transition-colors`}>
                                        {checkedItems.includes(item.id) && <CheckCircle2 className="w-3.5 h-3.5" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-medium ${checkedItems.includes(item.id) ? 'text-blue-900' : 'text-slate-700'}`}>{item.name}</p>
                                        <span className="text-xs text-muted-foreground">{item.category}</span>
                                    </div>
                                    <item.icon className="w-4 h-4 text-slate-400" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* 🟩 SECTION 3 — NEARBY SAFE LOCATIONS */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <MapPin className="w-6 h-6 text-green-500" />
                        Nearby Help & Shelter at Indore
                    </h2>
                    <div className="overflow-x-auto pb-4 -mx-1 px-1 custom-scrollbar">
                        <div className="flex gap-4 w-max">
                            {LOCATIONS.map((loc) => (
                                <Card key={loc.id} className="w-[280px] hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <Badge variant="secondary" className="mb-2">{loc.type}</Badge>
                                            <span className="text-sm font-bold text-green-600">{loc.distance}</span>
                                        </div>
                                        <CardTitle className="text-lg">{loc.name}</CardTitle>
                                        <CardDescription className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> {loc.area}, Indore
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex gap-2">
                                        <Button variant="default" className="flex-1 bg-green-600 hover:bg-green-700" size="sm">
                                            <Phone className="w-4 h-4 mr-1" /> Call
                                        </Button>
                                        <Button variant="outline" className="flex-1 border-green-200 text-green-700 hover:bg-green-50" size="sm">
                                            <Navigation className="w-4 h-4 mr-1" /> Map
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* 🟨 SECTION 4 — DISASTER DRILLS */}
                    <div className="pt-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                            <UserCheck className="w-6 h-6 text-amber-500" />
                            Community Safety Programs
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {DRILLS.map(drill => (
                                <div key={drill.id} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                    <div className="w-16 h-16 rounded-xl bg-amber-100 text-amber-600 flex flex-col items-center justify-center flex-none">
                                        <span className="text-xs font-bold uppercase">{drill.date.split(',')[0].split(' ')[0]}</span>
                                        <span className="text-xl font-bold">{drill.date.split(',')[0].split(' ')[1]}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold truncate">{drill.title}</h4>
                                        <p className="text-sm text-muted-foreground truncate">{drill.location} • {drill.type}</p>
                                        <p className="text-xs text-amber-600 mt-1 font-medium">{drill.date.split(',')[1]}</p>
                                    </div>
                                    <Button size="sm" variant={drill.registered ? "outline" : "default"} className={drill.registered ? "border-amber-200 text-amber-700" : "bg-amber-500 hover:bg-amber-600"}>
                                        {drill.registered ? "Joined" : "Register"}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}
