import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, AlertCircle, Clock, Flag, FileText, ChevronRight } from "lucide-react";
import { toast } from "sonner";

// Types
interface AgendaItem {
    id: string;
    title: string;
    type: "Bill" | "Question" | "Report" | "Debate";
    scheduledDate: string;
    priority: "High" | "Medium" | "Low";
    commission: string;
    status: "Pending" | "In Review" | "Scheduled";
}

// Mock Data Service
const fetchAgendaItems = async (): Promise<AgendaItem[]> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.05) {
                reject(new Error("Erreur de chargement de l'ordre du jour."));
            } else {
                resolve([
                    { id: "1", title: "Projet de Loi de Finances 2026", type: "Bill", scheduledDate: "2025-12-08", priority: "High", commission: "Finances", status: "Scheduled" },
                    { id: "2", title: "Question orale - Sécurité Alimentaire", type: "Question", scheduledDate: "2025-12-10", priority: "Medium", commission: "Affaires Sociales", status: "Scheduled" },
                    { id: "3", title: "Rapport d'activité - Commission des Lois", type: "Report", scheduledDate: "2025-12-12", priority: "Low", commission: "Lois", status: "Pending" },
                    { id: "4", title: "Débat général - Transition Énergétique", type: "Debate", scheduledDate: "2025-12-15", priority: "High", commission: "Environnement", status: "In Review" },
                    { id: "5", title: "Projet de Loi - Protection des Données", type: "Bill", scheduledDate: "2025-12-18", priority: "High", commission: "Lois", status: "In Review" },
                ]);
            }
        }, 1100);
    });
};

const Agenda = () => {
    const { t } = useLanguage();
    const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterPriority, setFilterPriority] = useState<string>("All");

    const loadAgenda = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchAgendaItems();
            setAgendaItems(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue");
            toast.error("Impossible de charger l'ordre du jour");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAgenda();
    }, []);

    const handleViewItem = (item: AgendaItem) => {
        toast.info(`Consultation de l'élément : ${item.title}`);
    };

    const filteredItems = agendaItems.filter(item =>
        filterPriority === "All" || item.priority === filterPriority
    );

    const getPriorityBadge = (priority: AgendaItem["priority"]) => {
        const variants = {
            "High": { variant: "destructive" as const, label: "Haute" },
            "Medium": { variant: "default" as const, label: "Moyenne" },
            "Low": { variant: "secondary" as const, label: "Basse" }
        };
        const { variant, label } = variants[priority];
        return <Badge variant={variant}>{label}</Badge>;
    };

    const getTypeIcon = (type: AgendaItem["type"]) => {
        const icons = {
            "Bill": FileText,
            "Question": Flag,
            "Report": FileText,
            "Debate": FileText
        };
        return icons[type];
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">{t('president.sidebar.agenda')}</h1>
                    <p className="text-muted-foreground">Ordre du jour législatif et planification des travaux.</p>
                </div>
                <Button onClick={loadAgenda} variant="outline" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Actualiser"}
                </Button>
            </div>

            {/* Filters */}
            <Card className="p-4 bg-card border-border/50">
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {["All", "High", "Medium", "Low"].map((priority) => (
                        <Button
                            key={priority}
                            variant={filterPriority === priority ? "default" : "outline"}
                            onClick={() => setFilterPriority(priority)}
                            size="sm"
                            className="whitespace-nowrap"
                        >
                            {priority === "All" ? "Toutes" : priority === "High" ? "Haute" : priority === "Medium" ? "Moyenne" : "Basse"}
                        </Button>
                    ))}
                </div>
            </Card>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : error ? (
                <div className="flex flex-col justify-center items-center h-64 text-center space-y-4">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                    <p className="text-lg font-medium text-red-500">{error}</p>
                    <Button onClick={loadAgenda} variant="outline">Réessayer</Button>
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-64 text-center text-muted-foreground">
                    <FileText className="w-12 h-12 mb-4 opacity-20" />
                    <p>Aucun élément trouvé pour ce filtre.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredItems.map((item) => {
                        const TypeIcon = getTypeIcon(item.type);
                        return (
                            <Card key={item.id} className="p-6 hover:shadow-md transition-all duration-200 border-border/50">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="p-3 bg-primary/10 rounded-lg">
                                            <TypeIcon className="w-6 h-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-bold text-lg">{item.title}</h3>
                                                {getPriorityBadge(item.priority)}
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(item.scheduledDate).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                                                </div>
                                                <span>• Commission: {item.commission}</span>
                                                <span>• {item.status === "Scheduled" ? "Planifié" : item.status === "In Review" ? "En révision" : "En attente"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button onClick={() => handleViewItem(item)} variant="ghost" className="hover:bg-primary/5">
                                        Détails <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Agenda;
