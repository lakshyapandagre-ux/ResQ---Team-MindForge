import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { CommentsSection } from "@/components/common/CommentsSection";

interface CommentDrawerProps {
    complaintId: string;
    commentCount: number;
}

export function CommentDrawer({ complaintId, commentCount }: CommentDrawerProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-slate-600 hover:bg-white hover:shadow-sm transition-all h-9">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs font-medium">{commentCount} Comments</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[80vh]">
                <DrawerHeader className="border-b pb-4">
                    <DrawerTitle>Comments</DrawerTitle>
                </DrawerHeader>

                <div className="h-full p-4 pb-10">
                    <CommentsSection parentId={complaintId} parentType="complaint" />
                </div>
            </DrawerContent>
        </Drawer>
    );
}
