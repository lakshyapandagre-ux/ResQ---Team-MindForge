export type ComplaintStatus = "Pending" | "Verified" | "Assigned" | "In Progress" | "Resolved";

export interface Complaint {
    id: string;
    title: string;
    description: string;
    category: string;
    location: string;
    images: string[];
    status: ComplaintStatus;
    priority: "Low" | "Medium" | "High" | "Critical";
    timeline: number; // 0 to 100
    postedAt: string;
    author: {
        name: string;
        avatar: string;
        role: "Citizen" | "Volunteer" | "Official";
    };
    stats: {
        supports: number;
        comments: number;
        shares: number;
    };
    isSupported: boolean;
    isFollowed: boolean;
}
