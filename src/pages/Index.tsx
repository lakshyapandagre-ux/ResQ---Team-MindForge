import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { BottomNav } from "@/components/layout/BottomNav";
import { Complaints } from "@/pages/Complaints";
import { IncidentForm } from "@/components/forms/IncidentForm";
import { HelplineDirectory } from "@/components/dashboard/HelplineDirectory";
import RewardsPage from "@/pages/Rewards";
import { MissingRegistry } from "@/components/dashboard/MissingRegistry";
import { Events } from "@/pages/Events";
import Preparedness from "@/pages/Preparedness";
import Settings from "@/pages/Settings";
import { ProfilePage } from "@/pages/Profile";
import type { AppMode } from "@/types";

import { LiveLocationStreamer } from "@/components/sos/LiveLocationStreamer";

export function Index() {
    const [mode, setMode] = useState<AppMode>('community');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeItem, setActiveItem] = useState("dashboard");
    const [sosActive, setSosActive] = useState(false);

    // URL based navigation
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        const path = location.pathname.endsWith('/') && location.pathname.length > 1
            ? location.pathname.slice(0, -1)
            : location.pathname;

        if (path === '/complaints') setActiveItem('complaints');
        else if (path === '/rewards') setActiveItem('rewards');
        else if (path === '/profile') setActiveItem('profile');
        else if (path === '/settings') setActiveItem('settings');
        else if (path === '/events') setActiveItem('events');
        else if (path === '/missing') setActiveItem('missing');
        else if (path === '/helpline') setActiveItem('helpline');
        else if (path === '/preparedness') setActiveItem('preparedness');
        else if (path === '/emergency') {
            setMode('emergency');
            setActiveItem('command');
        }
        else if (path === '/') {
            setMode('community');
            setActiveItem('dashboard');
        }
    }, [location.pathname]);

    // Listen for SOS toggle events from anywhere
    useEffect(() => {
        const handleSosEvent = (e: CustomEvent) => {
            setSosActive(e.detail.active);
        };
        window.addEventListener('resq-sos-toggle' as any, handleSosEvent as any);
        return () => window.removeEventListener('resq-sos-toggle' as any, handleSosEvent as any);
    }, []);

    return (
        <div className="min-h-screen bg-secondary/30 font-sans text-foreground">
            <LiveLocationStreamer isActive={sosActive} />
            {/* Fixed Header */}
            <div className="sticky top-0 z-50 w-full">
                <Header
                    mode={mode}
                    onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                />
            </div>

            <div className="flex pt-0">
                {/* Fixed Sidebar */}
                <Sidebar
                    mode={mode}
                    isOpen={isSidebarOpen}
                    activeItem={activeItem}
                    onItemClick={(id) => {
                        setIsSidebarOpen(false);
                        if (id === 'dashboard') navigate('/');
                        else if (id === 'command') navigate('/emergency');
                        else navigate(`/${id}`);
                    }}
                    onClose={() => setIsSidebarOpen(false)}
                />

                {/* Main Content Area */}
                <main className="flex-1 transition-all duration-300 md:ml-[280px] p-4 sm:p-6 lg:p-8 w-full overflow-y-auto h-[calc(100vh-64px)]">
                    <div className="max-w-[1600px] mx-auto w-full">
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
                        ) : activeItem === 'rewards' ? (
                            <RewardsPage />
                        ) : activeItem === 'settings' ? (
                            <Settings />
                        ) : activeItem === 'profile' ? (
                            <ProfilePage />
                        ) : (
                            <div className="h-[60vh] flex items-center justify-center text-muted-foreground">
                                <div className="text-center space-y-2">
                                    <h2 className="text-2xl font-bold capitalize">{activeItem}</h2>
                                    <p>This module is under development.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                <BottomNav
                    mode={mode}
                    onModeChange={(m) => {
                        if (m === 'emergency') navigate('/emergency');
                        else navigate('/');
                    }}
                    onProfileClick={() => navigate('/profile')}
                />
            </div>
        </div>
    );
}
