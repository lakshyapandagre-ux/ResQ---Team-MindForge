import { useState } from "react";
import { Phone, Shield, Search, Plus, Trash2, Heart, User, Building2, Flame, Ambulance } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Unused import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Contact {
    id: string;
    name: string;
    description: string;
    number: string;
    icon: any;
    isOfficial: boolean;
    colorClass: string;
}

export function HelplineDirectory() {
    const [searchQuery, setSearchQuery] = useState("");
    const [personalContacts, setPersonalContacts] = useState<Contact[]>([
        { id: "p1", name: "Mom", description: "Family", number: "+91 98765 43210", icon: Heart, isOfficial: false, colorClass: "text-pink-500 bg-pink-50 border-pink-100" },
        { id: "p2", name: "Dr. Sharma", description: "Family Doctor", number: "+91 98765 12345", icon: User, isOfficial: false, colorClass: "text-blue-500 bg-blue-50 border-blue-100" },
    ]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newContact, setNewContact] = useState({ name: "", relation: "", number: "" });

    const officialContacts: Contact[] = [
        { id: "e1", name: "Police Control Room", description: "Emergency", number: "100", icon: Shield, isOfficial: true, colorClass: "text-blue-600 bg-blue-50 border-blue-100" },
        { id: "e2", name: "Fire Brigade", description: "Fire Emergency", number: "101", icon: Flame, isOfficial: true, colorClass: "text-orange-600 bg-orange-50 border-orange-100" },
        { id: "e3", name: "Ambulance", description: "Medical Emergency", number: "102", icon: Ambulance, isOfficial: true, colorClass: "text-red-600 bg-red-50 border-red-100" },
        { id: "e4", name: "National Emergency", description: "All-in-one", number: "112", icon: Shield, isOfficial: true, colorClass: "text-purple-600 bg-purple-50 border-purple-100" },
        { id: "e5", name: "Women Helpline", description: "Support", number: "1091", icon: User, isOfficial: true, colorClass: "text-pink-600 bg-pink-50 border-pink-100" },
        { id: "e6", name: "Disaster Management", description: "Disaster", number: "1078", icon: Building2, isOfficial: true, colorClass: "text-slate-600 bg-slate-50 border-slate-100" },
    ];

    const handleAddContact = () => {
        if (!newContact.name || !newContact.number) {
            toast.error("Please fill in layout details");
            return;
        }
        const contact: Contact = {
            id: Date.now().toString(),
            name: newContact.name,
            description: newContact.relation || "Personal",
            number: newContact.number,
            icon: Heart,
            isOfficial: false,
            colorClass: "text-emerald-600 bg-emerald-50 border-emerald-100"
        };
        setPersonalContacts([...personalContacts, contact]);
        setNewContact({ name: "", relation: "", number: "" });
        setIsAddDialogOpen(false);
        toast.success("Contact added successfully");
    };

    const handleDeleteContact = (id: string) => {
        setPersonalContacts(personalContacts.filter(c => c.id !== id));
        toast.success("Contact removed");
    };

    const filteredOfficial = officialContacts.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.number.includes(searchQuery)
    );

    const filteredPersonal = personalContacts.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.number.includes(searchQuery)
    );

    const ContactCard = ({ contact }: { contact: Contact }) => (
        <div className={cn(
            "flex items-center justify-between p-4 rounded-xl border transition-all hover:shadow-md",
            contact.colorClass,
            contact.isOfficial ? "hover:border-blue-200" : "hover:border-emerald-200"
        )}>
            <div className="flex items-center gap-4">
                <div className={cn("p-2.5 rounded-full bg-white shadow-sm", contact.colorClass.split(" ")[0])}>
                    <contact.icon className="h-5 w-5 fill-current/10" />
                </div>
                <div>
                    <h3 className="font-semibold text-slate-800">{contact.name}</h3>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{contact.description}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <a href={`tel:${contact.number}`}>
                    <Button size="sm" variant={contact.isOfficial ? "default" : "secondary"} className="rounded-full px-4 font-semibold shadow-sm">
                        <Phone className="h-3.5 w-3.5 mr-2" />
                        {contact.number}
                    </Button>
                </a>
                {!contact.isOfficial && (
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500 rounded-full" onClick={() => handleDeleteContact(contact.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                        Emergency Helpline
                    </h2>
                    <p className="text-muted-foreground">Direct access to critical services and personal contacts.</p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search contacts..."
                            className="pl-9 bg-white/50 border-slate-200 focus:bg-white transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Official Numbers Grid */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="rounded-full px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
                        <Shield className="h-3 w-3 mr-1" /> Official Services
                    </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredOfficial.map(contact => (
                        <ContactCard key={contact.id} contact={contact} />
                    ))}
                    {filteredOfficial.length === 0 && (
                        <p className="text-muted-foreground text-sm col-span-full py-4 text-center">No official services found matching your search.</p>
                    )}
                </div>
            </div>

            {/* Personal Contacts Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="rounded-full px-3 py-1 bg-emerald-50 text-emerald-700 border-emerald-200">
                            <Heart className="h-3 w-3 mr-1" /> My Circle
                        </Badge>
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="rounded-full border-dashed border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400">
                                <Plus className="h-4 w-4 mr-1" /> Add Contact
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Personal Contact</DialogTitle>
                                <DialogDescription>
                                    Add a trusted contact for quick access during emergencies.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Dad, Best Friend"
                                        value={newContact.name}
                                        onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="relation">Relation / Description</Label>
                                    <Input
                                        id="relation"
                                        placeholder="e.g. Family, Neighbor"
                                        value={newContact.relation}
                                        onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="number">Phone Number</Label>
                                    <Input
                                        id="number"
                                        placeholder="+91 XXXXX XXXXX"
                                        value={newContact.number}
                                        onChange={(e) => setNewContact({ ...newContact, number: e.target.value })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleAddContact} disabled={!newContact.name || !newContact.number}>Save Contact</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPersonal.map(contact => (
                        <ContactCard key={contact.id} contact={contact} />
                    ))}
                    {filteredPersonal.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-xl border-slate-100 bg-slate-50/50">
                            <div className="p-3 bg-white rounded-full shadow-sm mb-3">
                                <User className="h-6 w-6 text-slate-300" />
                            </div>
                            <p className="text-sm font-medium text-slate-500">No personal contacts added yet.</p>
                            <Button variant="link" size="sm" className="text-emerald-600" onClick={() => setIsAddDialogOpen(true)}>Add your first contact</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
