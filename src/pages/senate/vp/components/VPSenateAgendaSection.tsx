import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const VPSenateAgendaSection = () => {
  const events = [
    { id: 1, title: "Séance plénière (suppléance)", date: "16 Déc 2024", time: "09:00", location: "Hémicycle" },
    { id: 2, title: "Réunion Commission Finances", date: "17 Déc 2024", time: "14:00", location: "Salle A12" },
    { id: 3, title: "Délégation UIP", date: "20 Déc 2024", time: "08:00", location: "Genève" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Agenda</h1>
        <p className="text-muted-foreground">Vos prochains rendez-vous</p>
      </div>

      <div className="grid gap-4">
        {events.map((e) => (
          <Card key={e.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <h3 className="font-semibold">{e.title}</h3>
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-1"><Calendar className="h-3 w-3" />{e.date}</p>
                <p className="flex items-center gap-1"><Clock className="h-3 w-3" />{e.time}</p>
                <p className="flex items-center gap-1"><MapPin className="h-3 w-3" />{e.location}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
