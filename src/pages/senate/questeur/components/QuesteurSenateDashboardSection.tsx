import { Wallet, Package, Banknote, Building, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const QuesteurSenateDashboardSection = () => {
  const stats = [
    { label: "Budget annuel", value: "12.5 Mds", subLabel: "FCFA" },
    { label: "Exécution", value: "78%", subLabel: "Budget consommé" },
    { label: "Marchés en cours", value: 8, subLabel: "Contrats actifs" },
    { label: "Demandes", value: 15, subLabel: "À traiter" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Tableau de Bord</h1>
        <p className="text-muted-foreground">Gestion financière et matérielle du Sénat</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={i}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{s.value}</p>
              <p className="font-medium">{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.subLabel}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Exécution budgétaire</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2"><span>Fonctionnement</span><span>82%</span></div>
            <Progress value={82} className="h-3" />
          </div>
          <div>
            <div className="flex justify-between mb-2"><span>Investissement</span><span>65%</span></div>
            <Progress value={65} className="h-3" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
