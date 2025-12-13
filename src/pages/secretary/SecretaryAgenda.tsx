import { Card } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const SecretaryAgenda = () => {
    const events = [
        {
            title: "Séance Plénière - Vote du Budget",
            date: "2024-03-15",
            time: "10:00 - 13:00",
            location: "Hémicycle",
            type: "Plénière",
            color: "bg-indigo-500"
        },
        {
            title: "Réunion de la Commission des Lois",
            date: "2024-03-16",
            time: "14:00 - 16:00",
            location: "Salle des Commissions A",
            type: "Commission",
            color: "bg-emerald-500"
        },
        {
            title: "Conférence des Présidents",
            date: "2024-03-18",
            time: "09:00 - 11:00",
            location: "Salle de Conférence",
            type: "Réunion",
            color: "bg-amber-500"
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-serif font-bold mb-2">Agenda Parlementaire</h1>
                    <p className="text-muted-foreground">Gestion et suivi des événements parlementaires.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    Nouvel Événement
                </Button>
            </div>

            <div className="grid gap-6">
                {events.map((event, index) => (
                    <Card key={index} className="group p-6 hover:shadow-lg transition-all duration-300 border-none shadow-sm bg-white dark:bg-card relative overflow-hidden">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${event.color}`} />

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`px-3 py-1 rounded-full ${event.color} bg-opacity-10 text-xs font-medium text-foreground`}>
                                        {event.type}
                                    </span>
                                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                                        <CalendarIcon className="w-3 h-3" />
                                        {event.date}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">{event.title}</h3>
                                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-2 bg-muted/50 px-2 py-1 rounded-md">
                                        <Clock className="w-4 h-4" />
                                        {event.time}
                                    </span>
                                    <span className="flex items-center gap-2 bg-muted/50 px-2 py-1 rounded-md">
                                        <MapPin className="w-4 h-4" />
                                        {event.location}
                                    </span>
                                </div>
                            </div>

                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default SecretaryAgenda;
