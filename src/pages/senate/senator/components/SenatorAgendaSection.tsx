import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const SenatorAgendaSection = () => {
  const events = [
    {
      id: 1,
      title: "Commission des Collectivités",
      date: "15 Déc 2024",
      time: "10:00",
      location: "Salle B12",
      type: "commission",
    },
    {
      id: 2,
      title: "Séance plénière",
      date: "16 Déc 2024",
      time: "09:00",
      location: "Hémicycle",
      type: "pleniere",
    },
    {
      id: 3,
      title: "Visite terrain - Bitam",
      date: "18 Déc 2024",
      time: "08:00",
      location: "Bitam, Woleu-Ntem",
      type: "visite",
    },
  ];

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "commission":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Commission</Badge>;
      case "pleniere":
        return <Badge className="bg-primary hover:bg-primary/90">Plénière</Badge>;
      case "visite":
        return <Badge className="bg-green-500 hover:bg-green-600">Visite</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
          Agenda
        </h1>
        <p className="text-muted-foreground">
          Vos prochains rendez-vous et événements
        </p>
      </div>

      <div className="grid gap-4">
        {events.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeBadge(event.type)}
                  </div>
                  <h3 className="font-semibold text-foreground">{event.title}</h3>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {event.date}
                    </p>
                    <p className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.time}
                    </p>
                    <p className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
