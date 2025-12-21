import { Wallet, Package, Banknote, Building, TrendingUp, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStatsCard } from "@/components/dashboard/DashboardStatsCard";
import { AnimatedDashboardCard, AnimatedProgressBar } from "@/components/animations/DashboardAnimations";
import InteractiveDonutChart from "@/components/charts/InteractiveDonutChart";

export const QuesteurSenateDashboardSection = () => {
  const { user } = useUser();

  const stats = [
    { icon: Wallet, value: "12.5 Mds", label: "Budget Annuel", subLabel: "FCFA alloué" },
    { icon: TrendingUp, value: "78%", label: "Exécution Budget", subLabel: "Consommé" },
    { icon: Package, value: "8", label: "Marchés en Cours", subLabel: "Contrats actifs" },
    { icon: FileText, value: "15", label: "Demandes", subLabel: "À traiter", urgent: true },
  ];

  const budgetDistribution = [
    { label: "Personnel", value: 45, color: "#22c55e" },
    { label: "Fonctionnement", value: 30, color: "#3b82f6" },
    { label: "Investissement", value: 15, color: "#f59e0b" },
    { label: "Réserves", value: 10, color: "#8b5cf6" },
  ];

  const budgetProgress = [
    { name: "Fonctionnement", progress: 82, color: "#22c55e" },
    { name: "Investissement", progress: 65, color: "#3b82f6" },
    { name: "Personnel", progress: 91, color: "#f59e0b" },
  ];

  const pendingRequests = [
    { id: 1, type: "Matériel", title: "Renouvellement équipements informatiques", amount: "45M FCFA", priority: "high" },
    { id: 2, type: "Indemnités", title: "Régularisation indemnités Q3", amount: "12M FCFA", priority: "medium" },
    { id: 3, type: "Services", title: "Contrat maintenance bâtiment", amount: "8M FCFA", priority: "low" },
  ];

  return (
    <div className="space-y-8">
      <AnimatedDashboardCard delay={0}>
        <DashboardHeader
          title={user?.bureauLabel ? `${user.bureauLabel} du Sénat` : "Questeur du Sénat"}
          subtitle="République Gabonaise - Gestion Financière et Matérielle"
          avatarInitial="Q"
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatedDashboardCard delay={0.35}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Répartition du Budget
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <InteractiveDonutChart
                data={budgetDistribution}
                size={200}
                thickness={35}
                centerLabel="Mds FCFA"
                centerValue="12.5"
              />
            </CardContent>
          </Card>
        </AnimatedDashboardCard>

        <AnimatedDashboardCard delay={0.4}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Exécution Budgétaire
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {budgetProgress.map((item, index) => (
                <AnimatedProgressBar
                  key={index}
                  label={item.name}
                  value={item.progress}
                  max={100}
                  color={`bg-[${item.color}]`}
                  delay={0.45 + index * 0.1}
                  showValue
                />
              ))}
            </CardContent>
          </Card>
        </AnimatedDashboardCard>
      </div>

      {/* Pending Requests */}
      <AnimatedDashboardCard delay={0.5}>
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              Demandes en attente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">{request.type}</Badge>
                    <Badge
                      className={
                        request.priority === 'high'
                          ? 'bg-red-500/10 text-red-500 border-red-500/20'
                          : request.priority === 'medium'
                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                            : 'bg-green-500/10 text-green-500 border-green-500/20'
                      }
                      variant="outline"
                    >
                      {request.amount}
                    </Badge>
                  </div>
                  <p className="font-medium text-sm truncate">{request.title}</p>
                </div>
                <Button size="sm" variant="secondary" className="ml-2 shrink-0">Traiter</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </AnimatedDashboardCard>
    </div>
  );
};
