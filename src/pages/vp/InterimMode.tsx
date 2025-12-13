import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Crown, ShieldCheck, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const InterimMode = () => {
    const [isInterimActive, setIsInterimActive] = useState(false);

    const toggleInterim = () => {
        if (!isInterimActive) {
            toast.warning("Activation du Mode Intérim", {
                description: "Vous allez accéder aux prérogatives présidentielles. Cette action est journalisée."
            });
        } else {
            toast.info("Désactivation du Mode Intérim");
        }
        setIsInterimActive(!isInterimActive);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-serif font-bold text-foreground">Mode Intérim</h1>
                <p className="text-muted-foreground">Activation des prérogatives présidentielles en cas d'absence ou d'empêchement.</p>
            </div>

            <Card className={`p-8 border-2 ${isInterimActive ? 'border-amber-500 bg-amber-500/5' : 'border-border'}`}>
                <div className="flex flex-col items-center text-center space-y-6">
                    <div className={`p-6 rounded-full ${isInterimActive ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        <Crown className="w-12 h-12" />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-2">
                            {isInterimActive ? "INTÉRIM ACTIF" : "INTÉRIM INACTIF"}
                        </h2>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            {isInterimActive
                                ? "Vous exercez actuellement les fonctions de Président de l'Assemblée Nationale par intérim."
                                : "Activez ce mode uniquement sur instruction officielle ou en cas de vacance constatée."}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="font-bold text-sm">DÉSACTIVÉ</span>
                        <Switch
                            checked={isInterimActive}
                            onCheckedChange={toggleInterim}
                            className="data-[state=checked]:bg-amber-500"
                        />
                        <span className="font-bold text-sm">ACTIVÉ</span>
                    </div>

                    {isInterimActive && (
                        <div className="w-full max-w-md bg-background p-4 rounded-lg border border-amber-500/20 text-left mt-6">
                            <h3 className="font-bold flex items-center gap-2 mb-2 text-amber-700">
                                <ShieldCheck className="w-4 h-4" />
                                Accès Débloqués
                            </h3>
                            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                                <li>Signature des actes administratifs</li>
                                <li>Convocation du Bureau</li>
                                <li>Accès aux dossiers confidentiels Présidence</li>
                            </ul>
                        </div>
                    )}
                </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 border-l-4 border-l-blue-500">
                    <h3 className="font-bold text-lg mb-2">Protocole d'Activation</h3>
                    <p className="text-sm text-muted-foreground">
                        L'activation du mode intérim nécessite une double authentification et est notifiée immédiatement au Secrétariat Général et au Directeur de Cabinet.
                    </p>
                </Card>
                <Card className="p-6 border-l-4 border-l-red-500">
                    <h3 className="font-bold text-lg mb-2">Cadre Légal</h3>
                    <p className="text-sm text-muted-foreground">
                        Conformément à l'article 15 du Règlement Intérieur, le 1er Vice-Président supplée le Président dans la plénitude de ses fonctions.
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default InterimMode;
