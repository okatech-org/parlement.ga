import {
  FileText,
  MapPin,
  MessageSquare,
  Calendar,
  ArrowLeftRight,
  AlertTriangle,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const SenatorDashboardSection = () => {
  const stats = [
    { label: "Textes à examiner", value: 8, icon: FileText, color: "text-primary" },
    { label: "Doléances locales", value: 12, icon: AlertTriangle, color: "text-amber-600" },
    { label: "Visites terrain", value: 3, icon: MapPin, color: "text-blue-600" },
    { label: "Jours restants session", value: 45, icon: Calendar, color: "text-emerald-600" },
  ];

  const urgentTexts = [
    {
      id: 1,
      reference: "PL-2024-045",
      title: "Loi de finances pour l'exercice 2025",
      daysLeft: 16,
      priority: "high",
    },
    {
      id: 2,
      reference: "PL-2024-042",
      title: "Projet de loi sur la décentralisation territoriale",
      daysLeft: 11,
      priority: "urgent",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
          Bienvenue dans votre espace
        </h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de votre activité sénatoriale
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color} opacity-70`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Textes urgents */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
            Navette - Textes Urgents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {urgentTexts.map((text) => (
            <div key={text.id} className="p-3 bg-muted/30 rounded-lg border border-transparent hover:border-border transition-colors cursor-pointer">
              <div className="flex justify-between mb-1">
                <span className="text-xs font-bold text-foreground/80">{text.reference}</span>
                <Badge variant={text.priority === 'urgent' ? 'destructive' : 'default'} className="h-5 text-[10px]">
                  {text.daysLeft}j restants
                </Badge>
              </div>
              <p className="font-medium text-sm line-clamp-1">{text.title}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Prochaine réunion */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-lg text-primary">Commission des Collectivités</h4>
              <p className="text-sm text-muted-foreground">Prochaine réunion : Demain à 10h00</p>
              <p className="text-xs text-muted-foreground mt-1">Salle B12 - Examen du PL Décentralisation</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
