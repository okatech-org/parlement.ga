import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, MapPin, Users } from "lucide-react";

const VPAgenda = () => {
    const events = [
        { id: 1, title: "Réunion de Coordination VP", date: "2025-12-08", time: "10:00", location: "Bureau VP", type: "Interne" },
        { id: 2, title: "Représentation - Cérémonie Officielle", date: "2025-12-09", time: "11:00", location: "Palais du Bord de Mer", type: "Officiel" },
        { id: 3, title: "Supervision Commission des Lois", date: "2025-12-10", time: "14:00", location: "Salle des Commissions", type: "Commission" },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-serif font-bold text-foreground">Agenda Institutionnel</h1>
                <p className="text-muted-foreground">Votre calendrier de représentations et de réunions.</p>
            </div>

            <div className="grid gap-4">
                {events.map((event) => (
                    <Card key={event.id} className="p-6 border-l-4 border-l-indigo-500 border-y border-r border-border/50 hover:shadow-md transition-all">
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
                                            <Users className="w-4 h-4" />
                                            François Ndong Obiang
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

export default VPAgenda;
