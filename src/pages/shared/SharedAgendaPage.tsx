/**
 * Page Agenda Partagée
 * 
 * Calendrier et gestion des événements parlementaires
 * avec différents types : séances, commissions, audiences, cérémonies.
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import {
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    Users,
    Plus,
    Video,
    FileText,
    Gavel,
    Building2,
    UserCheck,
    PartyPopper
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { fr } from 'date-fns/locale';

// Types d'événements parlementaires
type EventType = 'seance_pleniere' | 'commission' | 'audience' | 'ceremonie' | 'reunion' | 'visite';

interface ParliamentaryEvent {
    id: string;
    title: string;
    time: string;
    endTime?: string;
    location: string;
    type: EventType;
    attendees?: string[];
    description?: string;
    isVideo?: boolean;
}

// Mock data par date
const MOCK_EVENTS: Record<string, ParliamentaryEvent[]> = {
    '2025-12-21': [
        { id: '1', title: 'Séance Plénière - Vote Budget 2026', time: '10:00', endTime: '13:00', location: 'Hémicycle', type: 'seance_pleniere', attendees: ['Députés', 'Ministres'] },
        { id: '2', title: 'Commission des Finances', time: '15:00', location: 'Salle 102', type: 'commission', attendees: ['Membres commission'] },
    ],
    '2025-12-22': [
        { id: '3', title: 'Audience - Délégation Syndicale', time: '09:30', location: 'Bureau Présidence', type: 'audience' },
        { id: '4', title: 'Réunion Bureau AN', time: '14:00', location: 'Salle du Bureau', type: 'reunion', attendees: ['Questeurs', 'VP'] },
        { id: '5', title: 'Vidéoconférence CEDEAO', time: '16:00', location: 'Visio', type: 'reunion', isVideo: true },
    ],
    '2025-12-23': [
        { id: '6', title: 'Commission des Lois', time: '10:00', location: 'Salle 201', type: 'commission' },
        { id: '7', title: 'Cérémonie de clôture session', time: '17:00', location: 'Hémicycle', type: 'ceremonie', attendees: ['Tous parlementaires'] },
    ],
    '2025-12-24': [
        { id: '8', title: 'Visite terrain - Projet infrastructures', time: '08:00', location: 'Région Nord', type: 'visite' },
    ]
};

const typeConfig: Record<EventType, { label: string; icon: typeof CalendarIcon; color: string }> = {
    'seance_pleniere': { label: 'Séance Plénière', icon: Gavel, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    'commission': { label: 'Commission', icon: Users, color: 'bg-green-500/10 text-green-500 border-green-500/20' },
    'audience': { label: 'Audience', icon: UserCheck, color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
    'ceremonie': { label: 'Cérémonie', icon: PartyPopper, color: 'bg-pink-500/10 text-pink-500 border-pink-500/20' },
    'reunion': { label: 'Réunion', icon: Building2, color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
    'visite': { label: 'Visite terrain', icon: MapPin, color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' }
};

export default function SharedAgendaPage() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [isNewEventOpen, setIsNewEventOpen] = useState(false);

    // Obtenir les événements du jour sélectionné
    const dateKey = selectedDate?.toISOString().split('T')[0] || '';
    const dayEvents = MOCK_EVENTS[dateKey] || [];

    // Dates avec événements (pour marquer le calendrier)
    const eventDates = Object.keys(MOCK_EVENTS);

    // Statistiques
    const stats = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const todayEvents = MOCK_EVENTS[today] || [];

        const weekEvents = Object.entries(MOCK_EVENTS)
            .filter(([date]) => {
                const d = new Date(date);
                const now = new Date();
                const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                return d >= now && d <= weekLater;
            })
            .reduce((acc, [_, events]) => acc + events.length, 0);

        return {
            today: todayEvents.length,
            week: weekEvents,
            commissions: Object.values(MOCK_EVENTS).flat().filter(e => e.type === 'commission').length
        };
    }, []);

    return (
        <div className="space-y-6 p-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Agenda Parlementaire
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Séances, commissions, audiences et événements
                    </p>
                </div>
                <Button className="gap-2" onClick={() => setIsNewEventOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Nouveau RDV
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="neu-card border-none">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-primary/10">
                                <CalendarIcon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.today}</p>
                                <p className="text-sm text-muted-foreground">Aujourd'hui</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="neu-card border-none">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-blue-500/10">
                                <Clock className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.week}</p>
                                <p className="text-sm text-muted-foreground">Cette semaine</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="neu-card border-none">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-green-500/10">
                                <Users className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.commissions}</p>
                                <p className="text-sm text-muted-foreground">Commissions</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <Card className="neu-card border-none">
                    <CardHeader>
                        <CardTitle className="text-lg">Calendrier</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            locale={fr}
                            className="rounded-md"
                            modifiers={{
                                hasEvents: (date) => eventDates.includes(date.toISOString().split('T')[0])
                            }}
                            modifiersStyles={{
                                hasEvents: { fontWeight: 'bold', textDecoration: 'underline' }
                            }}
                        />
                    </CardContent>
                </Card>

                {/* Day View */}
                <Card className="neu-card border-none lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5 text-primary" />
                            {selectedDate?.toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px] pr-4">
                            {dayEvents.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                    <CalendarIcon className="h-12 w-12 text-muted-foreground/30 mb-4" />
                                    <p className="text-muted-foreground">Aucun événement prévu</p>
                                    <Button variant="link" className="mt-2" onClick={() => setIsNewEventOpen(true)}>
                                        Ajouter un événement
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {dayEvents.map((event) => {
                                        const config = typeConfig[event.type];
                                        const IconComponent = config.icon;

                                        return (
                                            <div
                                                key={event.id}
                                                className="p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors cursor-pointer"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Badge variant="outline" className={config.color}>
                                                                <IconComponent className="h-3 w-3 mr-1" />
                                                                {config.label}
                                                            </Badge>
                                                            <span className="text-sm font-medium text-primary">
                                                                {event.time}
                                                                {event.endTime && ` - ${event.endTime}`}
                                                            </span>
                                                        </div>
                                                        <h3 className="font-semibold">{event.title}</h3>
                                                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <MapPin className="h-3 w-3" />
                                                                {event.location}
                                                            </span>
                                                            {event.attendees && (
                                                                <span className="flex items-center gap-1">
                                                                    <Users className="h-3 w-3" />
                                                                    {event.attendees.join(', ')}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {event.isVideo && (
                                                            <Button size="sm" variant="outline" className="gap-1">
                                                                <Video className="h-3 w-3" />
                                                                Rejoindre
                                                            </Button>
                                                        )}
                                                        <Button size="sm" variant="ghost">
                                                            <FileText className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            {/* New Event Dialog */}
            <Dialog open={isNewEventOpen} onOpenChange={setIsNewEventOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Nouvel événement</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Titre</Label>
                            <Input placeholder="Titre de l'événement..." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(typeConfig).map(([key, config]) => (
                                            <SelectItem key={key} value={key}>{config.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Lieu</Label>
                                <Input placeholder="Lieu..." />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Heure début</Label>
                                <Input type="time" />
                            </div>
                            <div className="space-y-2">
                                <Label>Heure fin</Label>
                                <Input type="time" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea placeholder="Description optionnelle..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsNewEventOpen(false)}>Annuler</Button>
                        <Button onClick={() => { toast.success('Événement créé'); setIsNewEventOpen(false); }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Créer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
