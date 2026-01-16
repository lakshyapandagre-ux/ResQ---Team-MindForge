import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LocationPickerProps {
    onLocationSelect: (location: { address: string; lat: number; lng: number }) => void;
    defaultValue?: string;
}

export function LocationPicker({ onLocationSelect, defaultValue }: LocationPickerProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
                id="location"
                placeholder="Enter location (e.g., MG Road, Indore)"
                defaultValue={defaultValue}
                onChange={(e) => {
                    // Simple text-based location
                    onLocationSelect({
                        address: e.target.value,
                        lat: 22.7196, // Default Indore coordinates
                        lng: 75.8577
                    });
                }}
                className="bg-slate-50/50"
            />
        </div>
    );
}
