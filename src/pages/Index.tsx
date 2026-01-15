import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { BottomNav } from "@/components/layout/BottomNav";
import { Complaints } from "@/pages/Complaints";
import { IncidentForm } from "@/components/forms/IncidentForm";
import { HelplineDirectory } from "@/components/dashboard/HelplineDirectory";
import { MissingRegistry } from "@/components/dashboard/MissingRegistry";
import { Events } from "@/pages/Events";
import { Preparedness } from "@/components/dashboard/Preparedness";
import type { AppMode } from "@/types";

export function Index() {
    const [mode, setMode] = useState<AppMode>('community');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeItem, setActiveItem] = useState("dashboard");

    // URL based navigation
    const location = useLocation();
    useEffect(() => {
        if (location.pathname === '/complaints') setActiveItem('complaints');
        else if (location.pathname === '/') setActiveItem(mode === 'emergency' ? 'command' : 'dashboard');
        // Add others if needed
    }, [location.pathname, mode]);

    return (
        <div className="min-h-screen bg-secondary/30 font-sans text-foreground">
            <Header
                mode={mode}
                onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <Sidebar
                mode={mode}
                isOpen={isSidebarOpen}
                activeItem={activeItem}
                onItemClick={(id) => {
                    setActiveItem(id);
                    setIsSidebarOpen(false);
                }}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="transition-all duration-300 md:pl-[264px] pt-6 pb-20 md:pb-6 px-4 md:px-6 container mx-auto">
                {(activeItem === 'dashboard' || activeItem === 'command') ? (
                    <Dashboard mode={mode} />
                ) : activeItem === 'complaints' ? (
                    <Complaints />
                ) : activeItem === 'incidents' ? (
                    <div className="max-w-2xl mx-auto">
                        <IncidentForm />
                    </div>
                ) : activeItem === 'helpline' ? (
                    <div className="max-w-4xl mx-auto">
                        <HelplineDirectory />
                    </div>
                ) : activeItem === 'missing' ? (
                    <MissingRegistry />
                ) : activeItem === 'events' ? (
                    <Events />
                ) : activeItem === 'preparedness' ? (
                    <Preparedness />
                ) : (
                    <div className="h-[60vh] flex items-center justify-center text-muted-foreground">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold capitalize">{activeItem}</h2>
                            <p>This module is under development.</p>
                        </div>
                    </div>
                )}
            </main>

            <BottomNav mode={mode} onModeChange={setMode} />
        </div>
    );
}
