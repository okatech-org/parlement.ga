import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Bell,
    Moon,
    Sun,
    Globe,
    Shield,
    Smartphone
} from "lucide-react";
import { useTheme } from "next-themes";

const Settings = () => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    Paramètres
                </h1>
                <p className="text-muted-foreground mt-1">
                    Personnalisez votre expérience.
                </p>
            </div>

            <div className="space-y-6">
                {/* Apparence */}
                <div className="neu-raised p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-full neu-inset text-purple-500">
                            <Sun className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-bold">Apparence</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/30 transition-colors">
                            <div className="space-y-0.5">
                                <Label className="text-base">Thème Sombre</Label>
                                <p className="text-sm text-muted-foreground">
                                    Activer le mode sombre pour réduire la fatigue oculaire.
                                </p>
                            </div>
                            <Switch
                                checked={theme === 'dark'}
                                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                            />
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="neu-raised p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-full neu-inset text-blue-500">
                            <Bell className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-bold">Notifications</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/30 transition-colors">
                            <div className="space-y-0.5">
                                <Label className="text-base">Notifications Push</Label>
                                <p className="text-sm text-muted-foreground">
                                    Recevoir des alertes pour les nouvelles activités.
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/30 transition-colors">
                            <div className="space-y-0.5">
                                <Label className="text-base">Emails</Label>
                                <p className="text-sm text-muted-foreground">
                                    Recevoir un résumé hebdomadaire par email.
                                </p>
                            </div>
                            <Switch />
                        </div>
                    </div>
                </div>

                {/* Langue et Région */}
                <div className="neu-raised p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-full neu-inset text-green-500">
                            <Globe className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-bold">Langue et Région</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/30 transition-colors">
                            <div className="space-y-0.5">
                                <Label className="text-base">Langue</Label>
                                <p className="text-sm text-muted-foreground">
                                    Français (Gabon)
                                </p>
                            </div>
                            <Button variant="outline" className="neu-inset border-none">Modifier</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
