import { Calendar, Clock, MapPin, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const ParliamentAgendaSection = () => {
  const events = [
    {
      id: 1,
      title: "Congrès - Révision Constitutionnelle",
      date: "20 Déc 2024",
      time: "10:00",
      location: "Palais du Parlement - Hémicycle Unifié",
      type: "congress",
    },
    {
      id: 2,
      title: "CMP - Loi de Finances 2025",
      date: "18 Déc 2024",
      time: "14:00",
      location: "Salle des Commissions",
      type: "cmp",
    },
    {
      id: 3,
      title: "Réunion préparatoire Congrès",
      date: "19 Déc 2024",
      time: "09:00",
      location: "Salle A12",
      type: "preparatory",
    },
  ];

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "congress":
        return <Badge className="bg-primary hover:bg-primary/90">Congrès</Badge>;
      case "cmp":
        return <Badge className="bg-amber-500 hover:bg-amber-600">CMP</Badge>;
      case "preparatory":
        return <Badge variant="secondary">Préparatoire</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
          Agenda du Congrès
        </h1>
        <p className="text-muted-foreground">
          Prochaines sessions et réunions du Parlement
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
