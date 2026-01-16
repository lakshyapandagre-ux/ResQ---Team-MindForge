import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db, type UserSettings } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Save, User, Bell, Monitor, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Settings() {
    const { profile, user, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Account state
    const [accountData, setAccountData] = useState({
        name: "",
        phone: ""
    });

    // App/Notification state
    const [settings, setSettings] = useState<UserSettings | null>(null);

    useEffect(() => {
        if (profile) {
            setAccountData({
                name: profile.name,
                phone: profile.phone || ""
            });
            fetchSettings();
        }
    }, [profile]);

    const fetchSettings = async () => {
        if (!user) return;
        try {
            const data = await db.getSettings(user.id);
            setSettings(data);
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAccount = async () => {
        if (!user) return;
        setSaving(true);
        try {
            await db.updateProfile(user.id, {
                name: accountData.name,
                phone: accountData.phone
            });
            await refreshProfile();
            toast.success("Account updated successfully");
        } catch (error) {
            toast.error("Failed to update account");
        } finally {
            setSaving(false);
        }
    };

    const updateSetting = async (key: keyof UserSettings, value: boolean) => {
        if (!user || !settings) return;
        try {
            const updated = await db.updateSettings(user.id, { [key]: value });
            setSettings(updated);
            toast.success("Settings updated");
        } catch (error) {
            toast.error("Failed to update settings");
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-8 pb-32">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
            </div>

            {/* Account Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-teal-600" />
                        Account Settings
                    </CardTitle>
                    <CardDescription>Manage your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="s-name">Full Name</Label>
                        <Input
                            id="s-name"
                            value={accountData.name}
                            onChange={(e) => setAccountData({ ...accountData, name: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="s-phone">Phone Number</Label>
                        <Input
                            id="s-phone"
                            type="tel"
                            value={accountData.phone}
                            onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })}
                        />
                    </div>
                    <Button onClick={handleSaveAccount} disabled={saving} className="w-full md:w-auto">
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Account Changes
                    </Button>
                </CardContent>
            </Card>

            {/* Notifications Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-orange-500" />
                        Notifications
                    </CardTitle>
                    <CardDescription>Configure how you receive alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Emergency Alerts</Label>
                            <p className="text-xs text-muted-foreground">Receive critical civil safety warnings</p>
                        </div>
                        <Switch
                            checked={settings?.emergency_alerts}
                            onCheckedChange={(val: boolean) => updateSetting("emergency_alerts", val)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Event Updates</Label>
                            <p className="text-xs text-muted-foreground">Stay notified about registered events</p>
                        </div>
                        <Switch
                            checked={settings?.event_updates}
                            onCheckedChange={(val: boolean) => updateSetting("event_updates", val)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Complaint Tracking</Label>
                            <p className="text-xs text-muted-foreground">Get status updates on your reports</p>
                        </div>
                        <Switch
                            checked={settings?.notifications_enabled}
                            onCheckedChange={(val: boolean) => updateSetting("notifications_enabled", val)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* App Preferences */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Monitor className="h-5 w-5 text-blue-500" />
                        App Preferences
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Dark Mode</Label>
                            <p className="text-xs text-muted-foreground">Enable dark theme for the application</p>
                        </div>
                        <Switch
                            checked={settings?.dark_mode}
                            onCheckedChange={(val: boolean) => updateSetting("dark_mode", val)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-emerald-600" />
                                Location Permissions
                            </Label>
                            <p className="text-xs text-muted-foreground">Required for maps and SOS features</p>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Active
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
