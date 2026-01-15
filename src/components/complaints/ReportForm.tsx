import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    MapPin, X,
    Loader2, Upload, ChevronRight, CheckCircle2, AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const complaintSchema = z.object({
    title: z.string().min(5, "Title too short"),
    category: z.string().min(1, "Required"),
    location: z.string().min(1, "Required"),
    description: z.string().min(10, "Describe in detail"),
});

// Mock Categories & Locations
const CATEGORIES = ["Garbage", "Road", "Drainage", "Electricity", "Water", "Traffic", "Other"];
const LOCATIONS = ["Vijay Nagar", "Palasia", "Bhawarkua", "Rajwada", "Annapurna", "LIG Colony", "Rau"];

export function ReportForm({ onSuccess }: { onSuccess?: () => void }) {
    const [step, setStep] = useState(1);
    const [images, setImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof complaintSchema>>({
        resolver: zodResolver(complaintSchema),
        defaultValues: {
            title: "",
            category: "",
            location: "",
            description: "",
        }
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploading(true);
            // Simulate upload
            setTimeout(() => {
                const url = URL.createObjectURL(e.target.files![0]);
                setImages(prev => [...prev, url]);
                setUploading(false);
            }, 1000);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setUploading(true);
            setTimeout(() => {
                const url = URL.createObjectURL(e.dataTransfer.files[0]);
                setImages(prev => [...prev, url]);
                setUploading(false);
            }, 1000);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: z.infer<typeof complaintSchema>) => {
        setIsSubmitting(true);
        console.log("Submitting Complaint:", data);
        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 2000));

        toast.success("Complaint Submitted Successfully", {
            description: "Ref: #" + Math.random().toString(36).substr(2, 6).toUpperCase(),
            icon: <CheckCircle2 className="text-green-500" />
        });

        setIsSubmitting(false);
        setStep(1);
        form.reset();
        setImages([]);
        onSuccess?.();
    };

    const nextStep = async () => {
        let fieldsToValidate: any[] = [];
        if (step === 1) fieldsToValidate = ['location', 'category'];
        if (step === 2) fieldsToValidate = ['title', 'description'];

        const isValid = await form.trigger(fieldsToValidate);
        if (isValid) setStep(s => s + 1);
    };

    return (
        <Card className="border-0 shadow-lg ring-1 ring-slate-200 overflow-hidden sticky top-24">
            <CardHeader className="bg-slate-50 border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <AlertCircle className="h-5 w-5 text-indigo-600" />
                        Report Issue
                    </CardTitle>
                    <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded border">Step {step}/3</span>
                </div>
                <Progress value={(step / 3) * 100} className="h-1.5" />
            </CardHeader>
            <CardContent className="pt-6">
                <form>
                    {step === 1 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Where is the issue?</label>
                                <Select onValueChange={(val) => form.setValue("location", val)} defaultValue={form.getValues("location")}>
                                    <SelectTrigger className="bg-slate-50/50">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <MapPin className="h-4 w-4" />
                                            <SelectValue placeholder="Select Location" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {LOCATIONS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.location && <p className="text-xs text-red-500">{form.formState.errors.location.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Issue Category</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {CATEGORIES.map(cat => (
                                        <div
                                            key={cat}
                                            onClick={() => form.setValue("category", cat)}
                                            className={cn(
                                                "cursor-pointer text-xs font-medium p-2.5 rounded-lg border text-center transition-all",
                                                form.watch("category") === cat
                                                    ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm"
                                                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                            )}
                                        >
                                            {cat}
                                        </div>
                                    ))}
                                </div>
                                {form.formState.errors.category && <p className="text-xs text-red-500">{form.formState.errors.category.message}</p>}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Title</label>
                                <Input
                                    placeholder="e.g. Broken Streetlight"
                                    className="bg-slate-50/50"
                                    {...form.register("title")}
                                />
                                {form.formState.errors.title && <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    placeholder="Provide more details..."
                                    className="bg-slate-50/50 min-h-[120px] resize-none"
                                    {...form.register("description")}
                                />
                                {form.formState.errors.description && <p className="text-xs text-red-500">{form.formState.errors.description.message}</p>}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                            <div
                                className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    hidden
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    {uploading ? <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" /> : <Upload className="h-5 w-5 text-indigo-600" />}
                                </div>
                                <p className="text-sm font-medium text-slate-700">Click to upload or drag & drop</p>
                                <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                            </div>

                            {/* Image Preview Grid */}
                            {images.length > 0 && (
                                <div className="grid grid-cols-3 gap-2">
                                    {images.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border group">
                                            <img src={img} alt="preview" className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </form>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4 bg-slate-50/50">
                {step > 1 ? (
                    <Button variant="ghost" onClick={() => setStep(s => s - 1)}>Back</Button>
                ) : (
                    <span /> /* Spacer */
                )}

                {step < 3 ? (
                    <Button onClick={nextStep} className="bg-indigo-600 hover:bg-indigo-700">
                        Next Step <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white">
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                        Submit Complaint
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
