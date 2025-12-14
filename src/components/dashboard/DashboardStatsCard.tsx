import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface DashboardStatsCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  subLabel?: string;
  urgent?: boolean;
}

export const DashboardStatsCard = ({
  icon: Icon,
  value,
  label,
  subLabel,
  urgent,
}: DashboardStatsCardProps) => {
  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-foreground" />
        </div>
        <p className={`text-3xl font-bold ${urgent ? "text-red-500" : "text-foreground"}`}>
          {value}
        </p>
        <p className="font-medium text-foreground text-sm mt-1">{label}</p>
        {subLabel && <p className="text-xs text-muted-foreground">{subLabel}</p>}
        {urgent && (
          <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </CardContent>
    </Card>
  );
};
