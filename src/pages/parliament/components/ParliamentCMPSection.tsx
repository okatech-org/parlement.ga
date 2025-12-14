import { ArrowLeftRight, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

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
        return <Badge className="bg-amber-500">En négociation</Badge>;
      case "success":
        return <Badge className="bg-green-500">Accord trouvé</Badge>;
      case "failed":
        return <Badge variant="destructive">Échec</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
          Commissions Mixtes Paritaires
        </h1>
        <p className="text-muted-foreground">
          Suivi des CMP pour la résolution des désaccords entre chambres
        </p>
      </div>

      <div className="grid gap-4">
        {cmpSessions.map((cmp) => (
          <Card key={cmp.id} className={`hover:shadow-lg transition-shadow ${cmp.status === 'in_progress' ? 'border-l-4 border-l-amber-500' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{cmp.reference}</Badge>
                    {getStatusBadge(cmp.status)}
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">{cmp.title}</h3>
                  {cmp.status === 'in_progress' ? (
                    <div className="mt-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Clock className="h-4 w-4" />
                        Échéance: {cmp.deadline} ({cmp.daysLeft} jours)
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={cmp.progress} className="flex-1 h-2" />
                        <span className="text-sm font-medium">{cmp.progress}%</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-2">
                      Terminée le {cmp.completedAt}
                    </p>
                  )}
                </div>
                {cmp.status === 'in_progress' && (
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    <ArrowLeftRight className="h-4 w-4 mr-2" />
                    War Room
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
