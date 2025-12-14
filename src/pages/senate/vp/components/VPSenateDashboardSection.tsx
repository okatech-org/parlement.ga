import { Crown, Users, Calendar, Building2, TrendingUp, Shield, Gavel, FileSignature, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStatsCard } from "@/components/dashboard/DashboardStatsCard";
import { AttendanceRateCard } from "@/components/dashboard/DashboardCharts";
import { AnimatedDashboardCard, AnimatedProgressBar } from "@/components/animations/DashboardAnimations";
import InteractiveDonutChart from "@/components/charts/InteractiveDonutChart";

export const VPSenateDashboardSection = () => {
  const stats = [
    { icon: Crown, value: "12", label: "Séances Présidées", subLabel: "En suppléance" },
    { icon: Building2, value: "4", label: "Commissions Supervisées", subLabel: "Permanentes" },
    { icon: Users, value: "3", label: "Délégations Actives", subLabel: "Internationales" },
    { icon: Calendar, value: "2", label: "Réunions Prévues", subLabel: "Cette semaine", urgent: true },
  ];

  const commissionData = [
    { label: "Lois", value: 35, color: "#22c55e" },
    { label: "Finances", value: 25, color: "#3b82f6" },
    { label: "Affaires Sociales", value: 20, color: "#f59e0b" },
    { label: "Collectivités", value: 20, color: "#8b5cf6" },
  ];

  const textProgress = [
    { name: "Loi de Finances 2025", progress: 75, color: "#22c55e" },
    { name: "Code Décentralisation", progress: 45, color: "#3b82f6" },
    { name: "Réforme Fiscale", progress: 30, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-8">
      <AnimatedDashboardCard delay={0}>
        <DashboardHeader
          title="1er Vice-Président du Sénat"
          subtitle="République Gabonaise - Union, Travail, Justice"
          avatarInitial="VP"
        />
      </AnimatedDashboardCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <AnimatedDashboardCard key={index} delay={0.15 + index * 0.05}>
            <DashboardStatsCard {...stat} />
          </AnimatedDashboardCard>
        ))}
      </div>

      {/* Main Actions Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Suppléance & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">

          {/* Suppléance Alert */}
          <AnimatedDashboardCard delay={0.3}>
            <Card className="border-l-4 border-l-amber-500 bg-amber-500/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Crown className="w-32 h-32" />
              </div>
              <CardContent className="p-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                    <Crown className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h4 className="font-bold text-xl mb-1 text-amber-800 dark:text-amber-300">Intérim Présidence Actif</h4>
                    <p className="text-sm text-amber-700/80 dark:text-amber-400/80 mb-4">
                      Le Président est en déplacement diplomatique. Vous assurez la présidence des séances plénières jusqu'au 18 Décembre.
                    </p>
                    <div className="flex gap-3 justify-center md:justify-start">
                      <Button className="bg-amber-600 hover:bg-amber-700 text-white border-none">
                        <FileSignature className="mr-2 h-4 w-4" />
                        Signer Actes Urgents
                      </Button>
                      <Button variant="outline" className="border-amber-200 hover:bg-amber-100 dark:border-amber-800 dark:hover:bg-amber-900/50">
                        Voir Agenda Président
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedDashboardCard>

          {/* Attendance & Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatedDashboardCard delay={0.35}>
              <AttendanceRateCard rate={96} trend="up" label="Assiduité aux Séances" />
            </AnimatedDashboardCard>

            <AnimatedDashboardCard delay={0.4}>
              <Card className="flex flex-col justify-center items-center p-6 bg-gradient-to-br from-primary/5 to-transparent h-full">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Gavel className="h-6 w-6 text-primary" />
                </div>
                <span className="text-3xl font-bold text-primary">8</span>
                <span className="text-sm text-muted-foreground mt-1">Lois Votées (Intérim)</span>
                <Button variant="link" size="sm" className="mt-2">Voir historique <ArrowRight className="ml-1 h-3 w-3" /></Button>
              </Card>
            </AnimatedDashboardCard>
          </div>
        </div>

        {/* Urgent Tasks */}
        <AnimatedDashboardCard delay={0.45}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" />
                Actions Requises
              </CardTitle>
              <CardDescription>
                Dossiers en attente de validation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "Validation OM Délégation France", type: "Diplomatie", due: "Aujourd'hui", urgent: true },
                { title: "Ordre du Jour Commission Lois", type: "Législatif", due: "Demain", urgent: false },
                { title: "Note de Synthèse - Budget", type: "Administration", due: "16 Déc", urgent: false },
              ].map((task, i) => (
                <div key={i} className="flex flex-col p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors cursor-pointer border-l-2 border-transparent hover:border-primary">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${task.urgent ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                      {task.type}
                    </span>
                    <span className="text-xs text-muted-foreground">{task.due}</span>
                  </div>
                  <span className="font-medium text-sm line-clamp-2">{task.title}</span>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-xs mt-2">Voir toutes les tâches</Button>
            </CardContent>
          </Card>
        </AnimatedDashboardCard>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatedDashboardCard delay={0.5}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Répartition Commissions
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <InteractiveDonutChart
                data={commissionData}
                size={200}
                thickness={35}
                centerLabel="Total"
                centerValue="4"
              />
            </CardContent>
          </Card>
        </AnimatedDashboardCard>

        <AnimatedDashboardCard delay={0.55}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Avancement des Textes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {textProgress.map((item, index) => (
                <AnimatedProgressBar
                  key={index}
                  label={item.name}
                  value={item.progress}
                  max={100}
                  color={`bg-[${item.color}]`}
                  delay={0.6 + index * 0.1}
                  showValue
                />
              ))}
            </CardContent>
          </Card>
        </AnimatedDashboardCard>
      </div>
    </div>
  );
};
