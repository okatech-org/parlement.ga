import {
  FileText,
  MapPin,
  MessageSquare,
  Calendar,
  ArrowLeftRight,
  AlertTriangle,
  Clock,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStatsCard } from "@/components/dashboard/DashboardStatsCard";
import { GroupDistributionChart, LawProgressChart, AttendanceRateCard } from "@/components/dashboard/DashboardCharts";

export const SenatorDashboardSection = () => {
  const stats = [
    { icon: FileText, value: "8", label: "Textes à Examiner", subLabel: "En navette" },
    { icon: AlertTriangle, value: "12", label: "Doléances Locales", subLabel: "À traiter" },
    { icon: MapPin, value: "3", label: "Visites Terrain", subLabel: "Ce mois" },
    { icon: Calendar, value: "45", label: "Jours Session", subLabel: "Restants", urgent: true },
  ];

  const provinceData = [
    { name: "Estuaire", value: 28, color: "#22c55e" },
    { name: "Woleu-Ntem", value: 18, color: "#3b82f6" },
    { name: "Haut-Ogooué", value: 15, color: "#f59e0b" },
    { name: "Autres", value: 39, color: "#8b5cf6" },
  ];

  const textProgress = [
    { name: "Loi de Finances 2025", progress: 85, color: "#22c55e" },
    { name: "Décentralisation", progress: 60, color: "#3b82f6" },
    { name: "Code Minier", progress: 35, color: "#f59e0b" },
  ];

  const urgentTexts = [
    {
      id: 1,
      reference: "PL-2024-045",
      title: "Loi de finances pour l'exercice 2025",
      daysLeft: 16,
      priority: "high",
    },
    {
      id: 2,
      reference: "PL-2024-042",
      title: "Projet de loi sur la décentralisation territoriale",
      daysLeft: 11,
      priority: "urgent",
    },
  ];

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Sénateur de l'Estuaire"
        subtitle="République Gabonaise - Représentation Territoriale"
        avatarInitial="S"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <DashboardStatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Attendance + Next Meeting */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AttendanceRateCard rate={92} trend="up" />
        
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg text-primary">Commission des Collectivités</h4>
                <p className="text-sm text-muted-foreground">Prochaine réunion : Demain à 10h00</p>
                <p className="text-xs text-muted-foreground mt-1">Salle B12 - Examen du PL Décentralisation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GroupDistributionChart title="Répartition Sénateurs par Province" data={provinceData} />
        <LawProgressChart title="Avancement des Lois" data={textProgress} />
      </div>

      {/* Urgent Texts */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
            Navette - Textes Urgents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {urgentTexts.map((text) => (
            <div key={text.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">{text.reference}</Badge>
                  <Badge 
                    className={text.priority === 'urgent' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'} 
                    variant="outline"
                  >
                    {text.daysLeft}j restants
                  </Badge>
                </div>
                <p className="font-medium text-sm truncate">{text.title}</p>
              </div>
              <Button size="sm" variant="secondary" className="ml-2 shrink-0">Examiner</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
