import { AlertTriangle, Users, Package, Home } from "lucide-react";
import { StatCard } from "./StatCard";
import { EmergencyBanner } from "@/components/emergency/EmergencyBanner";
import { IncidentPanel } from "@/components/emergency/IncidentPanel";
import { AIRecommendations } from "@/components/emergency/AIRecommendations";
import { ResourceOverview } from "./ResourceOverview";
import { VolunteerStatus } from "./VolunteerStatus";

export function EmergencyDashboard() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 md:pb-0">
            {/* Banner */}
            <EmergencyBanner />

            {/* Emergency Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    title="Active Incidents"
                    value="2"
                    icon={AlertTriangle}
                    trend="+1"
                    trendUp={false}
                    description="Critical Priority"
                    className="border-l-4 border-l-red-500 from-red-50/50 to-transparent bg-gradient-to-br"
                />
                <StatCard
                    title="Affected People"
                    value="1,240"
                    icon={Users}
                    trend="+50"
                    trendUp={false}
                    description="Evacuation needed"
                    className="border-l-4 border-l-orange-500 from-orange-50/50 to-transparent bg-gradient-to-br"
                />
                <StatCard
                    title="Resources Deployed"
                    value="18"
                    icon={Package}
                    trend="85%"
                    trendUp={true}
                    description="Total Utilization"
                    className="border-l-4 border-l-blue-500 from-blue-50/50 to-transparent bg-gradient-to-br"
                />
                <StatCard
                    title="Shelter Capacity"
                    value="64%"
                    icon={Home}
                    trend="Available"
                    trendUp={true}
                    description="3 Shelters Open"
                    className="border-l-4 border-l-emerald-500 from-emerald-50/50 to-transparent bg-gradient-to-br"
                />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Col - Incidents */}
                <div className="lg:col-span-1 min-h-[400px]">
                    <IncidentPanel />
                </div>

                {/* Middle Col - AI */}
                <div className="lg:col-span-1 min-h-[400px]">
                    <AIRecommendations />
                </div>

                {/* Right Col - Resources & Volunteers */}
                <div className="lg:col-span-1 space-y-6">
                    <ResourceOverview />
                    <VolunteerStatus />
                </div>
            </div>
        </div>
    );
}
