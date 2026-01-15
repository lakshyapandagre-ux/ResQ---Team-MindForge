import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trash2, CloudLightning, Droplets, Construction, Bike, FileWarning } from "lucide-react";

const categories = [
    { label: "Garbage", icon: Trash2, image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=300" },
    { label: "Electricity", icon: CloudLightning, image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=300" },
    { label: "Water", icon: Droplets, image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=300" },
    { label: "Roads", icon: Construction, image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=300" },
    { label: "Traffic", icon: Bike, image: "https://images.unsplash.com/photo-1494578379344-d6c7102ed142?auto=format&fit=crop&q=80&w=300" },
    { label: "Other", icon: FileWarning, image: "https://images.unsplash.com/photo-1456428746267-325d277a646c?auto=format&fit=crop&q=80&w=300" },
];

export function QuickComplaint() {
    return (
        <Card className="h-full border-none shadow-sm dark:bg-slate-900/50">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <span className="bg-red-50 text-red-600 p-1.5 rounded-lg dark:bg-red-900/20 dark:text-red-400">
                        <FileWarning className="w-5 h-5" />
                    </span>
                    Report a Civic Issue
                </CardTitle>
                <p className="text-sm text-muted-foreground">Submit issues directly to authorities. Track progress in real-time.</p>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((item, index) => (
                    <button
                        key={index}
                        className="group relative flex flex-col items-center justify-center p-3 rounded-xl border border-border/50 bg-background hover:border-primary/50 hover:shadow-md transition-all duration-300 overflow-hidden text-center h-[100px]"
                    >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                            <img src={item.image} alt={item.label} className="w-full h-full object-cover grayscale group-hover:grayscale-0" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/50 opacity-90 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10 flex flex-col items-center gap-2">
                            <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                <item.icon className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-semibold text-foreground/80 group-hover:text-foreground transition-colors">{item.label}</span>
                        </div>
                    </button>
                ))}
            </CardContent>
        </Card>
    );
}
