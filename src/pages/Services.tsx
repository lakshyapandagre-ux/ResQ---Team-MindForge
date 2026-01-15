import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Droplets, Zap, Truck, Cone } from "lucide-react";

const SERVICES = [
    { id: 'water', title: 'Water Supply', icon: Droplets, description: 'Report leaks, shortages, or quality issues.' },
    { id: 'electricity', title: 'Electricity', icon: Zap, description: 'Power outages, loose wires, or meter issues.' },
    { id: 'garbage', title: 'Sanitation', icon: Truck, description: 'Garbage collection, overflowing bins.' },
    { id: 'road', title: 'Roads', icon: Cone, description: 'Potholes, broken streetlights, or blocks.' },
];

export function ServicesPage() {
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');
    const navigate = useNavigate();

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>

            <h1 className="text-3xl font-bold">City Services</h1>
            <p className="text-muted-foreground">Select a service to request support or report issues.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {SERVICES.map((service) => (
                    <Card
                        key={service.id}
                        className={`cursor-pointer hover:shadow-lg transition-all ${type === service.id ? 'ring-2 ring-indigo-500' : ''}`}
                        onClick={() => navigate(`/complaints?category=${service.title}`)}
                    >
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="p-3 rounded-full bg-slate-100">
                                <service.icon className="h-6 w-6 text-slate-700" />
                            </div>
                            <div>
                                <CardTitle>{service.title}</CardTitle>
                                <CardDescription>{service.description}</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
}
