import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReports } from "@/hooks/use-reports";

const priorityColors = {
    critical: "bg-red-500",
    high: "bg-orange-500",
    medium: "bg-amber-500",
    low: "bg-blue-500",
};

const statusColors = {
    pending: "bg-slate-100 text-slate-700",
    verified: "bg-blue-100 text-blue-700",
    assigned: "bg-purple-100 text-purple-700",
    resolved: "bg-emerald-100 text-emerald-700",
};

function TimeAgo({ date }: { date: Date }) {
    const timeAgo = Math.floor((new Date().getTime() - new Date(date).getTime()) / 3600000);
    return <span>{timeAgo}h ago</span>;
}

export function HazardList() {
    const { data: reports, isLoading } = useReports();

    if (isLoading) {
        return (
            <Card className="h-full">
                <CardHeader><CardTitle>Loading...</CardTitle></CardHeader>
            </Card>
        )
    }

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Recent Hazard Reports</CardTitle>
                <Badge variant="outline" className="font-normal cursor-pointer hover:bg-muted">View All</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
                {reports?.slice(0, 3).map((report) => (
                    <div key={report.id} className="flex flex-col gap-2 p-3 rounded-lg border bg-card/50 hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className={cn("w-2 h-2 rounded-full", priorityColors[report.priority as keyof typeof priorityColors])} />
                                <span className="text-xs font-mono text-muted-foreground">{report.id}</span>
                                <Badge variant="secondary" className="text-[10px] h-5 px-1.5">{report.category}</Badge>
                            </div>
                            <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full capitalize", statusColors[report.status as keyof typeof statusColors])}>
                                {report.status}
                            </span>
                        </div>
                        <h4 className="font-medium text-sm line-clamp-1">{report.title}</h4>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{report.locationAddress}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <TimeAgo date={report.createdAt} />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded flex items-center gap-1 border border-purple-100">
                                <AlertCircle className="h-3 w-3" />
                                AI Score: {report.aiScore}%
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
