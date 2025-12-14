import { Crown, ArrowLeftRight, Calendar, BarChart3, Gavel, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const PresidentSenateDashboardSection = () => {
  const stats = [
    { label: "Textes reçus", value: 45, subLabel: "Cette législature" },
    { label: "Textes amendés", value: 32, subLabel: "71% du total" },
    { label: "Lois adoptées", value: 13, subLabel: "Conformes" },
    { label: "CMP convoquées", value: 5, subLabel: "Désaccords résolus" },
  ];

  const pendingActions = [
    { id: 1, reference: "PL-2024-041", title: "Loi sur les collectivités", action: "À signer", priority: "high" },
    { id: 2, reference: "PL-2024-039", title: "Code minier", action: "Retour AN", priority: "medium" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
          Bienvenue, Madame la Présidente
        </h1>
        <p className="text-muted-foreground">
          Tableau de bord de la Présidence du Sénat
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="font-medium text-foreground">{stat.label}</p>
              <p className="text-xs text-muted-foreground">{stat.subLabel}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
            Actions en attente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pendingActions.map((action) => (
            <div key={action.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <Badge variant="outline" className="mb-1">{action.reference}</Badge>
                <p className="font-medium">{action.title}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={action.priority === 'high' ? 'bg-red-500' : 'bg-amber-500'}>
                  {action.action}
                </Badge>
                <Button size="sm">Traiter</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
