import { useState } from "react";
import {
    Calendar,
    Clock,
    Plus,
    GripVertical,
    Edit2,
    Trash2,
    Save,
    X,
    Gavel,
    FileText,
    Vote,
    Flag
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

interface AgendaItem {
    id: string;
    time: string;
    title: string;
    type: "protocolaire" | "legislatif" | "vote" | "debat" | "autre";
    duration: number; // minutes
    description?: string;
    speaker?: string;
}

const AGENDA_TYPES = {
    protocolaire: { label: "Protocolaire", color: "bg-amber-500", icon: Flag },
    legislatif: { label: "Législatif", color: "bg-blue-500", icon: FileText },
    vote: { label: "Vote", color: "bg-green-500", icon: Vote },
    debat: { label: "Débat", color: "bg-purple-500", icon: Gavel },
    autre: { label: "Autre", color: "bg-slate-500", icon: Calendar },
};

export const CongressAgendaSection = () => {
    const [isAddItemOpen, setIsAddItemOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([
        {
            id: "1",
            time: "09:00",
            title: "Ouverture solennelle de la session",
            type: "protocolaire",
            duration: 30,
            description: "Hymne national, appel nominal, vérification du quorum",
        },
        {
            id: "2",
            time: "09:30",
            title: "Allocution du Président du Congrès",
            type: "protocolaire",
            duration: 20,
            speaker: "Président du Congrès",
        },
        {
            id: "3",
            time: "10:00",
            title: "Débat général : Révision Constitutionnelle Art. 24",
            type: "debat",
            duration: 90,
            description: "Présentation du texte par le rapporteur, interventions des groupes parlementaires",
        },
        {
            id: "4",
            time: "11:30",
            title: "Pause",
            type: "autre",
            duration: 30,
        },
        {
            id: "5",
            time: "12:00",
            title: "Vote article par article",
            type: "vote",
            duration: 60,
            description: "Vote sur chaque article modifié de la Constitution",
        },
        {
            id: "6",
            time: "14:00",
            title: "Vote solennel sur l'ensemble du texte",
            type: "vote",
            duration: 45,
            description: "Majorité des 3/5 requise pour adoption",
        },
        {
            id: "7",
            time: "15:00",
            title: "Clôture de la session",
            type: "protocolaire",
            duration: 15,
        },
    ]);

    const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newItem: AgendaItem = {
            id: Date.now().toString(),
            time: formData.get('time') as string,
            title: formData.get('title') as string,
            type: formData.get('type') as AgendaItem['type'],
            duration: parseInt(formData.get('duration') as string) || 30,
            description: formData.get('description') as string,
            speaker: formData.get('speaker') as string,
        };

        setAgendaItems(prev => [...prev, newItem].sort((a, b) => a.time.localeCompare(b.time)));
        setIsAddItemOpen(false);
        toast.success("Point ajouté à l'ordre du jour");
    };

    const handleDeleteItem = (id: string) => {
        setAgendaItems(prev => prev.filter(item => item.id !== id));
        toast.success("Point supprimé");
    };

    const calculateEndTime = (startTime: string, durationMinutes: number) => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + durationMinutes;
        const endHours = Math.floor(totalMinutes / 60);
        const endMins = totalMinutes % 60;
        return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
    };

    const totalDuration = agendaItems.reduce((acc, item) => acc + item.duration, 0);
    const startTime = agendaItems[0]?.time || "09:00";
    const endTime = calculateEndTime(startTime, totalDuration);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Ordre du Jour du Congrès</h2>
                    <p className="text-muted-foreground">Planifiez et organisez les sessions du Congrès</p>
                </div>
                <div className="flex gap-3">
                    <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-[180px]"
                    />
                    <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-900 hover:bg-blue-800 gap-2">
                                <Plus className="h-4 w-4" />
                                Ajouter un point
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <form onSubmit={handleAddItem}>
                                <DialogHeader>
                                    <DialogTitle>Nouveau point à l'ordre du jour</DialogTitle>
                                    <DialogDescription>
                                        Ajouter un élément à l'ordre du jour de la session
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="title">Intitulé</Label>
                                        <Input id="title" name="title" placeholder="Ex: Vote sur l'article 24" required />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="time">Heure</Label>
                                            <Input id="time" name="time" type="time" defaultValue="10:00" required />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="duration">Durée (min)</Label>
                                            <Input id="duration" name="duration" type="number" defaultValue={30} min={5} step={5} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="type">Type</Label>
                                            <Select name="type" defaultValue="autre">
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(AGENDA_TYPES).map(([key, value]) => (
                                                        <SelectItem key={key} value={key}>{value.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="speaker">Intervenant (optionnel)</Label>
                                        <Input id="speaker" name="speaker" placeholder="Ex: Rapporteur de la commission" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description (optionnel)</Label>
                                        <Textarea id="description" name="description" placeholder="Détails supplémentaires..." rows={2} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsAddItemOpen(false)}>
                                        Annuler
                                    </Button>
                                    <Button type="submit" className="bg-blue-900 hover:bg-blue-800">
                                        Ajouter
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Summary Card */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                                {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                        </div>
                        <Separator orientation="vertical" className="h-6" />
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{startTime} - {endTime}</span>
                        </div>
                        <Separator orientation="vertical" className="h-6" />
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Durée totale:</span>
                            <Badge variant="secondary">{Math.floor(totalDuration / 60)}h {totalDuration % 60}min</Badge>
                        </div>
                        <Separator orientation="vertical" className="h-6" />
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Points:</span>
                            <Badge variant="secondary">{agendaItems.length}</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Legend */}
            <div className="flex flex-wrap gap-3">
                {Object.entries(AGENDA_TYPES).map(([key, value]) => {
                    const Icon = value.icon;
                    return (
                        <Badge key={key} variant="outline" className="gap-1.5 py-1.5">
                            <div className={`w-2 h-2 rounded-full ${value.color}`} />
                            {value.label}
                        </Badge>
                    );
                })}
            </div>

            {/* Timeline */}
            <Card>
                <CardHeader>
                    <CardTitle>Programme de la session</CardTitle>
                    <CardDescription>Glissez-déposez pour réorganiser les points</CardDescription>
                </CardHeader>
                <CardContent className="space-y-0">
                    {agendaItems.map((item, index) => {
                        const TypeIcon = AGENDA_TYPES[item.type].icon;
                        const isLast = index === agendaItems.length - 1;

                        return (
                            <div key={item.id} className="relative flex gap-4 group">
                                {/* Timeline connector */}
                                {!isLast && (
                                    <div className="absolute left-[39px] top-12 bottom-0 w-0.5 bg-border" />
                                )}

                                {/* Time */}
                                <div className="w-20 flex-shrink-0 pt-3">
                                    <div className="text-sm font-mono font-bold text-foreground">
                                        {item.time}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {item.duration} min
                                    </div>
                                </div>

                                {/* Dot */}
                                <div className={`w-3 h-3 rounded-full ${AGENDA_TYPES[item.type].color} mt-4 z-10 ring-4 ring-background`} />

                                {/* Content */}
                                <div className={`flex-1 pb-6 ${!isLast ? 'border-b border-border/50' : ''}`}>
                                    <div className="flex items-start justify-between gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors -ml-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge className={AGENDA_TYPES[item.type].color}>
                                                    <TypeIcon className="h-3 w-3 mr-1" />
                                                    {AGENDA_TYPES[item.type].label}
                                                </Badge>
                                                {item.speaker && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {item.speaker}
                                                    </Badge>
                                                )}
                                            </div>
                                            <h4 className="font-medium text-foreground">{item.title}</h4>
                                            {item.description && (
                                                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                            )}
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Edit2 className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive"
                                                onClick={() => handleDeleteItem(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3">
                <Button variant="outline">
                    Aperçu PDF
                </Button>
                <Button className="bg-blue-900 hover:bg-blue-800 gap-2">
                    <Save className="h-4 w-4" />
                    Enregistrer l'ordre du jour
                </Button>
            </div>
        </div>
    );
};
