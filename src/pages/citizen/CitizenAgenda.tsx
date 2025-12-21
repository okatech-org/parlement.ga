import { useState } from "react";
import {
    Calendar as CalendarIcon,
    Clock, MapPin, ChevronLeft, ChevronRight,
    Filter, Download, Share2, Building2, Landmark, Scale
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar"; // Assuming shadcn Calendar component exists

const CitizenAgenda = () => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    const events = [
        {
            id: 1,
            title: "Séance plénière - Questions au Gouvernement",
            chamber: "AN",
            date: new Date(),
            time: "15:00 - 17:00",
            location: "Hémicycle de l'Assemblée Nationale",
            type: "Séance Plénière",
            description: "Séance hebdomadaire de questions au Gouvernement, diffusée en direct."
        },
        {
            id: 2,
            title: "Commission des Lois - Audition du Ministre de la Justice",
            chamber: "Sénat",
            date: new Date(),
            time: "09:30 - 11:30",
            location: "Salle Médicis, Palais du Sénat",
            type: "Commission",
            description: "Audition sur le projet de loi de réforme constitutionnelle."
        },
        {
            id: 3,
            title: "Réunion du Congrès",
            chamber: "Congrès",
            date: new Date(new Date().setDate(new Date().getDate() + 2)), // 2 days later
            time: "14:00 - 18:00",
            location: "Palais du Congrès",
            type: "Congrès",
            description: "Réunion conjointe des deux chambres pour le vote de révision constitutionnelle."
        }
    ];

    const getChamberColor = (chamber: string) => {
        switch (chamber) {
            case 'AN': return "text-[#3A87FD] border-[#3A87FD] bg-[#3A87FD]/10";
            case 'Sénat': return "text-[#D19C00] border-[#D19C00] bg-[#D19C00]/10";
            case 'Congrès': return "text-[#77BA41] border-[#77BA41] bg-[#77BA41]/10";
            default: return "text-muted-foreground border-muted bg-muted";
        }
    };

    const getChamberIcon = (chamber: string) => {
        switch (chamber) {
            case 'AN': return <Building2 className="w-4 h-4 mr-2" />;
            case 'Sénat': return <Landmark className="w-4 h-4 mr-2" />;
            case 'Congrès': return <Scale className="w-4 h-4 mr-2" />;
            default: return null;
        }
    }

    // Filter events for selected date (mock logic mainly)
    // In a real app, you'd filter `events` based on `date` state
    const displayedEvents = events;

    return (
        <div className="space-y-6 container mx-auto max-w-6xl pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-xl border shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <CalendarIcon className="w-6 h-6 text-[#04CDB9]" />
                        Agenda Public
                    </h1>
                    <p className="text-muted-foreground mt-1">Consultez le calendrier des séances et événements parlementaires.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Share2 className="w-4 h-4 mr-2" />
                        Partager
                    </Button>
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Exporter
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Calendar Widget */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm uppercase text-muted-foreground">Calendrier</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border shadow-sm w-full max-w-[300px]"
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm uppercase text-muted-foreground">Filtres</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Institution</label>
                                <Select defaultValue="tous">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Toutes les institutions" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tous">Toutes</SelectItem>
                                        <SelectItem value="an">Assemblée Nationale</SelectItem>
                                        <SelectItem value="senat">Sénat</SelectItem>
                                        <SelectItem value="congres">Congrès</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Type d'événement</label>
                                <Select defaultValue="tous">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tous les types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tous">Tous</SelectItem>
                                        <SelectItem value="pleniere">Séance Plénière</SelectItem>
                                        <SelectItem value="commission">Commission</SelectItem>
                                        <SelectItem value="audition">Audition</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Events List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            {date ? date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Tous les événements"}
                        </h2>
                        <Badge variant="outline" className="bg-primary/5">3 événements</Badge>
                    </div>

                    {displayedEvents.map((event) => (
                        <Card key={event.id} className="hover:shadow-md transition-shadow group border-l-4" style={{ borderLeftColor: event.chamber === 'AN' ? '#3A87FD' : event.chamber === 'Sénat' ? '#D19C00' : '#77BA41' }}>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Time Column */}
                                    <div className="flex flex-col items-center justify-center min-w-[100px] border-r pr-6 text-center">
                                        <Clock className="w-5 h-5 text-muted-foreground mb-1" />
                                        <span className="font-bold text-lg">{event.time.split(' - ')[0]}</span>
                                        <span className="text-xs text-muted-foreground">{event.time.split(' - ')[1]}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="outline" className={getChamberColor(event.chamber)}>
                                                {getChamberIcon(event.chamber)}
                                                {event.chamber === 'AN' ? 'Assemblée Nationale' : event.chamber}
                                            </Badge>
                                            <Badge variant="secondary">{event.type}</Badge>
                                        </div>
                                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{event.title}</h3>
                                        <p className="text-muted-foreground text-sm">{event.description}</p>
                                        <div className="flex items-center text-sm text-muted-foreground mt-2 pt-2 border-t border-border/50 w-full">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            {event.location}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CitizenAgenda;
