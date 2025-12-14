import { Scale, Calendar, MapPin, Users, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const ParliamentSessionsSection = () => {
  const sessions = [
    {
      id: 1,
      reference: "CONG-2024-003",
      title: "Révision Constitutionnelle - Autonomie des Collectivités",
      date: "20 Décembre 2024",
      time: "10h00",
      location: "Palais du Parlement - Hémicycle Unifié",
      status: "upcoming",
    },
    {
      id: 2,
      reference: "CONG-2024-002",
      title: "Modification du Code Électoral",
      date: "15 Novembre 2024",
      time: "09h00",
      location: "Palais du Parlement",
      status: "completed",
      result: "Adopté",
    },
    {
      id: 3,
      reference: "CONG-2024-001",
      title: "Révision Art. 47 - Mandat Présidentiel",
      date: "10 Octobre 2024",
      time: "10h00",
      location: "Palais du Parlement",
      status: "completed",
      result: "Adopté",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
          Sessions du Congrès
        </h1>
        <p className="text-muted-foreground">
          Historique et prochaines sessions du Parlement réuni
        </p>
      </div>

      <div className="grid gap-4">
        {sessions.map((session) => (
          <Card key={session.id} className={`hover:shadow-lg transition-shadow ${session.status === 'upcoming' ? 'border-2 border-primary' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{session.reference}</Badge>
                    {session.status === 'upcoming' ? (
                      <Badge className="bg-primary">À venir</Badge>
                    ) : (
                      <Badge className="bg-green-500">{session.result}</Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">{session.title}</h3>
                  <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                    <p className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {session.date} à {session.time}
                    </p>
                    <p className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {session.location}
                    </p>
                  </div>
                </div>
                {session.status === 'upcoming' && (
                  <Button>Consulter</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
