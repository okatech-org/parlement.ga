import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, AlertCircle, Calendar, Users, CheckCircle, XCircle, MinusCircle } from "lucide-react";
import { toast } from "sonner";

// Types
interface PlenarySession {
    id: string;
    title: string;
    date: string;
    time: string;
    status: "Scheduled" | "In Progress" | "Completed";
    attendance: number;
    totalDeputies: number;
    votingResults?: {
        for: number;
        against: number;
        abstain: number;
    };
}

// Mock Data Service
const fetchPlenarySessions = async (): Promise<PlenarySession[]> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.05) {
                reject(new Error("Erreur de chargement des séances."));
            } else {
                resolve([
                    {
                        id: "1",
                        title: "Séance Plénière - Vote Budget 2026",
                        date: "2025-12-08",
                        time: "09:00",
                        status: "Scheduled",
                        attendance: 0,
                        totalDeputies: 145
                    },
                    {
                        id: "2",
                        title: "Séance Plénière - Loi sur le Numérique",
                        date: "2025-11-30",
                        time: "14:00",
                        status: "Completed",
                        attendance: 138,
                        totalDeputies: 145,
                        votingResults: { for: 120, against: 12, abstain: 6 }
                    },
                    {
                        id: "3",
                        title: "Séance Extraordinaire - Questions au Gouvernement",
                        date: "2025-12-02",
                        time: "10:00",
                        status: "In Progress",
                        attendance: 135,
                        totalDeputies: 145
                    },
                ]);
            }
        }, 1300);
    });
};

const Plenary = () => {
    const { t } = useLanguage();
    const [sessions, setSessions] = useState<PlenarySession[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadSessions = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchPlenarySessions();
            setSessions(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue");
            toast.error("Impossible de charger les séances plénières");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSessions();
    }, []);

    const handleViewDetails = (session: PlenarySession) => {
        toast.info(`Consultation de la séance : ${session.title}`);
    };

    const getStatusBadge = (status: PlenarySession["status"]) => {
        const variants = {
            "Scheduled": { variant: "outline" as const, label: "Prévue", color: "text-blue-500" },
            "In Progress": { variant: "default" as const, label: "En cours", color: "text-green-500" },
            "Completed": { variant: "secondary" as const, label: "Terminée", color: "text-gray-500" }
        };
        const { variant, label, color } = variants[status];
        return <Badge variant={variant} className={color}>{label}</Badge>;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">{t('president.sidebar.plenary')}</h1>
                    <p className="text-muted-foreground">Gestion et suivi des Séances Plénières de l'Assemblée.</p>
                </div>
                <Button onClick={loadSessions} variant="outline" disabled={loading}>
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
                    <Button onClick={loadSessions} variant="outline">Réessayer</Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {sessions.map((session) => (
                        <Card key={session.id} className="p-6 hover:shadow-md transition-all duration-200 border-border/50">
                            <div className="space-y-4">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-bold text-lg">{session.title}</h3>
                                            {getStatusBadge(session.status)}
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(session.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                Présence: {session.attendance}/{session.totalDeputies} députés
                                            </div>
                                        </div>
                                    </div>
                                    <Button onClick={() => handleViewDetails(session)} variant="outline">
                                        Voir détails
                                    </Button>
                                </div>

                                {session.votingResults && (
                                    <div className="pt-4 border-t border-border/50">
                                        <h4 className="text-sm font-semibold mb-3">Résultats du vote</h4>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                                <div>
                                                    <p className="text-2xl font-bold text-green-500">{session.votingResults.for}</p>
                                                    <p className="text-xs text-muted-foreground">Pour</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <XCircle className="w-5 h-5 text-red-500" />
                                                <div>
                                                    <p className="text-2xl font-bold text-red-500">{session.votingResults.against}</p>
                                                    <p className="text-xs text-muted-foreground">Contre</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MinusCircle className="w-5 h-5 text-gray-500" />
                                                <div>
                                                    <p className="text-2xl font-bold text-gray-500">{session.votingResults.abstain}</p>
                                                    <p className="text-xs text-muted-foreground">Abstentions</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Plenary;
