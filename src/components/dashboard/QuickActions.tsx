import { useState } from "react";
import { AlertTriangle, Asterisk, Briefcase, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SOSModal } from "@/components/modals/SOSModal";
import { ServicesModal } from "@/components/modals/ServicesModal";
import { FacilitiesModal } from "@/components/modals/FacilitiesModal";

function QuickActionItem({
    icon: Icon,
    title,
    subtitle,
    color,
    bg,
    onClick
}: {
    icon: any,
    title: string,
    subtitle: string,
    color: string,
    bg: string,
    onClick: () => void
}) {
    return (
        <button
            onClick={onClick}
            className="group flex h-full w-full flex-col items-start rounded-[2rem] bg-white p-4 md:p-5 text-left shadow-sm transition-all hover:translate-y-[-2px] hover:shadow-md dark:bg-slate-900 border border-slate-100 dark:border-slate-800 relative overflow-hidden"
        >
            <div className={cn("mb-4 flex h-12 w-12 items-center justify-center rounded-full transition-colors relative z-10", bg)}>
                <Icon className={cn("h-6 w-6 transition-transform group-hover:scale-110", color)} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 relative z-10">{title}</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 relative z-10">{subtitle}</p>

            {/* Subtle decorative circle */}
            <div className={cn("absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-10 transition-transform group-hover:scale-150", color.replace('text-', 'bg-'))} />
        </button>
    );
}

export function QuickActions() {
    const navigate = useNavigate();
    const [sosOpen, setSosOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [facilitiesOpen, setFacilitiesOpen] = useState(false);

    return (
        <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400 pl-1">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
                <QuickActionItem
                    icon={AlertTriangle}
                    title="Hazards"
                    subtitle="Report issue"
                    color="text-red-500"
                    bg="bg-red-50"
                    onClick={() => navigate('/complaints')}
                />
                <QuickActionItem
                    icon={Asterisk}
                    title="Emergency"
                    subtitle="SOS Alert"
                    color="text-orange-500"
                    bg="bg-orange-50"
                    onClick={() => setSosOpen(true)}
                />
                <QuickActionItem
                    icon={Briefcase}
                    title="Services"
                    subtitle="Request"
                    color="text-teal-600"
                    bg="bg-teal-50"
                    onClick={() => setServicesOpen(true)}
                />
                <QuickActionItem
                    icon={Calendar}
                    title="Facilities"
                    subtitle="Booking"
                    color="text-blue-500"
                    bg="bg-blue-50"
                    onClick={() => setFacilitiesOpen(true)}
                />
            </div>

            <SOSModal open={sosOpen} onOpenChange={setSosOpen} />
            <ServicesModal open={servicesOpen} onOpenChange={setServicesOpen} />
            <FacilitiesModal open={facilitiesOpen} onOpenChange={setFacilitiesOpen} />
        </div>
    );
}
