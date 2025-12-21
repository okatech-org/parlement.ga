import {
    Bell, Check, Trash2, Calendar, FileText, Heart,
    Settings, MessageSquare, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const CitizenNotifications = () => {
    const notifications = [
        {
            id: 1,
            title: "Nouveau texte déposé à l'Assemblée Nationale",
            message: "Le projet de loi sur le numérique a été déposé et renvoyé à la Commission des Affaires Économiques.",
            type: "legislation",
            time: "Il y a 2 heures",
            read: false,
            icon: FileText,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10"
        },
        {
            id: 2,
            title: "Rappel : Séance publique demain",
            message: "La séance de Questions au Gouvernement débutera demain à 15h00 au Sénat.",
            type: "agenda",
            time: "Hier à 18:30",
            read: false,
            icon: Calendar,
            color: "text-green-500",
            bgColor: "bg-green-500/10"
        },
        {
            id: 3,
            title: "Objectif atteint pour la pétition que vous suivez",
            message: "La pétition 'Zones rurales connectées' a atteint 10 000 signatures !",
            type: "petition",
            time: "Hier à 10:15",
            read: true,
            icon: Heart,
            color: "text-pink-500",
            bgColor: "bg-pink-500/10"
        },
        {
            id: 4,
            title: "Réponse de votre Député",
            message: "L'Honorable Jean-Baptiste MOUSSAVOU a répondu à votre question écrite.",
            type: "message",
            time: "20 Déc 2024",
            read: true,
            icon: MessageSquare,
            color: "text-indigo-500",
            bgColor: "bg-indigo-500/10"
        },
        {
            id: 5,
            title: "Maintenance de la plateforme",
            message: "Une maintenance programmée aura lieu cette nuit de 02h00 à 04h00.",
            type: "system",
            time: "19 Déc 2024",
            read: true,
            icon: Info,
            color: "text-gray-500",
            bgColor: "bg-gray-500/10"
        }
    ];

    return (
        <div className="space-y-6 container mx-auto max-w-4xl pb-10">
            {/* Header */}
            <div className="flex items-center justify-between py-6">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Bell className="w-6 h-6 text-orange-500" />
                        Notifications
                    </h1>
                    <p className="text-muted-foreground">Restez informé de l'actualité parlementaire qui vous intéresse.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Check className="w-4 h-4 mr-2" />
                        Tout marquer comme lu
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Notifications List */}
                <div className="lg:col-span-2 space-y-4">
                    {notifications.map((notification) => (
                        <Card key={notification.id} className={`transition-all hover:shadow-md cursor-pointer ${!notification.read ? 'border-l-4 border-l-orange-500 bg-orange-50/10' : ''}`}>
                            <CardContent className="p-4 flex gap-4">
                                <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notification.bgColor}`}>
                                    <notification.icon className={`w-5 h-5 ${notification.color}`} />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`font-semibold text-sm ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>{notification.title}</h3>
                                        {!notification.read && <Badge variant="default" className="bg-orange-500 hover:bg-orange-600 h-2 w-2 p-0 rounded-full" />}
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-muted-foreground/70 pt-2">
                                        {notification.time}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <div className="text-center pt-4">
                        <Button variant="ghost" className="text-muted-foreground">
                            Charger les notifications plus anciennes
                        </Button>
                    </div>
                </div>

                {/* Preferences Panel */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Settings className="w-5 h-5" />
                                Préférences
                            </CardTitle>
                            <CardDescription>Gérez vos alertes email et push</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">Canaux</h4>
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">Notifications Email</label>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">Notifications Push</label>
                                    <Switch defaultChecked />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-border/50">
                                <h4 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">Sujets</h4>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <label className="text-sm font-medium">Lois & Textes</label>
                                        <p className="text-xs text-muted-foreground">Textes que vous suivez</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <label className="text-sm font-medium">Agenda</label>
                                        <p className="text-xs text-muted-foreground">Rappels de séances</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <label className="text-sm font-medium">Mes Élus</label>
                                        <p className="text-xs text-muted-foreground">Activités de vos députés</p>
                                    </div>
                                    <Switch />
                                </div>
                            </div>

                            <Button className="w-full" variant="outline">
                                Enregistrer mes préférences
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CitizenNotifications;
