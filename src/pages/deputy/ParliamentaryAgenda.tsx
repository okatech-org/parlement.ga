import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, MapPin, Clock } from "lucide-react";

const ParliamentaryAgenda = () => {
    const events = [
        { id: 1, title: "Séance Plénière - Vote Budget", date: "2025-12-08", time: "09:00", location: "Hémicycle", type: "Plenary" },
        { id: 2, title: "Commission des Finances", date: "2025-12-09", time: "14:00", location: "Salle A", type: "Commission" },
        { id: 3, title: "Réunion Groupe Parlementaire", date: "2025-12-10", time: "10:00", location: "Salle des Groupes", type: "Group" },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-serif font-bold text-foreground">Agenda Parlementaire</h1>
                <p className="text-muted-foreground">Votre calendrier personnel et les événements de l'Assemblée.</p>
            </div>

            <div className="grid gap-4">
                {events.map((event) => (
                    <Card key={event.id} className="p-6 border-l-4 border-l-primary border-y border-r border-border/50 hover:shadow-md transition-all">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg w-20">
                                    <span className="text-sm font-bold text-muted-foreground">{new Date(event.date).toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                                    <span className="text-2xl font-bold">{new Date(event.date).getDate()}</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-bold text-lg">{event.title}</h3>
                                        <Badge variant="outline">{event.type}</Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {event.time}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {event.location}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ParliamentaryAgenda;
