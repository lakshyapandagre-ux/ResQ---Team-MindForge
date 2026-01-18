import { useState, useEffect } from 'react';
import { formatDistanceToNow } from "date-fns";
import {
    Menu,
    Bell,
    Shield,
    User,
    Settings,
    LogOut,
    Sun,
    Moon,
    Ambulance,
    Flame,
    CheckCircle2,
    CalendarClock,
    Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import type { AppMode } from '@/types';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
    mode: AppMode;
    onModeChange: (mode: AppMode) => void;
    onMenuToggle: () => void;
}

export function Header({ mode, onMenuToggle }: Omit<HeaderProps, 'onModeChange'>) {
    const { profile, signOut } = useAuth();
    const navigate = useNavigate();
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
        }
        return 'light';
    });

    const [isSOSOpen, setIsSOSOpen] = useState(false);

    const isEmergency = mode === 'emergency';

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    // Notifications State
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const getNotificationStyle = (type: string) => {
        switch (type) {
            case 'resolved': return { icon: CheckCircle2, color: 'text-green-500' };
            case 'reminder': return { icon: CalendarClock, color: 'text-blue-500' };
            case 'reward': return { icon: Trophy, color: 'text-amber-500' };
            case 'alert': return { icon: Flame, color: 'text-red-500' };
            default: return { icon: Bell, color: 'text-slate-500' };
        }
    };

    const fetchNotifications = async () => {
        if (!profile?.id) return;
        try {
            const data = await db.getNotifications(profile.id);
            // Transform for UI
            const mapped = data.map((n: any) => ({
                id: n.id,
                title: n.title,
                desc: n.message,
                type: n.type,
                read: n.read,
                time: formatDistanceToNow(new Date(n.created_at), { addSuffix: true }),
                // Visuals based on type
                ...getNotificationStyle(n.type)
            }));
            setNotifications(mapped);
            setUnreadCount(mapped.filter((n: any) => !n.read).length);
        } catch (error: any) {
            if (error.name === 'AbortError') return;
            console.error(error);
        }
    };

    useEffect(() => {
        if (profile?.id) {
            fetchNotifications();

            // Subscribe
            const channel = supabase
                .channel(`notifications:${profile.id}`)
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${profile.id}`
                }, () => {
                    fetchNotifications();
                    // Optional: Play sound or show toast
                })
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [profile?.id]);

    const markAsRead = async () => {
        if (unreadCount === 0) return;
        // Optimistic
        setUnreadCount(0);
        // We'd need a bulk update or just loop. For now, we assume user opening calls individual or bulk.
        // Let's mark all loaded specific ids as read logic if we had a button, but mostly we mark on click or open?
        // For simplicity: "Mark all as read" button will loop.
        notifications.forEach(n => {
            if (!n.read) db.markNotificationRead(n.id);
        });
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const emergencyContacts = [
        { name: 'Police', number: '100', icon: Shield, color: 'bg-blue-600', description: 'Immediate Police Assistance' },
        { name: 'Ambulance', number: '108', icon: Ambulance, color: 'bg-red-600', description: 'Medical Emergency Service' },
        { name: 'Fire', number: '101', icon: Flame, color: 'bg-orange-600', description: 'Fire & Rescue Services' },
    ];

    return (
        <header className={cn(
            "sticky top-0 z-50 w-full h-16 border-b transition-all duration-300",
            "backdrop-blur-md supports-[backdrop-filter]:bg-background/60",
            isEmergency
                ? "bg-slate-900/90 border-red-900/50"
                : "bg-background/70 border-border/40"
        )}>
            <div className="container mx-auto h-full px-4 flex items-center justify-between gap-4">

                {/* 1. LEFT SECTION - Logo & Name */}
                <div className="flex items-center gap-3 md:gap-4 shrink-0 cursor-pointer group" onClick={() => window.location.href = '/'}>
                    {/* Mobile Menu Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden text-foreground hover:bg-muted/50"
                        onClick={(e) => { e.stopPropagation(); onMenuToggle(); }}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-glow",
                            isEmergency ? "bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.6)]" : "bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30"
                        )}>
                            <Shield className="h-6 w-6 text-white fill-current relative z-10" />
                            <div className="absolute inset-0 bg-white/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className={cn(
                            "text-2xl font-bold tracking-tight hidden min-[350px]:inline-block bg-clip-text text-transparent bg-gradient-to-r animate-shimmer bg-[length:200%_auto]",
                            isEmergency
                                ? "from-white to-red-200"
                                : "from-blue-600 via-teal-500 to-blue-600"
                        )}>
                            ResQ
                        </span>
                    </div>
                </div>

                {/* 2. CENTER SECTION - Spacer */}
                <div className="flex-1" />

                {/* 3. RIGHT SECTION - Actions */}
                <div className="flex items-center gap-2 sm:gap-3">

                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="rounded-full hover:bg-muted/50 hidden sm:flex transition-transform hover:rotate-12"
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-orange-500" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-slate-400" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {/* SOS Button (Always Visible) */}
                    <Dialog open={isSOSOpen} onOpenChange={setIsSOSOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="destructive"
                                size="sm"
                                className={cn(
                                    "rounded-full px-4 sm:px-6 font-bold shadow-lg transition-all hover:scale-105 active:scale-95 animate-pulse",
                                    "bg-red-600 hover:bg-red-700 shadow-red-500/50 border-2 border-red-500"
                                )}
                            >
                                <span className="mr-1">SOS</span>
                                <span className="hidden sm:inline">EMERGENCY</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md border-red-200 bg-red-50 dark:bg-slate-900 dark:border-red-900">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-center text-red-600 flex items-center justify-center gap-2">
                                    <Shield className="h-6 w-6" /> Emergency Contacts
                                </DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
                                {emergencyContacts.map((contact) => (
                                    <a
                                        key={contact.name}
                                        href={`tel:${contact.number}`}
                                        className={cn(
                                            "flex items-center p-4 rounded-xl border-2 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer group",
                                            "bg-white dark:bg-slate-800 border-transparent hover:border-red-500 shadow-sm hover:shadow-md"
                                        )}
                                    >
                                        <div className={cn("p-3 rounded-full mr-4 text-white", contact.color)}>
                                            <contact.icon className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg">{contact.name}</h3>
                                            <p className="text-sm text-muted-foreground">{contact.description}</p>
                                        </div>
                                        <div className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-red-600 transition-colors">
                                            {contact.number}
                                        </div>
                                    </a>
                                ))}
                            </div>

                            {/* Navigation Link to Emergency Mode */}
                            {/* Navigation Link to Emergency Mode */}
                            <div className="mt-4 pt-1">
                                <Button
                                    className="w-full py-6 text-lg font-black tracking-wide text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-xl shadow-red-200 border-0 transform transition-all hover:scale-[1.02] active:scale-95 group flex items-center justify-center gap-3 rounded-xl"
                                    onClick={() => {
                                        setIsSOSOpen(false);
                                        navigate('/emergency');
                                    }}
                                >
                                    <span>GO TO LIVE DASHBOARD</span>
                                    <Ambulance className="w-6 h-6 animate-pulse" />
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Notification Bell */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-muted/50 h-10 w-10">
                                <Bell className={cn("h-5 w-5 transition-colors", isEmergency ? "text-slate-300" : "text-foreground")} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-background animate-bounce" />
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden border-border/50 shadow-xl backdrop-blur-xl bg-background/95">
                            <div className="bg-muted/50 p-3 border-b flex items-center justify-between">
                                <span className="font-semibold text-sm">Notifications</span>
                                {unreadCount > 0 && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                {notifications.length > 0 ? notifications.map((n) => (
                                    <DropdownMenuItem key={n.id} className={cn("flex flex-col items-start gap-1 p-4 cursor-pointer hover:bg-muted/50 focus:bg-muted/50 border-b last:border-0 border-border/40", !n.read && "bg-blue-50/50 dark:bg-blue-900/10")}>
                                        <div className="flex items-start gap-3 w-full">
                                            <div className={cn("mt-1 p-2 rounded-full bg-opacity-10 shrink-0", n.color.replace('text-', 'bg-'))}>
                                                <n.icon className={cn("h-4 w-4", n.color)} />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className={cn("font-medium text-sm", !n.read ? "text-foreground" : "text-muted-foreground")}>{n.title}</span>
                                                    <span className="text-[10px] text-muted-foreground">{n.time}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    {n.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </DropdownMenuItem>
                                )) : (
                                    <div className="p-8 text-center text-sm text-slate-500">
                                        No notifications
                                    </div>
                                )}
                            </div>
                            <div className="p-2 bg-muted/30 border-t text-center">
                                <Button variant="ghost" size="sm" className="w-full text-xs h-8" onClick={markAsRead} disabled={unreadCount === 0}>
                                    Mark all as read
                                </Button>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Profile Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 p-0 border border-border/50 bg-background shadow-sm hover:shadow-md transition-all ml-1">
                                <Avatar className="h-full w-full ring-2 ring-offset-2 ring-offset-background ring-transparent group-hover:ring-primary/20 transition-all">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.name || 'User'}`} />
                                    <AvatarFallback>{profile?.name?.[0] || 'U'}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 p-2 shadow-xl backdrop-blur-xl bg-background/95 border-border/50">
                            {/* Mini Dashboard Card */}
                            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 mb-2 border border-primary/10">
                                <div className="flex items-center gap-3 mb-3">
                                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.name || 'User'}`} />
                                        <AvatarFallback>{profile?.name?.[0] || 'U'}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold text-sm">{profile?.name || 'Citizen'}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{profile?.role || 'Guest'} • {profile?.city || 'Indore'}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="bg-background/50 rounded p-1.5 shadow-sm">
                                        <p className="text-[10px] text-muted-foreground font-medium uppercase">Reports</p>
                                        <p className="font-bold text-sm text-primary">{profile?.reports_count || 0}</p>
                                    </div>
                                    <div className="bg-background/50 rounded p-1.5 shadow-sm">
                                        <p className="text-[10px] text-muted-foreground font-medium uppercase">Solved</p>
                                        <p className="font-bold text-sm text-green-600">{profile?.resolved_count || 0}</p>
                                    </div>
                                    <div className="bg-background/50 rounded p-1.5 shadow-sm">
                                        <p className="text-[10px] text-muted-foreground font-medium uppercase">Points</p>
                                        <p className="font-bold text-sm text-amber-600">{profile?.points || 0}</p>
                                    </div>
                                </div>
                            </div>

                            <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer rounded-md focus:bg-primary/5 mb-1">
                                <User className="mr-2 h-4 w-4 text-primary" />
                                <span>Full Profile</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer rounded-md focus:bg-primary/5 mb-1">
                                <Settings className="mr-2 h-4 w-4 text-primary" />
                                <span className="w-full">Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1 bg-border/50" />
                            <DropdownMenuItem
                                onClick={async () => {
                                    await signOut();
                                    navigate('/login');
                                }}
                                className="text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer rounded-md"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Active Mode Indicator Line */}
            <div className={cn(
                "absolute bottom-0 left-0 w-full h-[1px] transition-colors duration-300",
                isEmergency ? "bg-red-500/50" : "bg-gradient-to-r from-transparent via-primary/30 to-transparent"
            )} />
        </header>
    );
}
