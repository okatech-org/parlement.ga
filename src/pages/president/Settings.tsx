import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";
import { User, Bell, Shield, Globe, Palette, Check } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
    const { t, language, setLanguage, dir } = useLanguage();
    const { theme, setTheme } = useTheme();

    // State
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);
    const [twoFactorAuth, setTwoFactorAuth] = useState(true);
    const [sessionTimeout, setSessionTimeout] = useState("30");

    const handleSave = () => {
        toast.success("Paramètres enregistrés avec succès");
    };

    const languages = [
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦' },
        { code: 'en', name: 'English', flag: '🇬🇧' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-serif font-bold text-foreground">{t('common.settings')}</h1>
                <p className="text-muted-foreground">Gérez vos préférences et paramètres de compte.</p>
            </div>

            {/* Profile Section */}
            <Card className="p-6 border-border/50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <User className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold">Profil</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="name">Nom complet</Label>
                        <Input id="name" defaultValue="Michel Régis Onanga Ndiaye" className="mt-2" />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="president@assemblee.ga" className="mt-2" />
                    </div>
                    <div>
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input id="phone" type="tel" defaultValue="+241 01 01 01 01" className="mt-2" />
                    </div>
                    <div>
                        <Label htmlFor="role">Rôle</Label>
                        <Input id="role" defaultValue="Président de l'Assemblée Nationale" disabled className="mt-2 bg-muted" />
                    </div>
                </div>
            </Card>

            {/* Language & Theme */}
            <Card className="p-6 border-border/50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold">Langue et Apparence</h2>
                </div>

                <div className="space-y-6">
                    <div>
                        <Label className="mb-3 block">Langue de l'interface</Label>
                        <div className="grid grid-cols-3 gap-3">
                            {languages.map((lang) => (
                                <Button
                                    key={lang.code}
                                    variant={language === lang.code ? "default" : "outline"}
                                    className="justify-start"
                                    onClick={() => setLanguage(lang.code)}
                                >
                                    <span className="mr-2 text-xl">{lang.flag}</span>
                                    {lang.name}
                                    {language === lang.code && <Check className="w-4 h-4 ml-auto" />}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <Label className="mb-3 block">Thème</Label>
                        <div className="grid grid-cols-3 gap-3">
                            <Button
                                variant={theme === "light" ? "default" : "outline"}
                                onClick={() => setTheme("light")}
                            >
                                <Palette className="w-4 h-4 mr-2" />
                                Clair
                                {theme === "light" && <Check className="w-4 h-4 ml-auto" />}
                            </Button>
                            <Button
                                variant={theme === "dark" ? "default" : "outline"}
                                onClick={() => setTheme("dark")}
                            >
                                <Palette className="w-4 h-4 mr-2" />
                                Sombre
                                {theme === "dark" && <Check className="w-4 h-4 ml-auto" />}
                            </Button>
                            <Button
                                variant={theme === "system" ? "default" : "outline"}
                                onClick={() => setTheme("system")}
                            >
                                <Palette className="w-4 h-4 mr-2" />
                                Système
                                {theme === "system" && <Check className="w-4 h-4 ml-auto" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Notifications */}
            <Card className="p-6 border-border/50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Bell className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold">Notifications</h2>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label>Notifications par email</Label>
                            <p className="text-sm text-muted-foreground">Recevoir les alertes importantes par email</p>
                        </div>
                        <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <Label>Notifications SMS</Label>
                            <p className="text-sm text-muted-foreground">Recevoir les alertes urgentes par SMS</p>
                        </div>
                        <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                    </div>
                </div>
            </Card>

            {/* Security */}
            <Card className="p-6 border-border/50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold">Sécurité</h2>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label>Authentification à deux facteurs</Label>
                            <p className="text-sm text-muted-foreground">Protection supplémentaire pour votre compte</p>
                        </div>
                        <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
                    </div>
                    <div>
                        <Label htmlFor="timeout">Délai d'expiration de session (minutes)</Label>
                        <Input
                            id="timeout"
                            type="number"
                            value={sessionTimeout}
                            onChange={(e) => setSessionTimeout(e.target.value)}
                            className="mt-2 max-w-[200px]"
                        />
                    </div>
                    <div className="pt-4">
                        <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
                            Changer le mot de passe
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
                <Button variant="outline">Annuler</Button>
                <Button onClick={handleSave}>Enregistrer les modifications</Button>
            </div>
        </div>
    );
};

export default Settings;
