import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, AlertCircle, Calendar, Clock, MapPin, ChevronRight, FileText } from "lucide-react";
import { toast } from "sonner";

// Types
interface ConferenceMeeting {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    status: "Scheduled" | "Completed" | "Cancelled";
    agendaItems: number;
}

// Mock Data Service
const fetchConferences = async (): Promise<ConferenceMeeting[]> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.05) {
                reject(new Error("Erreur de chargement des conférences."));
            } else {
                resolve([
                    { id: "1", title: "Conférence Ordinaire - Session Budgétaire", date: "2025-12-05", time: "10:00", location: "Salle des Actes", status: "Scheduled", agendaItems: 5 },
                    { id: "2", title: "Conférence Spéciale - Loi Numérique", date: "2025-11-28", time: "14:30", location: "Salle des Actes", status: "Completed", agendaItems: 3 },
                    { id: "3", title: "Planification Session Printemps", date: "2026-01-15", time: "09:00", location: "Bureau du Président", status: "Scheduled", agendaItems: 8 },
                ]);
            }
        }, 1200);
    });
};

const Conference = () => {
    const { t } = useLanguage();
    const [meetings, setMeetings] = useState<ConferenceMeeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadMeetings = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchConferences();
            setMeetings(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue");
            toast.error("Impossible de charger les conférences");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMeetings();
    }, []);

    const handleViewDetails = (meeting: ConferenceMeeting) => {
        toast.info(`Consultation de l'ordre du jour : ${meeting.title}`);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">{t('president.sidebar.conference')}</h1>
                    <p className="text-muted-foreground">Planification et suivi des Conférences des Présidents.</p>
                </div>
                <Button onClick={loadMeetings} variant="outline" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Actualiser"}
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : error ? (
                <div className="flex flex-col justify-center items-center h-64 text-center space-y-4">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                    <p className="text-lg font-medium text-red-500">{error}</p>
                    <Button onClick={loadMeetings} variant="outline">Réessayer</Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {meetings.map((meeting) => (
                        <Card key={meeting.id} className="p-6 hover:shadow-md transition-all duration-200 border-border/50">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-4 bg-primary/10 rounded-xl text-center min-w-[80px]">
                                        <div className="text-sm font-bold text-primary uppercase">{new Date(meeting.date).toLocaleString('fr-FR', { month: 'short' })}</div>
                                        <div className="text-2xl font-bold text-foreground">{new Date(meeting.date).getDate()}</div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-lg">{meeting.title}</h3>
                                            <Badge variant={meeting.status === 'Scheduled' ? 'default' : 'secondary'}>
                                                {meeting.status === 'Scheduled' ? 'Prévue' : 'Terminée'}
                                            </Badge>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {meeting.time}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {meeting.location}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FileText className="w-4 h-4" />
                                                {meeting.agendaItems} points à l'ordre du jour
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Button onClick={() => handleViewDetails(meeting)} className="w-full md:w-auto">
                                    Voir détails <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Conference;
