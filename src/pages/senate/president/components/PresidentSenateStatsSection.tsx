import { BarChart3, TrendingUp, FileText, ArrowLeftRight, Vote, Users, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AnimatedDashboardCard, AnimatedProgressBar } from "@/components/animations/DashboardAnimations";
import InteractiveDonutChart from "@/components/charts/InteractiveDonutChart";

export const PresidentSenateStatsSection = () => {
  // Données pour les graphiques
  const impactData = [
    { label: "Textes amendés", value: 71, color: "#22c55e" },
    { label: "Adoptés conformes", value: 29, color: "#3b82f6" },
  ];

  const navetteData = [
    { label: "1ère lecture", value: 60, color: "#22c55e" },
    { label: "2ème lecture", value: 30, color: "#3b82f6" },
    { label: "CMP", value: 10, color: "#f59e0b" },
  ];

  const votesData = [
    { label: "Pour", value: 65, color: "#22c55e" },
    { label: "Contre", value: 25, color: "#ef4444" },
    { label: "Abstentions", value: 10, color: "#64748b" },
  ];

  const activiteCommissions = [
    { name: "Lois et Justice", seances: 12, rapports: 8 },
    { name: "Finances", seances: 10, rapports: 6 },
    { name: "Affaires Sociales", seances: 8, rapports: 5 },
    { name: "Décentralisation", seances: 7, rapports: 4 },
    { name: "Environnement", seances: 6, rapports: 3 },
    { name: "Relations Extérieures", seances: 5, rapports: 2 },
  ];

  const keyMetrics = [
    { label: "Textes examinés", value: 47, trend: "+12%" },
    { label: "Amendements déposés", value: 156, trend: "+8%" },
    { label: "Questions au Gouvernement", value: 23, trend: "+15%" },
    { label: "Séances plénières", value: 18, trend: "+5%" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
          Statistiques
        </h1>
        <p className="text-muted-foreground">
          Analyse de l'activité sénatoriale - Session en cours
        </p>
      </div>

      {/* Métriques clés */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((metric, index) => (
          <AnimatedDashboardCard key={index} delay={index * 0.1}>
            <Card>
              <CardContent className="p-4">
                <p className="text-3xl font-bold text-primary">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <Badge className="mt-2 bg-green-500/10 text-green-500 border-green-500/20" variant="outline">
                  {metric.trend}
                </Badge>
              </CardContent>
            </Card>
          </AnimatedDashboardCard>
        ))}
      </div>

      {/* Graphiques en donut */}
      <div className="grid md:grid-cols-3 gap-6">
        <AnimatedDashboardCard delay={0.4}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Impact du Sénat
              </CardTitle>
              <CardDescription>Textes amendés vs adoptés conformes</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <InteractiveDonutChart
                data={impactData}
                size={180}
                thickness={30}
                centerLabel="Impact"
                centerValue="71%"
              />
            </CardContent>
          </Card>
        </AnimatedDashboardCard>

        <AnimatedDashboardCard delay={0.5}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5 text-primary" />
                Navette parlementaire
              </CardTitle>
              <CardDescription>Répartition des textes</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <InteractiveDonutChart
                data={navetteData}
                size={180}
                thickness={30}
                centerLabel="Textes"
                centerValue="47"
              />
            </CardContent>
          </Card>
        </AnimatedDashboardCard>

        <AnimatedDashboardCard delay={0.6}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Vote className="h-5 w-5 text-primary" />
                Résultats des votes
              </CardTitle>
              <CardDescription>Session en cours</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <InteractiveDonutChart
                data={votesData}
                size={180}
                thickness={30}
                centerLabel="Votes"
                centerValue="156"
              />
            </CardContent>
          </Card>
        </AnimatedDashboardCard>
      </div>

      {/* Activité des commissions */}
      <AnimatedDashboardCard delay={0.7}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Activité des Commissions Permanentes
            </CardTitle>
            <CardDescription>Nombre de séances et rapports produits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activiteCommissions.map((commission, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{commission.name}</span>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {commission.seances} séances
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {commission.rapports} rapports
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Progress
                    value={(commission.seances / 12) * 100}
                    className="h-2 flex-1"
                  />
                  <Progress
                    value={(commission.rapports / 8) * 100}
                    className="h-2 flex-1 [&>div]:bg-blue-500"
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-center gap-8 pt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary" />
                Séances
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500" />
                Rapports
              </span>
            </div>
          </CardContent>
        </Card>
      </AnimatedDashboardCard>
    </div>
  );
};
