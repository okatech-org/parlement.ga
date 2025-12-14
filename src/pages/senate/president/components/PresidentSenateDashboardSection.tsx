import { Users, FileText, Building2, Calendar, TrendingUp, ArrowLeftRight, Gavel } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStatsCard } from "@/components/dashboard/DashboardStatsCard";
import { GroupDistributionChart, LawProgressChart, AttendanceRateCard } from "@/components/dashboard/DashboardCharts";

export const PresidentSenateDashboardSection = () => {
  const stats = [
    { icon: Users, value: "67", label: "Sénateurs", subLabel: "Toutes provinces" },
    { icon: FileText, value: "23", label: "Textes en Navette", subLabel: "En cours d'examen" },
    { icon: Building2, value: "6", label: "Commissions Permanentes", subLabel: "Actives" },
    { icon: Calendar, value: "4", label: "Séances Plénières", subLabel: "Ce mois", urgent: true },
  ];

  const groupDistribution = [
    { name: "PDG", value: 35, color: "#22c55e" },
    { name: "CLR", value: 18, color: "#3b82f6" },
    { name: "Indépendants", value: 14, color: "#f59e0b" },
  ];

  const lawProgress = [
    { name: "Loi de Finances 2025", progress: 85, color: "#22c55e" },
    { name: "Décentralisation", progress: 60, color: "#3b82f6" },
    { name: "Code Minier", progress: 35, color: "#f59e0b" },
  ];

  const pendingActions = [
    { id: 1, reference: "PL-2024-041", title: "Loi sur les collectivités locales", action: "Validation navette", priority: "high" },
    { id: 2, reference: "PL-2024-039", title: "Réforme du code minier", action: "Convocation CMP", priority: "medium" },
    { id: 3, reference: "PL-2024-038", title: "Budget 2025", action: "Ordre du jour", priority: "high" },
  ];

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Président du Sénat"
        subtitle="République Gabonaise - Union, Travail, Justice"
        avatarInitial="P"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <DashboardStatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Attendance + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AttendanceRateCard rate={92} trend="up" />

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ArrowLeftRight className="h-5 w-5 text-primary" />
              Actions prioritaires
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingActions.map((action) => (
              <div key={action.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">{action.reference}</Badge>
                    <Badge className={action.priority === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'} variant="outline">
                      {action.action}
                    </Badge>
                  </div>
                  <p className="font-medium text-sm truncate">{action.title}</p>
                </div>
                <Button size="sm" variant="secondary" className="ml-2 shrink-0">Traiter</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GroupDistributionChart title="Répartition des Groupes Parlementaires" data={groupDistribution} />
        <LawProgressChart title="Avancement des Lois" data={lawProgress} />
      </div>
    </div>
  );
};
