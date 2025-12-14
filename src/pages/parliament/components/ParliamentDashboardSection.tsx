import {
  Scale,
  FileText,
  Users,
  Calendar,
  ArrowLeftRight,
  Vote,
  BookOpen,
  Crown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export const ParliamentDashboardSection = () => {
  const stats = [
    { label: "Lois adoptées", value: 47, icon: FileText, subLabel: "Cette législature" },
    { label: "Révisions const.", value: 3, icon: BookOpen, subLabel: "Depuis 2023" },
    { label: "CMP convoquées", value: 12, icon: ArrowLeftRight, subLabel: "Toutes législatures" },
    { label: "Textes archivés", value: 1247, icon: Scale, subLabel: "Fonds historique" },
  ];

  const activeCMP = {
    reference: "CMP-2024-007",
    title: "Loi de Finances 2025",
    daysLeft: 8,
    progress: 45,
  };

  const nextSession = {
    reference: "CONG-2024-003",
    title: "Révision Constitutionnelle - Autonomie des Collectivités",
    date: "20 Décembre 2024",
    time: "10h00",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
          Bienvenue au Congrès
        </h1>
        <p className="text-muted-foreground flex items-center gap-2">
          <Crown className="h-4 w-4" />
          Espace du Parlement Gabonais réuni
        </p>
      </div>

      {/* CMP Active */}
      <Card className="border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/30">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-full">
                <ArrowLeftRight className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-amber-500 text-white">{activeCMP.reference}</Badge>
                  <Badge variant="outline" className="border-amber-500 text-amber-700">
                    Négociation en cours
                  </Badge>
                </div>
                <h3 className="font-bold text-lg text-foreground">CMP - {activeCMP.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {activeCMP.daysLeft} jours restants
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Avancement</p>
              <div className="flex items-center gap-2">
                <Progress value={activeCMP.progress} className="w-24 h-3" />
                <span className="font-bold">{activeCMP.progress}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-5 text-center">
                <Icon className="h-8 w-8 mx-auto mb-2 text-primary opacity-80" />
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-xs text-muted-foreground/70">{stat.subLabel}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Prochaine session */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <Badge className="w-fit">{nextSession.reference}</Badge>
          <CardTitle className="text-xl">{nextSession.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{nextSession.date}</p>
              <p className="text-muted-foreground">{nextSession.time}</p>
            </div>
            <Button size="lg">
              <Vote className="h-5 w-5 mr-2" />
              Accéder à la session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
