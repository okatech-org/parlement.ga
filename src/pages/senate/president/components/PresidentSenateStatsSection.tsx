import { BarChart3, TrendingUp, FileText, ArrowLeftRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const PresidentSenateStatsSection = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
          Statistiques
        </h1>
        <p className="text-muted-foreground">
          Analyse de l'activité sénatoriale
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Impact du Sénat</CardTitle>
            <CardDescription>Textes amendés vs adoptés conformes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Textes amendés</span>
                <span className="text-sm text-muted-foreground">71%</span>
              </div>
              <Progress value={71} className="h-3" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Adoptés conformes</span>
                <span className="text-sm text-muted-foreground">29%</span>
              </div>
              <Progress value={29} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Navette parlementaire</CardTitle>
            <CardDescription>Répartition des textes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">1ère lecture</span>
                <span className="text-sm text-muted-foreground">60%</span>
              </div>
              <Progress value={60} className="h-3" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">2ème lecture</span>
                <span className="text-sm text-muted-foreground">30%</span>
              </div>
              <Progress value={30} className="h-3" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">CMP</span>
                <span className="text-sm text-muted-foreground">10%</span>
              </div>
              <Progress value={10} className="h-3" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
