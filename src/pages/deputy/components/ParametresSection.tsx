import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, User, Lock, Bell, Smartphone, Moon } from "lucide-react";

export const ParametresSection = () => {
    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-serif font-bold mb-2">Paramètres</h1>
                <p className="text-muted-foreground">
                    Configuration de votre compte et préférences
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">

                {/* Sidebar Menu */}
                <Card className="p-4 neu-raised h-fit">
                    <nav className="space-y-2">
                        <Button variant="ghost" className="w-full justify-start font-bold bg-primary/10 text-primary"><User className="w-4 h-4 mr-2" /> Profil</Button>
                        <Button variant="ghost" className="w-full justify-start"><Lock className="w-4 h-4 mr-2" /> Sécurité</Button>
                        <Button variant="ghost" className="w-full justify-start"><Bell className="w-4 h-4 mr-2" /> Notifications</Button>
                        <Button variant="ghost" className="w-full justify-start"><Smartphone className="w-4 h-4 mr-2" /> Appareils</Button>
                        <Button variant="ghost" className="w-full justify-start"><Moon className="w-4 h-4 mr-2" /> Apparence</Button>
                    </nav>
                </Card>

                {/* Content */}
                <div className="md:col-span-2 space-y-6">

                    <Card className="p-6 neu-raised">
                        <h3 className="font-bold text-lg mb-4">Informations Personnelles</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Prénom</Label>
                                    <Input defaultValue="Jean" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Nom</Label>
                                    <Input defaultValue="Dupont" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Email Officiel</Label>
                                <Input defaultValue="jean.dupont@assemblee.ga" disabled />
                            </div>
                            <div className="space-y-2">
                                <Label>Circonscription</Label>
                                <Input defaultValue="1er Siège, Département du Komo" disabled />
                            </div>
                            <Button>Enregistrer les modifications</Button>
                        </div>
                    </Card>

                    <Card className="p-6 neu-raised">
                        <h3 className="font-bold text-lg mb-4">Préférences de Notification</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Alertes de Vote</Label>
                                    <p className="text-sm text-muted-foreground">Recevoir une notification avant chaque vote.</p>
                                </div>
                                <Switch checked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Convocation Commissions</Label>
                                    <p className="text-sm text-muted-foreground">Email et Push pour les réunions.</p>
                                </div>
                                <Switch checked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Messages Citoyens</Label>
                                    <p className="text-sm text-muted-foreground">Résumé quotidien des doléances.</p>
                                </div>
                                <Switch />
                            </div>
                        </div>
                    </Card>

                </div>

            </div>
        </div>
    );
};
