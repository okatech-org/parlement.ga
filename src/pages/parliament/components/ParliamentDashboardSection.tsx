import {
  Scale,
  FileText,
  Users,
  Calendar,
  ArrowLeftRight,
  Vote,
  BookOpen,
  Crown,
  Building2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStatsCard } from "@/components/dashboard/DashboardStatsCard";
import { GroupDistributionChart, LawProgressChart, AttendanceRateCard } from "@/components/dashboard/DashboardCharts";

export const ParliamentDashboardSection = () => {
  const stats = [
    { icon: Users, value: "210", label: "Parlementaires", subLabel: "143 Députés + 67 Sénateurs" },
    { icon: FileText, value: "47", label: "Lois Adoptées", subLabel: "Cette législature" },
    { icon: BookOpen, value: "3", label: "Révisions Const.", subLabel: "Depuis 2023" },
    { icon: ArrowLeftRight, value: "12", label: "CMP Convoquées", subLabel: "Toutes législatures" },
  ];

  const institutionData = [
    { name: "Assemblée Nationale", value: 143, color: "#22c55e" },
    { name: "Sénat", value: 67, color: "#3b82f6" },
  ];

  const lawProgress = [
    { name: "Loi de Finances 2025", progress: 45, color: "#f59e0b" },
    { name: "Révision Constitutionnelle", progress: 80, color: "#22c55e" },
    { name: "Code Minier", progress: 25, color: "#3b82f6" },
  ];

  const activeCMP = {
    reference: "CMP-2024-007",
    title: "Loi de Finances 2025",
    daysLeft: 8,
    progress: 45,
  };

  const nextSession = {
    reference: "CONG-2024-003",
    title: "Révision Constitutionnelle - Autonomie des Collectivités",
    date: "20 Décembre 2024",
    time: "10h00",
  };

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Parlement du Gabon"
        subtitle="République Gabonaise - Union, Travail, Justice"
        avatarInitial="P"
      />

      {/* CMP Active Alert */}
      <Card className="border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20">
        <CardContent className="p-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <ArrowLeftRight className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-amber-500 text-white">{activeCMP.reference}</Badge>
                  <Badge variant="outline" className="border-amber-500 text-amber-600 dark:text-amber-400">
                    CMP en cours
                  </Badge>
                </div>
                <h3 className="font-bold text-lg text-foreground">{activeCMP.title}</h3>
                <p className="text-sm text-muted-foreground">{activeCMP.daysLeft} jours restants</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Avancement</p>
                <div className="flex items-center gap-2">
                  <Progress value={activeCMP.progress} className="w-24 h-3" />
                  <span className="font-bold">{activeCMP.progress}%</span>
                </div>
              </div>
              <Button variant="secondary">Accéder</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <DashboardStatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Attendance + Next Session */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AttendanceRateCard rate={88} trend="up" label="Taux de Présence Congrès" />
        
        <Card className="border-2 border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Vote className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <Badge className="mb-1">{nextSession.reference}</Badge>
                <h4 className="font-semibold text-foreground">{nextSession.title}</h4>
                <p className="text-sm text-muted-foreground">{nextSession.date} à {nextSession.time}</p>
              </div>
              <Button>Accéder</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GroupDistributionChart title="Répartition des Parlementaires" data={institutionData} />
        <LawProgressChart title="Avancement des Textes Majeurs" data={lawProgress} />
      </div>
    </div>
  );
};
