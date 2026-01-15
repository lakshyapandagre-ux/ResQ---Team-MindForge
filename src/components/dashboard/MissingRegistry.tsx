import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Upload, MapPin, Calendar, Gem
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
// import { cn } from "@/lib/utils";

// --- Types ---
type Category = 'Wallet' | 'Phone' | 'Documents' | 'Jewelry' | 'Bag' | 'Other';
type Location = 'Vijay Nagar' | 'Palasia' | 'Rajwada' | 'Bhawarkua' | 'Annapurna' | 'Sapna Sangeeta';

interface MissingItem {
    id: string;
    image: string;
    name: string;
    category: Category;
    location: Location;
    date: string;
    description: string;
    reward: string;
    status: 'lost' | 'found' | 'returned';
}

// --- Dummy Data ---
const INITIAL_ITEMS: MissingItem[] = [
    {
        id: '1',
        image: 'https://images.unsplash.com/photo-1621600411688-4be93cd68504?q=80&w=300&auto=format&fit=crop', // Wallet
        name: 'Leather Wallet',
        category: 'Wallet',
        location: 'Vijay Nagar',
        date: '2024-03-10',
        description: 'Brown leather wallet, contained DL and Credit Cards.',
        reward: '₹500 Voucher + 50 Points',
        status: 'lost'
    },
    {
        id: '2',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=300&auto=format&fit=crop', // Phone
        name: 'iPhone 13 Blue',
        category: 'Phone',
        location: 'Palasia',
        date: '2024-03-12',
        description: 'Blue iPhone 13 in a clear case. Lock screen has a dog photo.',
        reward: '₹1000 Reward + 100 Points',
        status: 'lost'
    },
    {
        id: '3',
        image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=300&auto=format&fit=crop', // Documents
        name: 'Aadhar Card Folder',
        category: 'Documents',
        location: 'Bhawarkua',
        date: '2024-03-14',
        description: 'Transparent folder with original 10th marksheets.',
        reward: 'High Priority',
        status: 'lost'
    },
    {
        id: '4',
        image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=300&auto=format&fit=crop', // Bag
        name: 'College Backpack',
        category: 'Bag',
        location: 'Annapurna',
        date: '2024-03-13',
        description: 'Black Nike bag left at bus stop.',
        reward: '50 Points',
        status: 'lost'
    },
    {
        id: '5',
        image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=300&auto=format&fit=crop', // Ring
        name: 'Gold Ring',
        category: 'Jewelry',
        location: 'Rajwada',
        date: '2024-03-11',
        description: 'Small gold ring with white stone.',
        reward: '₹2000 Voucher',
        status: 'lost'
    },
    {
        id: '6',
        image: 'https://images.unsplash.com/photo-1599202860130-f600f4948364?q=80&w=300&auto=format&fit=crop', // Keys
        name: 'Activa Keys',
        category: 'Other',
        location: 'Sapna Sangeeta',
        date: '2024-03-15',
        description: 'Honda Activa keys with a marvel keychain.',
        reward: '50 Points',
        status: 'lost'
    }
];

// --- Form Schema ---
const reportSchema = z.object({
    itemName: z.string().min(2, "Name is required"),
    category: z.string().min(1, "Category is required"),
    description: z.string().min(10, "Please provide more details"),
    location: z.string().min(1, "Location is required"),
    dateLost: z.string().min(1, "Date is required"),
    contactName: z.string().min(2, "Name is required"),
    contactPhone: z.string().regex(/^\d{10}$/, "Valid 10-digit number required"),
});

export function MissingRegistry() {
    const [items, setItems] = useState<MissingItem[]>(INITIAL_ITEMS);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const form = useForm<z.infer<typeof reportSchema>>({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            itemName: "",
            category: "",
            description: "",
            location: "",
            dateLost: "",
            contactName: "",
            contactPhone: "",
        }
    });

    const onSubmit = (data: z.infer<typeof reportSchema>) => {
        const newItem: MissingItem = {
            id: Date.now().toString(),
            image: "https://images.unsplash.com/photo-1531297461136-82af022f0b79?q=80&w=300&auto=format&fit=crop", // Placeholder
            name: data.itemName,
            category: data.category as Category,
            location: data.location as Location,
            date: data.dateLost,
            description: data.description,
            reward: "50 Points", // Default reward
            status: 'lost'
        };

        setItems([newItem, ...items]);
        form.reset();
        toast.success("Missing Report Submitted!", {
            description: "Your item has been added to the registry."
        });
    };

    const categories = ['Wallet', 'Phone', 'Documents', 'Jewelry', 'Bag', 'Other'];
    const locations = ['Vijay Nagar', 'Palasia', 'Rajwada', 'Bhawarkua', 'Annapurna', 'Sapna Sangeeta'];

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20 animate-in fade-in duration-500">

            {/* Title / Mobile Header */}
            <div className="lg:col-span-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            Missing Registry
                        </h1>
                        <p className="text-muted-foreground">Report lost items and help the community recover them.</p>
                    </div>
                    <div className="relative w-full md:w-64">
                        {/* Search Icon placeholder if icon not imported, but wait, Search was unused and I tried to remove it. 
                            I'll use the Search icon if I import it. 
                            I'll just use a simple input for now or re-add Search to imports.
                         */}
                        <Input
                            placeholder="Search items..."
                            className="bg-white/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* LEFT COLUMN: Submit Report Form */}
            <div className="lg:col-span-4 space-y-6">
                <Card className="border-t-4 border-t-blue-500 shadow-lg hover:shadow-xl transition-shadow bg-white/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Upload className="h-5 w-5 text-blue-600" />
                            Report Missing Item
                        </CardTitle>
                        <CardDescription>
                            Fill in the details to list your lost item in the registry.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                            {/* Item Name */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Item Name</label>
                                <Input placeholder="e.g. Blue Leather Wallet" {...form.register('itemName')} />
                                {form.formState.errors.itemName && <span className="text-xs text-red-500">{form.formState.errors.itemName.message}</span>}
                            </div>

                            {/* Category */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Category</label>
                                <Select onValueChange={(val) => form.setValue('category', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.category && <span className="text-xs text-red-500">{form.formState.errors.category.message}</span>}
                            </div>

                            {/* Location & Date */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Last Location</label>
                                    <Select onValueChange={(val) => form.setValue('location', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Area" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {locations.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {form.formState.errors.location && <span className="text-xs text-red-500">{form.formState.errors.location.message}</span>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Date Lost</label>
                                    <Input type="date" {...form.register('dateLost')} />
                                    {form.formState.errors.dateLost && <span className="text-xs text-red-500">{form.formState.errors.dateLost.message}</span>}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Description</label>
                                <Textarea placeholder="Describe key features, colors, identifiers..." className="resize-none" {...form.register('description')} />
                                {form.formState.errors.description && <span className="text-xs text-red-500">{form.formState.errors.description.message}</span>}
                            </div>

                            {/* Contact Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Contact Name</label>
                                    <Input placeholder="Your Name" {...form.register('contactName')} />
                                    {form.formState.errors.contactName && <span className="text-xs text-red-500">{form.formState.errors.contactName.message}</span>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Phone</label>
                                    <Input placeholder="9876543210" {...form.register('contactPhone')} />
                                    {form.formState.errors.contactPhone && <span className="text-xs text-red-500">{form.formState.errors.contactPhone.message}</span>}
                                </div>
                            </div>

                            {/* Image Placeholder */}
                            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-slate-50 transition-colors cursor-pointer">
                                <Upload className="h-8 w-8 mb-2 text-slate-400" />
                                <span className="text-xs">Click to upload image</span>
                            </div>

                            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25">
                                Submit Report
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* RIGHT COLUMN: Feed */}
            <div className="lg:col-span-8 space-y-6">

                {/* Gamification Banner */}
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-full shadow-sm text-2xl">🎁</div>
                        <div>
                            <h3 className="font-bold text-amber-900">Return items & earn rewards!</h3>
                            <p className="text-xs text-amber-700">Get vouchers, community points, and badges for helping verified owners.</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <Badge
                        variant={selectedCategory === 'All' ? 'default' : 'outline'}
                        className="cursor-pointer rounded-full px-4 py-1.5"
                        onClick={() => setSelectedCategory('All')}
                    >
                        All
                    </Badge>
                    {categories.map(cat => (
                        <Badge
                            key={cat}
                            variant={selectedCategory === cat ? 'default' : 'outline'}
                            className="cursor-pointer rounded-full px-4 py-1.5 whitespace-nowrap"
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </Badge>
                    ))}
                </div>

                {/* Feed List */}
                <div className="space-y-4">
                    {filteredItems.map(item => (
                        <Card key={item.id} className="group overflow-hidden border-slate-200/60 hover:border-slate-300 hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm">
                            <div className="flex flex-col sm:flex-row">
                                {/* Image */}
                                <div className="sm:w-48 h-48 sm:h-auto shrink-0 relative overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-2 left-2">
                                        <Badge className="bg-black/50 hover:bg-black/70 backdrop-blur-md text-white border-none">{item.category}</Badge>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-5 flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                                                <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {item.location}</span>
                                                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {item.date}</span>
                                                </div>
                                            </div>
                                            {/* Reward Badge */}
                                            <div className="hidden sm:block">
                                                <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200 shadow-sm gap-1">
                                                    <Gem className="h-3 w-3" /> {item.reward}
                                                </Badge>
                                            </div>
                                        </div>

                                        <p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>

                                        {/* Mobile Reward Badge */}
                                        <div className="sm:hidden mt-2">
                                            <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200 shadow-sm gap-1 w-full justify-center">
                                                <Gem className="h-3 w-3" /> {item.reward}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100">
                                        <div className="text-xs text-muted-foreground font-medium">
                                            Reported 2 days ago
                                        </div>
                                        <FoundItemModal item={item} />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

function FoundItemModal({ item }: { item: MissingItem }) {
    const [open, setOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setOpen(false);
        toast.success("Found Report Submitted!", {
            description: "The owner will be notified. Thank you for your honesty! 🎉"
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-500/20 rounded-full px-6">
                    I Found This Item
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Report Found Item</DialogTitle>
                    <DialogDescription>
                        Awesome! Please provide details to verify and return the item.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="p-3 bg-slate-50 rounded-lg flex gap-3 mb-4">
                        <img src={item.image} className="w-12 h-12 rounded object-cover" alt="" />
                        <div>
                            <p className="font-semibold text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.location}</p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Your Name</label>
                        <Input required placeholder="Enter your name" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Phone Number</label>
                        <Input required type="tel" placeholder="For verification" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Where did you find it?</label>
                        <Textarea required placeholder="Describe the specific location..." />
                    </div>
                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                        Submit & Notify Owner
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
