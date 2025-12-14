import { AlertTriangle, Clock, CheckCircle, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const SenatorDoleancesSection = () => {
  const doleances = [
    {
      id: 1,
      title: "Problème d'eau potable à Bitam",
      category: "Infrastructure",
      status: "pending",
      date: "12 Déc 2024",
      priority: "high",
    },
    {
      id: 2,
      title: "Route dégradée entre Oyem et Mitzic",
      category: "Transport",
      status: "in_progress",
      date: "10 Déc 2024",
      priority: "medium",
    },
    {
      id: 3,
      title: "Manque d'enseignants au lycée de Minvoul",
      category: "Éducation",
      status: "resolved",
      date: "5 Déc 2024",
      priority: "low",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-amber-600 border-amber-300">En attente</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="text-blue-600 border-blue-300">En cours</Badge>;
      case "resolved":
        return <Badge variant="outline" className="text-green-600 border-green-300">Résolu</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
            Gestion des Doléances
          </h1>
          <p className="text-muted-foreground">
            Suivi des préoccupations citoyennes de votre territoire
          </p>
        </div>
        <Button>
          <AlertTriangle className="h-4 w-4 mr-2" />
          Nouvelle doléance
        </Button>
      </div>

      <div className="grid gap-4">
        {doleances.map((doleance) => (
          <Card key={doleance.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{doleance.category}</Badge>
                    {getStatusBadge(doleance.status)}
                  </div>
                  <h3 className="font-semibold text-foreground">{doleance.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {doleance.date}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
