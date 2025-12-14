import { Crown, Users, Calendar, Shield, LayoutDashboard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const VPSenateDashboardSection = () => {
  const stats = [
    { label: "Séances présidées", value: 12, subLabel: "En suppléance" },
    { label: "Commissions supervisées", value: 4, subLabel: "Permanentes" },
    { label: "Délégations actives", value: 3, subLabel: "Internationales" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Bienvenue</h1>
        <p className="text-muted-foreground">Espace du 1er Vice-Président du Sénat</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="font-medium">{stat.label}</p>
              <p className="text-xs text-muted-foreground">{stat.subLabel}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-l-4 border-l-amber-500">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Crown className="h-8 w-8 text-amber-500" />
            <div>
              <h4 className="font-semibold">Mode suppléance disponible</h4>
              <p className="text-sm text-muted-foreground">Vous pouvez présider les séances en l'absence du Président</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
