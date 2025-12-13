import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, AlertCircle, Gavel, Users, FileText, ArrowRight } from "lucide-react";
import { toast } from "sonner";

// Types
interface Commission {
    id: string;
    name: string;
    president: string;
    membersCount: number;
    currentBill: string;
    progress: number;
    nextMeeting: string;
}

// Mock Data Service
const fetchCommissions = async (): Promise<Commission[]> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.05) {
                reject(new Error("Erreur de chargement des commissions."));
            } else {
                resolve([
                    { id: "1", name: "Commission des Finances et du Budget", president: "Hon. Jean-Marc Ekome", membersCount: 25, currentBill: "Projet de Loi de Finances 2026", progress: 65, nextMeeting: "06/12/2025" },
                    { id: "2", name: "Commission des Lois et Affaires Administratives", president: "Hon. Sarah Ntsame", membersCount: 22, currentBill: "Réforme du Code Électoral", progress: 30, nextMeeting: "08/12/2025" },
                    { id: "3", name: "Commission des Affaires Étrangères", president: "Hon. Paul Biyoghe", membersCount: 18, currentBill: "Ratification Accord ZLECAF", progress: 90, nextMeeting: "10/12/2025" },
                    { id: "4", name: "Commission des Affaires Sociales", president: "Hon. Marie-Claire A.", membersCount: 20, currentBill: "Loi sur l'Assurance Maladie", progress: 15, nextMeeting: "12/12/2025" },
                ]);
            }
        }, 1500);
    });
};

const Commissions = () => {
    const { t } = useLanguage();
    const [commissions, setCommissions] = useState<Commission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadCommissions = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchCommissions();
            setCommissions(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue");
            toast.error("Impossible de charger les commissions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCommissions();
    }, []);

    const handleViewWork = (commission: Commission) => {
        toast.info(`Accès aux travaux de la ${commission.name}`);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">{t('president.sidebar.commissions')}</h1>
                    <p className="text-muted-foreground">Suivi des travaux des Commissions Permanentes.</p>
                </div>
                <Button onClick={loadCommissions} variant="outline" disabled={loading}>
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
                    <Button onClick={loadCommissions} variant="outline">Réessayer</Button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {commissions.map((commission) => (
                        <Card key={commission.id} className="p-6 hover:shadow-md transition-all duration-200 border-border/50 flex flex-col justify-between">
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <Gavel className="w-6 h-6 text-primary" />
                                    </div>
                                    <Badge variant="outline" className="bg-background">
                                        <Users className="w-3 h-3 mr-1" />
                                        {commission.membersCount} membres
                                    </Badge>
                                </div>

                                <h3 className="font-bold text-lg mb-1">{commission.name}</h3>
                                <p className="text-sm text-muted-foreground mb-4">Président: {commission.president}</p>

                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium flex items-center gap-2">
                                            <FileText className="w-3 h-3" />
                                            {commission.currentBill}
                                        </span>
                                        <span className="text-muted-foreground">{commission.progress}%</span>
                                    </div>
                                    <Progress value={commission.progress} className="h-2" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                <span className="text-xs text-muted-foreground">
                                    Prochaine réunion: <span className="font-medium text-foreground">{commission.nextMeeting}</span>
                                </span>
                                <Button size="sm" variant="ghost" className="hover:bg-primary/5 hover:text-primary" onClick={() => handleViewWork(commission)}>
                                    Voir les travaux <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Commissions;
