import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    MapPin, Camera,
    ThumbsUp, MessageCircle, Repeat, Clock,
    Loader2, Upload
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// --- Types ---
type ComplaintStatus = "Pending" | "Verified" | "Assigned" | "Resolved";
type ComplaintCategory = "Garbage" | "Road" | "Drainage" | "Electricity" | "Water" | "Other";

interface Complaint {
    id: string;
    title: string;
    description: string;
    category: ComplaintCategory;
    location: string;
    image: string;
    status: ComplaintStatus;
    timeline: number; // 0-100
    etaDays: number;
    department: string;
    postedAt: string;
    supportCount: number;
    isSupported?: boolean;
    isReposted?: boolean;
}

// --- Dummy Data ---
const INITIAL_COMPLAINTS: Complaint[] = [
    {
        id: "1",
        title: "Overflowing Garbage Bin",
        description: "The garbage bin near the main square hasn't been cleared for 3 days. Foul smell is spreading.",
        category: "Garbage",
        location: "Vijay Nagar",
        image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=300&auto=format&fit=crop",
        status: "Pending",
        timeline: 25,
        etaDays: 2,
        department: "Municipal Corp",
        postedAt: "2h ago",
        supportCount: 45
    },
    {
        id: "2",
        title: "Major Pothole on Main Road",
        description: "Dangerous pothole causing traffic slowdown and accidents near the signal.",
        category: "Road",
        location: "Palasia",
        image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=300&auto=format&fit=crop",
        status: "Verified",
        timeline: 50,
        etaDays: 5,
        department: "PWD",
        postedAt: "5h ago",
        supportCount: 128
    },
    {
        id: "3",
        title: "Street Light Not Working",
        description: "Entire street is dark at night, causing safety concerns for residents.",
        category: "Electricity",
        location: "Bhawarkua",
        image: "https://images.unsplash.com/photo-1542452377-5264b9a4c840?q=80&w=300&auto=format&fit=crop",
        status: "Assigned",
        timeline: 75,
        etaDays: 1,
        department: "Electricity Board",
        postedAt: "1d ago",
        supportCount: 89
    },
    {
        id: "4",
        title: "Water Contamination",
        description: "Tap water is looking muddy and has a bad smell since morning.",
        category: "Water",
        location: "Rajwada",
        image: "https://images.unsplash.com/photo-1577979603378-d04b771f83c0?q=80&w=300&auto=format&fit=crop",
        status: "Pending",
        timeline: 10,
        etaDays: 3,
        department: "Water Supply",
        postedAt: "3h ago",
        supportCount: 67
    },
    {
        id: "5",
        title: "Drainage Blockage",
        description: "Waterlogging due to blocked drainage after yesterday's rain.",
        category: "Drainage",
        location: "Annapurna",
        image: "https://images.unsplash.com/photo-1619421868341-3312e75e3810?q=80&w=300&auto=format&fit=crop",
        status: "Resolved",
        timeline: 100,
        etaDays: 0,
        department: "Municipal Corp",
        postedAt: "2d ago",
        supportCount: 200
    }
];

// --- Form Schema ---
const complaintSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    category: z.string().min(1, "Select a category"),
    location: z.string().min(1, "Select a location"),
    description: z.string().min(10, "Please provide more details"),
});

export function ComplaintForm() { // Renamed from Complaints to match file replacement instruction but functional component name should probably be ComplaintsPage or similar in a real app, here keeping it as ComplaintForm to replace the existing export.
    // Actually, the user asked to replace "ComplaintForm.tsx" content but the task is to build the "Complaints" page. 
    // The file viewed was `ComplaintForm.tsx` which is likely used in `Index.tsx`.
    // I will keep the export name `ComplaintForm` so it doesn't break `Index.tsx`.

    const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof complaintSchema>>({
        resolver: zodResolver(complaintSchema),
        defaultValues: {
            title: "",
            category: "",
            location: "",
            description: "",
        }
    });

    const onSubmit = async (data: z.infer<typeof complaintSchema>) => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        const newComplaint: Complaint = {
            id: Date.now().toString(),
            title: data.title,
            description: data.description,
            category: data.category as ComplaintCategory,
            location: data.location,
            image: "https://images.unsplash.com/photo-1549488346-a496b86fd00d?q=80&w=300&auto=format&fit=crop", // Placeholder
            status: "Pending",
            timeline: 10,
            etaDays: 3,
            department: "Municipal Corp",
            postedAt: "Just now",
            supportCount: 0
        };

        setComplaints([newComplaint, ...complaints]);
        form.reset();
        setIsSubmitting(false);
        toast.success("Complaint Registered Successfully", {
            description: "Ref ID: #" + newComplaint.id.slice(-6).toUpperCase()
        });
    };

    const handleSupport = (id: string) => {
        setComplaints(complaints.map(c => {
            if (c.id === id) {
                const newSupported = !c.isSupported;
                return {
                    ...c,
                    isSupported: newSupported,
                    supportCount: c.supportCount + (newSupported ? 1 : -1)
                };
            }
            return c;
        }));
    };

    const handleRepost = (id: string) => {
        setComplaints(complaints.map(c => {
            if (c.id === id) {
                if (!c.isReposted) {
                    toast.success("Reposted to your feed! 🔄");
                }
                return { ...c, isReposted: !c.isReposted };
            }
            return c;
        }));
    };

    const categories = ["Garbage", "Road", "Drainage", "Electricity", "Water", "Other"];
    const locations = ["Vijay Nagar", "Palasia", "Bhawarkua", "Rajwada", "Annapurna"];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20 animate-in fade-in duration-500">

            {/* LEFT: Submit Form */}
            <div className="lg:col-span-4 space-y-6">
                <Card className="border-t-4 border-t-indigo-500 shadow-lg sticky top-24">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            📝 Report a Civic Issue
                        </CardTitle>
                        <CardDescription>
                            Submit issues directly to authorities. Track progress in real-time.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                            <div className="space-y-1">
                                <label className="text-sm font-medium">Issue Title</label>
                                <Input placeholder="e.g. Broken Street Light" {...form.register("title")} />
                                {form.formState.errors.title && <span className="text-xs text-red-500">{form.formState.errors.title.message}</span>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Category</label>
                                    <Select onValueChange={(val) => form.setValue("category", val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {form.formState.errors.category && <span className="text-xs text-red-500">{form.formState.errors.category.message}</span>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Location</label>
                                    <Select onValueChange={(val) => form.setValue("location", val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Area" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {locations.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {form.formState.errors.location && <span className="text-xs text-red-500">{form.formState.errors.location.message}</span>}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium">Description</label>
                                <Textarea placeholder="Describe the issue in detail..." className="resize-none h-24" {...form.register("description")} />
                                {form.formState.errors.description && <span className="text-xs text-red-500">{form.formState.errors.description.message}</span>}
                            </div>

                            <div className="border-2 border-dashed rounded-lg h-24 flex flex-col items-center justify-center text-muted-foreground hover:bg-slate-50 cursor-pointer transition-colors">
                                <Upload className="h-6 w-6 mb-1 text-slate-400" />
                                <span className="text-xs">Drop image here or click to upload</span>
                            </div>

                            <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                                {isSubmitting ? "Submitting..." : "Submit Complaint"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* RIGHT: Feed */}
            <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        🔥 Issues Near You
                    </h2>
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                        {complaints.length} Active Issues
                    </Badge>
                </div>

                <div className="space-y-4">
                    {complaints.map((complaint) => (
                        <ComplaintCard
                            key={complaint.id}
                            complaint={complaint}
                            onSupport={() => handleSupport(complaint.id)}
                            onRepost={() => handleRepost(complaint.id)}
                        />
                    ))}
                </div>
            </div>

        </div>
    );
}

function ComplaintCard({
    complaint,
    onSupport,
    onRepost
}: {
    complaint: Complaint;
    onSupport: () => void;
    onRepost: () => void;
}) {
    const statusColors = {
        "Pending": "bg-amber-100 text-amber-700 border-amber-200",
        "Verified": "bg-blue-100 text-blue-700 border-blue-200",
        "Assigned": "bg-purple-100 text-purple-700 border-purple-200",
        "Resolved": "bg-emerald-100 text-emerald-700 border-emerald-200",
    };

    const isHighPriority = complaint.supportCount > 100;

    return (
        <Card className={cn(
            "overflow-hidden transition-all duration-300 hover:shadow-md border-slate-200",
            isHighPriority && "shadow-lg border-red-200 ring-1 ring-red-100"
        )}>
            <div className="flex flex-col sm:flex-row">

                {/* Image Section */}
                <div className="sm:w-48 h-48 sm:h-auto shrink-0 relative bg-slate-100">
                    <img src={complaint.image} alt={complaint.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2">
                        <Badge className={cn("border-0 shadow-sm", statusColors[complaint.status])}>
                            {complaint.status}
                        </Badge>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                                    {complaint.title}
                                </h3>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1.5">
                                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {complaint.location}</span>
                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {complaint.postedAt}</span>
                                    <Badge variant="outline" className="text-[10px] h-5 px-1.5 bg-slate-50">{complaint.category}</Badge>
                                </div>
                            </div>
                            {isHighPriority && (
                                <Badge variant="destructive" className="animate-pulse shadow-red-200 shadow-lg">
                                    High Priority
                                </Badge>
                            )}
                        </div>

                        <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                            {complaint.description}
                        </p>

                        {/* Progress Bar */}
                        <div className="space-y-1.5 mb-4">
                            <div className="flex justify-between text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                <span>Progress</span>
                                <span>ETA: {complaint.etaDays > 0 ? `${complaint.etaDays} Days` : "Done"}</span>
                            </div>
                            <Progress value={complaint.timeline} className="h-2" />
                            <div className="flex justify-between text-[10px] text-slate-400">
                                <span>Submitted</span>
                                <span>Assigned</span>
                                <span>Resolved</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex gap-4">
                            <button
                                onClick={onSupport}
                                className={cn(
                                    "flex items-center gap-1.5 text-sm font-medium transition-colors hover:bg-slate-50 py-1 px-2 rounded-md",
                                    complaint.isSupported ? "text-blue-600" : "text-slate-500 hover:text-blue-600"
                                )}
                            >
                                <ThumbsUp className={cn("h-4 w-4", complaint.isSupported && "fill-current")} />
                                <span>{complaint.supportCount} Support</span>
                            </button>

                            <button className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors hover:bg-slate-50 py-1 px-2 rounded-md">
                                <MessageCircle className="h-4 w-4" />
                                <span>Comment</span>
                            </button>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onRepost}
                            className={cn(
                                "text-slate-500 hover:text-green-600 hover:bg-green-50",
                                complaint.isReposted && "text-green-600 bg-green-50"
                            )}
                        >
                            <Repeat className="h-4 w-4 mr-1.5" />
                            Repost
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
