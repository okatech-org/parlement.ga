import { Calendar, Clock, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const PresidentSenateAgendaSection = () => {
  const agendaItems = [
    { id: 1, time: "09:00", type: "OPENING", title: "Ouverture de séance" },
    { id: 2, time: "09:30", type: "DEBATE", title: "Discussion générale - PL sur la décentralisation", reference: "PL-2024-042" },
    { id: 3, time: "11:00", type: "VOTE", title: "Vote sur les amendements de la Commission" },
    { id: 4, time: "12:00", type: "QUESTIONS", title: "Questions au Gouvernement" },
    { id: 5, time: "14:30", type: "VOTE", title: "Vote solennel - Loi de finances 2025", reference: "PL-2024-045" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
            Ordre du Jour
          </h1>
          <p className="text-muted-foreground">
            Gestion des séances plénières
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Modifier</Button>
          <Button>Publier</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Séance Plénière du 18 Décembre 2024
          </CardTitle>
          <CardDescription>Ordre du jour définitif</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {agendaItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="text-center min-w-[60px]">
                <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                <span className="text-sm font-medium">{item.time}</span>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={item.type === "VOTE" ? "default" : "secondary"}>
                    {item.type === "VOTE" ? "Vote" : item.type === "DEBATE" ? "Débat" : item.type === "QUESTIONS" ? "Questions" : "Ouverture"}
                  </Badge>
                  {item.reference && <Badge variant="outline">{item.reference}</Badge>}
                </div>
                <p className="font-medium">{item.title}</p>
              </div>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
