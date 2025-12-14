import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const QuesteurSenateBudgetSection = () => {
  const budgetLines = [
    { name: "Personnel", allocated: 5.2, consumed: 4.8, percentage: 92 },
    { name: "Fonctionnement", allocated: 3.5, consumed: 2.8, percentage: 80 },
    { name: "Investissement", allocated: 2.8, consumed: 1.9, percentage: 68 },
    { name: "Missions", allocated: 1.0, consumed: 0.7, percentage: 70 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Budget du Sénat</h1>
        <p className="text-muted-foreground">Suivi de l'exécution budgétaire</p>
      </div>

      <div className="grid gap-4">
        {budgetLines.map((line, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{line.name}</h3>
                <Badge variant={line.percentage > 85 ? "destructive" : "secondary"}>{line.percentage}%</Badge>
              </div>
              <Progress value={line.percentage} className="h-3 mb-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Alloué: {line.allocated} Mds FCFA</span>
                <span>Consommé: {line.consumed} Mds FCFA</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
