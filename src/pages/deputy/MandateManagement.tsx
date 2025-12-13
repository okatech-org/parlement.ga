import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Users, CreditCard, FileText } from "lucide-react";

const MandateManagement = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-serif font-bold text-foreground">Gestion du Mandat</h1>
                <p className="text-muted-foreground">Gérez votre profil, vos collaborateurs et vos frais de mandat.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Profile */}
                <Card className="p-6 border-border/50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold">Informations Personnelles</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <Label>Circonscription</Label>
                            <Input defaultValue="1ère Circonscription de Libreville" disabled className="bg-muted" />
                        </div>
                        <div>
                            <Label>Parti Politique</Label>
                            <Input defaultValue="Parti Démocratique Gabonais (PDG)" disabled className="bg-muted" />
                        </div>
                        <div>
                            <Label>Email Officiel</Label>
                            <Input defaultValue="depute.nom@assemblee.ga" />
                        </div>
                    </div>
                </Card>

                {/* Collaborators */}
                <Card className="p-6 border-border/50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Users className="w-5 h-5 text-blue-500" />
                        </div>
                        <h2 className="text-xl font-bold">Collaborateurs</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">JP</div>
                                <div>
                                    <p className="font-medium">Jean Pierre</p>
                                    <p className="text-xs text-muted-foreground">Attaché Parlementaire</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm">Gérer</Button>
                        </div>
                        <Button className="w-full" variant="outline">Ajouter un collaborateur</Button>
                    </div>
                </Card>

                {/* Expenses */}
                <Card className="p-6 border-border/50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <CreditCard className="w-5 h-5 text-green-500" />
                        </div>
                        <h2 className="text-xl font-bold">Frais de Mandat</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Budget Mensuel</span>
                            <span className="font-bold">2.000.000 FCFA</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Utilisé</span>
                            <span className="font-bold text-green-600">1.250.000 FCFA</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[62%]"></div>
                        </div>
                        <Button className="w-full" variant="outline">
                            <FileText className="w-4 h-4 mr-2" />
                            Déclarer une dépense
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default MandateManagement;
