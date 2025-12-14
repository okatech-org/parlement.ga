import { FileText, Clock, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const SenatorNavetteSection = () => {
  const navetteTexts = [
    {
      id: 1,
      reference: "PL-2024-045",
      title: "Loi de finances pour l'exercice 2025",
      receivedAt: "10 Déc 2024",
      deadline: "30 Déc 2024",
      daysLeft: 16,
      priority: "high",
    },
    {
      id: 2,
      reference: "PL-2024-042",
      title: "Projet de loi sur la décentralisation territoriale",
      receivedAt: "5 Déc 2024",
      deadline: "25 Déc 2024",
      daysLeft: 11,
      priority: "urgent",
      isCollectivity: true,
    },
    {
      id: 3,
      reference: "PPL-2024-018",
      title: "Proposition de loi relative à la protection de l'environnement",
      receivedAt: "1 Déc 2024",
      deadline: "21 Déc 2024",
      daysLeft: 7,
      priority: "normal",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
          Navette Parlementaire
        </h1>
        <p className="text-muted-foreground">
          Suivi des textes transmis par l'Assemblée Nationale
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Textes en Navette
          </CardTitle>
          <CardDescription>Textes en attente d'examen au Sénat</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {navetteTexts.map((text) => (
              <div
                key={text.id}
                className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-border/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{text.reference}</Badge>
                    {text.isCollectivity && (
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200">
                        <Crown className="h-3 w-3 mr-1" />
                        Collectivités
                      </Badge>
                    )}
                  </div>
                  <Badge
                    className={
                      text.priority === "urgent" ? "bg-red-500 hover:bg-red-600" :
                      text.priority === "high" ? "bg-orange-500 hover:bg-orange-600" : 
                      "bg-green-500 hover:bg-green-600"
                    }
                  >
                    {text.daysLeft} jours restants
                  </Badge>
                </div>
                <h4 className="font-medium text-foreground mb-2 text-lg">{text.title}</h4>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Reçu le {text.receivedAt}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Échéance: {text.deadline}
                  </span>
                </div>
                <Progress
                  value={100 - (text.daysLeft / 20) * 100}
                  className="mt-3 h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
