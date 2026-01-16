import {
    LayoutDashboard,
    FileText,
    UserSearch,
    Calendar,
    ShieldCheck,
    Phone,
    Radio,
    AlertTriangle,
    Package,
    Users,
    Home,
    Megaphone,
    Settings,
    Gift,
    X,
    LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';
import type { AppMode } from '@/types';

interface SidebarProps {
    mode: AppMode;
    isOpen: boolean;
    activeItem: string;
    onItemClick: (item: string) => void;
    onClose: () => void;
}

import { useAuth } from "@/contexts/AuthContext";

export function Sidebar({ mode, isOpen, activeItem, onItemClick, onClose }: SidebarProps) {
    const isEmergency = mode === 'emergency';
    const { profile, signOut } = useAuth();
    // Fetch removed - relying on context

    const communityItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'complaints', label: 'शिकायत (Complaints)', icon: FileText },
        { id: 'missing', label: 'Missing Registry', icon: UserSearch },
        { id: 'events', label: 'Events', icon: Calendar },
        { id: 'preparedness', label: 'Preparedness', icon: ShieldCheck },
        { id: 'rewards', label: 'Rewards', icon: Gift },
        { id: 'helpline', label: 'Helpline', icon: Phone },
    ];

    const emergencyItems = [
        { id: 'command', label: 'Command Center', icon: Radio },
        { id: 'incidents', label: 'Active Incidents', icon: AlertTriangle },
        { id: 'resources', label: 'Resources', icon: Package },
        { id: 'volunteers', label: 'Volunteers', icon: Users },
        { id: 'shelters', label: 'Shelters', icon: Home },
        { id: 'broadcast', label: 'Broadcast', icon: Megaphone },
    ];

    const items = isEmergency ? emergencyItems : communityItems;

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside className={cn(
                "fixed left-0 z-40 h-[calc(100vh-64px)] w-[280px] bg-card border-r shadow-2xl transition-all duration-300 md:translate-x-0 ease-in-out",
                "top-16", // Adjusted for h-16 header
                isOpen ? "translate-x-0" : "-translate-x-full",
                // Mobile adjustments
                "md:shadow-none md:border-r border-border"
            )}>
                {/* Close button on mobile */}
                <div className="md:hidden absolute top-2 right-2 z-50">
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-100 rounded-full">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">

                    {/* Visual Header / Profile Section */}
                    <div className="relative p-6 px-5 pb-2">
                        <div className="absolute inset-0 h-32 bg-gradient-to-br from-teal-600/10 to-blue-600/5 dark:from-teal-900/20 dark:to-blue-900/10 pointer-events-none" />

                        <div className="relative z-10 flex items-center gap-4 mb-6">
                            <div className="relative">
                                <Avatar className="h-12 w-12 border-2 border-white shadow-md ring-2 ring-teal-50">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.name || 'User'}`} />
                                    <AvatarFallback>{profile?.name?.[0] || 'U'}</AvatarFallback>
                                </Avatar>
                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100">{profile?.name || 'Citizen'}</h3>
                                <p className="text-xs font-medium text-teal-600 dark:text-teal-400 capitalize">{profile?.role || 'Guest'} • {profile?.city || 'Indore'}</p>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
                        <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 mt-2">Menu</p>
                        {items.map((item) => {
                            const isActive = activeItem === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => onItemClick(item.id)}
                                    className={cn(
                                        "group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 overflow-hidden",
                                        isActive
                                            ? (isEmergency ? "bg-red-50 text-red-700 shadow-sm" : "bg-white text-blue-600 shadow-sm ring-1 ring-slate-100")
                                            : "text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm"
                                    )}
                                >
                                    {isActive && (
                                        <div className={cn("absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full", isEmergency ? "bg-red-500" : "bg-blue-600")} />
                                    )}

                                    <item.icon className={cn(
                                        "h-5 w-5 transition-transform group-hover:scale-110",
                                        isActive ? (isEmergency ? "text-red-600" : "text-blue-600") : "text-slate-400"
                                    )} />

                                    <span className="relative z-10">{item.label}</span>

                                    {isActive && (
                                        <div className="ml-auto">
                                            <div className={cn("h-1.5 w-1.5 rounded-full", isEmergency ? "bg-red-500" : "bg-blue-600")} />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Banner / Ad Space (Optional "Image" element as requested active-feel) */}
                    {!isEmergency && (
                        <div className="px-4 pb-2">
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-4 text-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow group">
                                {/* Decorative circles */}
                                <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/20 blur-xl group-hover:scale-110 transition-transform" />
                                <div className="absolute -left-4 -bottom-4 h-16 w-16 rounded-full bg-black/10 blur-xl" />

                                <div className="relative z-10">
                                    <p className="text-xs font-medium text-indigo-100 mb-1">Upcoming Event</p>
                                    <h4 className="text-sm font-bold mb-3">City Clean-up Drive</h4>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="w-full h-8 text-xs font-semibold bg-white text-indigo-600 hover:bg-indigo-50 border-none shadow-none"
                                        onClick={() => onItemClick('events')}
                                    >
                                        Register Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bottom Items */}
                    <div className="p-4 mt-auto border-t border-border/50 bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
                        <div className="space-y-1">
                            <button
                                onClick={() => onItemClick('settings')}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                            >
                                <Settings className="h-5 w-5 text-slate-400" />
                                Settings
                            </button>
                            <button
                                onClick={() => signOut()}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                                <LogOut className="h-5 w-5 text-slate-400" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
