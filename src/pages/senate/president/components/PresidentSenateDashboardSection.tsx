import { Users, FileText, Building2, Calendar, TrendingUp, ArrowLeftRight, Gavel } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const PresidentSenateDashboardSection = () => {
  const stats = [
    { 
      icon: Users, 
      value: "67", 
      label: "Sénateurs", 
      subLabel: "Toutes provinces",
      iconBg: "bg-muted"
    },
    { 
      icon: FileText, 
      value: "23", 
      label: "Textes en Navette", 
      subLabel: "En cours d'examen",
      iconBg: "bg-muted"
    },
    { 
      icon: Building2, 
      value: "6", 
      label: "Commissions Permanentes", 
      subLabel: "Actives",
      iconBg: "bg-muted"
    },
    { 
      icon: Calendar, 
      value: "4", 
      label: "Séances Plénières", 
      subLabel: "Ce mois",
      iconBg: "bg-muted",
      urgent: true
    },
  ];

  const pendingActions = [
    { id: 1, reference: "PL-2024-041", title: "Loi sur les collectivités locales", action: "Validation navette", priority: "high" },
    { id: 2, reference: "PL-2024-039", title: "Réforme du code minier", action: "Convocation CMP", priority: "medium" },
    { id: 3, reference: "PL-2024-038", title: "Budget 2025", action: "Ordre du jour", priority: "high" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14 border-2 border-primary/20">
          <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">P</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
            Président du Sénat
          </h1>
          <p className="text-muted-foreground">
            République Gabonaise - Union, Travail, Justice
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6 text-foreground" />
                </div>
                <p className={`text-3xl font-bold ${stat.urgent ? "text-red-500" : "text-foreground"}`}>
                  {stat.value}
                </p>
                <p className="font-medium text-foreground text-sm mt-1">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.subLabel}</p>
                {stat.urgent && (
                  <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Attendance Rate Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-foreground" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-green-500 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> Hausse
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Taux de Présence en Séance</p>
            <p className="text-4xl font-bold text-foreground mt-1">92%</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ArrowLeftRight className="h-5 w-5 text-primary" />
              Actions prioritaires
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingActions.map((action) => (
              <div key={action.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">{action.reference}</Badge>
                    <Badge className={action.priority === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'} variant="outline">
                      {action.action}
                    </Badge>
                  </div>
                  <p className="font-medium text-sm truncate">{action.title}</p>
                </div>
                <Button size="sm" variant="secondary" className="ml-2 shrink-0">Traiter</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
