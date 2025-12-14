import { useState } from "react";
import {
  Users, FileText, Building2, Calendar, TrendingUp,
  ArrowLeftRight, Gavel, MapPin, Clock, Bell,
  CheckCircle, AlertTriangle, ArrowUp, ArrowDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStatsCard } from "@/components/dashboard/DashboardStatsCard";
import { GroupDistributionChart, LawProgressChart, AttendanceRateCard } from "@/components/dashboard/DashboardCharts";
import {
  AnimatedDashboardCard,
  AnimatedStat,
  AnimatedProgressBar,
  StaggeredList
} from "@/components/animations/DashboardAnimations";
import InteractiveDonutChart from "@/components/charts/InteractiveDonutChart";
import { toast } from "sonner";

export const PresidentSenateDashboardSection = () => {
  const [selectedAction, setSelectedAction] = useState<number | null>(null);

  const stats = [
    { icon: Users, value: "67", label: "Sénateurs", subLabel: "Toutes provinces" },
    { icon: FileText, value: "23", label: "Textes en Navette", subLabel: "En cours d'examen" },
    { icon: Building2, value: "6", label: "Commissions Permanentes", subLabel: "Actives" },
    { icon: Calendar, value: "4", label: "Séances Plénières", subLabel: "Ce mois", urgent: true },
  ];

  const groupDistribution = [
    { label: "PDG", value: 35, color: "#22c55e" },
    { label: "CLR", value: 18, color: "#3b82f6" },
    { label: "Indépendants", value: 14, color: "#f59e0b" },
  ];

  const lawProgress = [
    { name: "Loi de Finances 2025", progress: 85, color: "#22c55e" },
    { name: "Décentralisation", progress: 60, color: "#3b82f6" },
    { name: "Code Minier", progress: 35, color: "#f59e0b" },
  ];

  const pendingActions = [
    { id: 1, reference: "PL-2024-041", title: "Loi sur les collectivités locales", action: "Validation navette", priority: "high", deadline: "Aujourd'hui" },
    { id: 2, reference: "PL-2024-039", title: "Réforme du code minier", action: "Convocation CMP", priority: "medium", deadline: "Demain" },
    { id: 3, reference: "PL-2024-038", title: "Budget 2025", action: "Ordre du jour", priority: "high", deadline: "Sous 3 jours" },
  ];

  const provincesActivity = [
    { label: "Estuaire", value: 28, color: "#22c55e" },
    { label: "Haut-Ogooué", value: 15, color: "#3b82f6" },
    { label: "Ogooué-Maritime", value: 12, color: "#8b5cf6" },
    { label: "Autres", value: 12, color: "#64748b" },
  ];

  const handleAction = (id: number, action: string) => {
    setSelectedAction(id);
    toast.success(`Action "${action}" initiée`, {
      description: "Redirection vers l'outil approprié..."
    });
    setTimeout(() => setSelectedAction(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header animé */}
      <AnimatedDashboardCard delay={0} hover={false}>
        <DashboardHeader
          title="Président du Sénat"
          subtitle="République Gabonaise - Union, Travail, Justice"
          avatarInitial="P"
        />
      </AnimatedDashboardCard>

      {/* Alerte urgente si présente */}
      <AnimatedDashboardCard delay={0.1}>
        <Card className="border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="p-2 bg-amber-500/20 rounded-full">
              <Bell className="h-5 w-5 text-amber-600 animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-amber-900 dark:text-amber-100">
                Séance plénière dans 2 heures
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Vote solennel sur la Loi de Finances 2025 à 14h30
              </p>
            </div>
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
              Voir l'ordre du jour
            </Button>
          </CardContent>
        </Card>
      </AnimatedDashboardCard>

      {/* Stats Grid avec animation */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <AnimatedDashboardCard key={index} delay={0.15 + index * 0.05}>
            <DashboardStatsCard {...stat} />
          </AnimatedDashboardCard>
        ))}
      </div>

      {/* Actions prioritaires + Groupes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actions prioritaires */}
        <AnimatedDashboardCard delay={0.35}>
          <Card className="border-l-4 border-l-primary h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ArrowLeftRight className="h-5 w-5 text-primary" />
                Actions prioritaires
              </CardTitle>
              <CardDescription>Décisions en attente de votre validation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingActions.map((action, index) => (
                <div
                  key={action.id}
                  className={`
                    flex items-center justify-between p-3 rounded-lg transition-all
                    ${selectedAction === action.id
                      ? 'bg-primary/10 ring-2 ring-primary/50'
                      : 'bg-muted/30 hover:bg-muted/50'}
                  `}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant="outline" className="text-xs">{action.reference}</Badge>
                      <Badge
                        className={action.priority === 'high'
                          ? 'bg-red-500/10 text-red-500 border-red-500/20'
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }
                        variant="outline"
                      >
                        {action.action}
                      </Badge>
                    </div>
                    <p className="font-medium text-sm truncate">{action.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {action.deadline}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={selectedAction === action.id ? "default" : "secondary"}
                    className="ml-2 shrink-0"
                    onClick={() => handleAction(action.id, action.action)}
                    disabled={selectedAction === action.id}
                  >
                    {selectedAction === action.id ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        En cours...
                      </>
                    ) : "Traiter"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </AnimatedDashboardCard>

        {/* Donut Chart - Répartition des groupes */}
        <AnimatedDashboardCard delay={0.4}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Répartition des Groupes
              </CardTitle>
              <CardDescription>67 sénateurs au total</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <InteractiveDonutChart
                data={groupDistribution}
                size={200}
                thickness={35}
                centerLabel="Total"
                centerValue="67"
              />
            </CardContent>
          </Card>
        </AnimatedDashboardCard>
      </div>

      {/* Attendance + Avancement lois */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatedDashboardCard delay={0.45}>
          <AttendanceRateCard rate={92} trend="up" />
        </AnimatedDashboardCard>

        <AnimatedDashboardCard delay={0.5}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Avancement des Lois
              </CardTitle>
              <CardDescription>Progression dans le processus législatif</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {lawProgress.map((law, index) => (
                <AnimatedProgressBar
                  key={index}
                  value={law.progress}
                  max={100}
                  label={law.name}
                  color={`bg-[${law.color}]`}
                  delay={0.55 + index * 0.1}
                  showValue
                />
              ))}
            </CardContent>
          </Card>
        </AnimatedDashboardCard>
      </div>

      {/* Activité par province */}
      <AnimatedDashboardCard delay={0.6}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Représentation Territoriale
            </CardTitle>
            <CardDescription>Sénateurs par province d'origine</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <InteractiveDonutChart
              data={provincesActivity}
              size={220}
              thickness={40}
              centerLabel="Provinces"
              centerValue="9"
            />
          </CardContent>
        </Card>
      </AnimatedDashboardCard>
    </div>
  );
};
