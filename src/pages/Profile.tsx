import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { db, type Profile } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const data = await db.getOrCreateProfile(user);
                setProfile(data);
            }
        };
        fetchProfile();
    }, []);

    if (!profile) return <div className="p-8">Loading Profile...</div>;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            <div className="flex flex-col md:flex-row gap-6 items-start">
                <Card className="w-full md:w-1/3">
                    <CardHeader className="text-center">
                        <Avatar className="h-24 w-24 mx-auto mb-4">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} />
                            <AvatarFallback>{profile.name[0]}</AvatarFallback>
                        </Avatar>
                        <CardTitle>{profile.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{profile.email}</p>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <MapPin className="h-4 w-4 text-slate-500" />
                            <span className="text-sm">{profile.city}</span>
                        </div>
                        <Badge className="mt-4 mx-auto w-fit" variant="secondary">{profile.role}</Badge>
                    </CardHeader>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <div className="text-3xl font-bold text-indigo-600">{profile.reports_count}</div>
                            <p className="text-sm text-muted-foreground">Reports Submitted</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <div className="text-3xl font-bold text-green-600">{profile.resolved_count}</div>
                            <p className="text-sm text-muted-foreground">Issues Resolved</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6 text-center flex flex-col items-center">
                            <div className="flex items-center gap-2 text-3xl font-bold text-orange-500">
                                <Award className="h-6 w-6" /> {profile.points}
                            </div>
                            <p className="text-sm text-muted-foreground">Impact Points</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
