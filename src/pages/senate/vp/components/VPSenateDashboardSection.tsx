import { Crown, Users, Calendar, Building2, TrendingUp, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStatsCard } from "@/components/dashboard/DashboardStatsCard";
import { GroupDistributionChart, LawProgressChart, AttendanceRateCard } from "@/components/dashboard/DashboardCharts";

export const VPSenateDashboardSection = () => {
  const stats = [
    { icon: Crown, value: "12", label: "Séances Présidées", subLabel: "En suppléance" },
    { icon: Building2, value: "4", label: "Commissions Supervisées", subLabel: "Permanentes" },
    { icon: Users, value: "3", label: "Délégations Actives", subLabel: "Internationales" },
    { icon: Calendar, value: "2", label: "Réunions Prévues", subLabel: "Cette semaine", urgent: true },
  ];

  const commissionData = [
    { name: "Lois", value: 15, color: "#22c55e" },
    { name: "Finances", value: 12, color: "#3b82f6" },
    { name: "Affaires Sociales", value: 10, color: "#f59e0b" },
    { name: "Collectivités", value: 8, color: "#8b5cf6" },
  ];

  const textProgress = [
    { name: "Loi de Finances 2025", progress: 75, color: "#22c55e" },
    { name: "Code Décentralisation", progress: 45, color: "#3b82f6" },
    { name: "Réforme Fiscale", progress: 30, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="1er Vice-Président du Sénat"
        subtitle="République Gabonaise - Union, Travail, Justice"
        avatarInitial="VP"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <DashboardStatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Suppléance Card + Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AttendanceRateCard rate={94} trend="up" />
        
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Crown className="h-6 w-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg">Mode Suppléance</h4>
                <p className="text-sm text-muted-foreground">Vous pouvez présider les séances en l'absence du Président</p>
              </div>
              <Button variant="secondary">Activer</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GroupDistributionChart title="Répartition des Commissions" data={commissionData} />
        <LawProgressChart title="Avancement des Textes" data={textProgress} />
      </div>
    </div>
  );
};
