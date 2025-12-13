import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Video } from "lucide-react";

export const AgendaSection = () => {
    const events = [
        {
            day: "05",
            month: "DÉC",
            title: "Séance Plénière : Questions au Gouvernement",
            time: "15:00 - 18:00",
            location: "Hémicycle",
            type: "Plénière",
            color: "bg-primary",
        },
        {
            day: "06",
            month: "DÉC",
            title: "Commission des Finances",
            time: "09:30 - 12:30",
            location: "Salle Léon Mba",
            type: "Commission",
            color: "bg-secondary",
        },
        {
            day: "08",
            month: "DÉC",
            title: "Rencontre avec l'Association des Jeunes de l'Estuaire",
            time: "10:00 - 12:00",
            location: "Permanence Parlementaire",
            type: "Circonscription",
            color: "bg-green-500",
        },
        {
            day: "10",
            month: "DÉC",
            title: "Réunion Groupe Parlementaire",
            time: "14:00 - 16:00",
            location: "Visioconférence",
            type: "Groupe",
            color: "bg-orange-500",
        },
    ];

    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-serif font-bold mb-2">Agenda Unifié</h1>
                <p className="text-muted-foreground">
                    Synchronisation de vos activités parlementaires et locales
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">

                {/* Calendar View Placeholder */}
                <Card className="lg:col-span-2 p-6 neu-raised min-h-[500px] flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Calendar className="text-primary" /> Décembre 2025
                        </h3>
                        <div className="flex gap-2">
                            <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Mois</Badge>
                            <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Semaine</Badge>
                            <Badge variant="secondary" className="cursor-pointer">Jour</Badge>
                        </div>
                    </div>

                    {/* Calendar Grid Mockup */}
                    <div className="flex-1 border border-border rounded-xl bg-background/50 p-4">
                        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-sm font-bold text-muted-foreground">
                            <div>LUN</div><div>MAR</div><div>MER</div><div>JEU</div><div>VEN</div><div>SAM</div><div>DIM</div>
                        </div>
                        <div className="grid grid-cols-7 grid-rows-5 gap-2 h-full">
                            {Array.from({ length: 35 }).map((_, i) => (
                                <div key={i} className={`border border-border/50 rounded-lg p-1 text-xs relative ${i === 4 ? 'bg-primary/10 border-primary/30' : ''}`}>
                                    <span className="font-medium text-muted-foreground">{i + 1}</span>
                                    {i === 4 && <div className="mt-1 w-full h-1.5 rounded-full bg-primary"></div>}
                                    {i === 5 && <div className="mt-1 w-full h-1.5 rounded-full bg-secondary"></div>}
                                    {i === 7 && <div className="mt-1 w-full h-1.5 rounded-full bg-green-500"></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Upcoming Events List */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg mb-2">Prochains Événements</h3>
                    {events.map((event, index) => (
                        <Card key={index} className="p-4 neu-raised hover:scale-[1.02] transition-transform cursor-pointer group">
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center justify-center min-w-[60px] p-2 neu-inset rounded-xl">
                                    <span className="text-2xl font-bold text-foreground">{event.day}</span>
                                    <span className="text-xs font-bold text-muted-foreground uppercase">{event.month}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <Badge className={`${event.color} text-white hover:${event.color} border-none`}>{event.type}</Badge>
                                    </div>
                                    <h4 className="font-bold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">{event.title}</h4>
                                    <div className="space-y-1 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3 h-3" /> {event.time}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {event.location === 'Visioconférence' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                                            {event.location}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

            </div>
        </div>
    );
};
