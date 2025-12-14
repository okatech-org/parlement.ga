import { ArrowLeftRight, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AnimatedDashboardCard, AnimatedProgressBar } from "@/components/animations/DashboardAnimations";

export const ParliamentCMPSection = () => {
  const cmpSessions = [
    {
      id: 1,
      reference: "CMP-2024-007",
      title: "Loi de Finances 2025",
      status: "in_progress",
      deadline: "22 Décembre 2024",
      daysLeft: 8,
      progress: 45,
    },
    {
      id: 2,
      reference: "CMP-2024-006",
      title: "Réforme du Code du Travail",
      status: "success",
      completedAt: "1 Décembre 2024",
    },
    {
      id: 3,
      reference: "CMP-2024-005",
      title: "Loi sur la Protection des Données",
      status: "failed",
      completedAt: "15 Novembre 2024",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_progress":
        return <Badge className="bg-amber-500 hover:bg-amber-600">En négociation</Badge>;
      case "success":
        return <Badge className="bg-green-500 hover:bg-green-600">Accord trouvé</Badge>;
      case "failed":
        return <Badge variant="destructive">Échec</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <AnimatedDashboardCard delay={0}>
        <DashboardHeader
          title="Commissions Mixtes Paritaires"
          subtitle="Suivi des CMP pour la résolution des désaccords entre chambres"
          avatarInitial="CMP"
        />
      </AnimatedDashboardCard>

      <div className="grid gap-6">
        {cmpSessions.map((cmp, index) => (
          <AnimatedDashboardCard key={cmp.id} delay={0.1 + index * 0.1}>
            <Card className={`hover:shadow-lg transition-all duration-300 border-none shadow-sm bg-white dark:bg-card ${cmp.status === 'in_progress' ? 'border-l-4 border-l-amber-500' : ''}`}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">{cmp.reference}</Badge>
                      {getStatusBadge(cmp.status)}
                    </div>

                    <h3 className="font-serif font-bold text-xl text-foreground">{cmp.title}</h3>

                    {cmp.status === 'in_progress' ? (
                      <div className="space-y-4 max-w-xl">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md w-fit">
                          <Clock className="h-4 w-4 text-amber-500" />
                          <span>Échéance: <span className="font-medium text-foreground">{cmp.deadline}</span> ({cmp.daysLeft} jours restants)</span>
                        </div>
                        <AnimatedProgressBar
                          value={cmp.progress}
                          color="bg-amber-500"
                          showValue
                          delay={0.2 + index * 0.1}
                          label="Progression des négociations"
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        {cmp.status === 'success' ? <span className="w-2 h-2 rounded-full bg-green-500" /> : <span className="w-2 h-2 rounded-full bg-red-500" />}
                        Terminée le {cmp.completedAt}
                      </p>
                    )}
                  </div>

                  {cmp.status === 'in_progress' && (
                    <Button className="bg-amber-600 hover:bg-amber-700 shadow-md shrink-0 self-start md:self-center">
                      <ArrowLeftRight className="h-4 w-4 mr-2" />
                      Accéder à la War Room
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </AnimatedDashboardCard>
        ))}
      </div>
    </div>
  );
};
