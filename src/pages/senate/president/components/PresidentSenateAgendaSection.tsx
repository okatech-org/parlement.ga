import { Calendar, Clock, ChevronRight, Filter, Plus, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AnimatedDashboardCard } from "@/components/animations/DashboardAnimations";

export const PresidentSenateAgendaSection = () => {
  const agendaItems = [
    { id: 1, time: "09:00", type: "OPENING", title: "Ouverture de séance" },
    { id: 2, time: "09:30", type: "DEBATE", title: "Discussion générale - PL sur la décentralisation", reference: "PL-2024-042" },
    { id: 3, time: "11:00", type: "VOTE", title: "Vote sur les amendements de la Commission" },
    { id: 4, time: "12:00", type: "QUESTIONS", title: "Questions au Gouvernement" },
    { id: 5, time: "14:30", type: "VOTE", title: "Vote solennel - Loi de finances 2025", reference: "PL-2024-045" },
  ];

  const handlePublish = () => {
    toast.success("Ordre du jour publié", {
      description: "Notification envoyée à tous les sénateurs"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground mb-1">
            Ordre du Jour
          </h1>
          <p className="text-muted-foreground text-sm">
            Planification des séances plénières
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button size="sm" onClick={handlePublish}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Point
          </Button>
        </div>
      </div>

      <AnimatedDashboardCard delay={0.1}>
        <Card className="overflow-hidden">
          <div className="bg-primary/5 p-1">
            <div className="bg-background rounded-t-lg border-b p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Séance Plénière du 18 Décembre 2024</h3>
                  <p className="text-xs text-muted-foreground">Session Ordinaire • Hémicycle Omar Bongo</p>
                </div>
              </div>
              <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50">Confirmé</Badge>
            </div>
          </div>

          <CardContent className="p-0">
            <div className="divide-y">
              {agendaItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors group cursor-pointer"
                >
                  <div className="text-center min-w-[70px] flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-foreground">{item.time}</span>
                    <span className="text-[10px] uppercase text-muted-foreground font-medium tracking-wider">Heure</span>
                  </div>

                  <div className={`w-1 h-12 rounded-full ${item.type === "VOTE" ? "bg-primary" :
                      item.type === "DEBATE" ? "bg-amber-500" :
                        item.type === "QUESTIONS" ? "bg-blue-500" : "bg-slate-300"
                    }`} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] h-5 ${item.type === "VOTE" ? "text-primary bg-primary/10" :
                            item.type === "DEBATE" ? "text-amber-600 bg-amber-100" :
                              item.type === "QUESTIONS" ? "text-blue-600 bg-blue-100" : "text-slate-600 bg-slate-100"
                          }`}
                      >
                        {item.type === "VOTE" ? "VOTE SOLENNEL" : item.type === "DEBATE" ? "DÉBAT" : item.type === "QUESTIONS" ? "QUESTIONS" : "PROCÉDURE"}
                      </Badge>
                      {item.reference && <Badge variant="outline" className="text-[10px] h-5">{item.reference}</Badge>}
                    </div>
                    <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">{item.title}</p>
                  </div>

                  <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="bg-muted/20 p-3 border-t text-center">
            <Button variant="link" size="sm" className="text-muted-foreground h-auto p-0">
              Voir le procès-verbal provisoire
            </Button>
          </div>
        </Card>
      </AnimatedDashboardCard>

      <div className="flex justify-center mt-8">
        <Button onClick={handlePublish} className="w-full md:w-auto min-w-[200px]">
          Valider et Publier l'Ordre du Jour
        </Button>
      </div>
    </div>
  );
};
