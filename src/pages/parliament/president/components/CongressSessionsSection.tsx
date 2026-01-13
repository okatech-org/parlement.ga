import { useState } from "react";
import {
    Calendar,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Send,
    Clock,
    CheckCircle2,
    AlertCircle,
    Users,
    MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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

interface Session {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    type: "revision_constitutionnelle" | "sermon" | "etat_nation" | "autre";
    status: "draft" | "planifiee" | "convoquee" | "en_cours" | "terminee" | "annulee";
    quorum: number;
    attendees: { deputies: number; senators: number };
}

const SESSION_TYPES = {
    revision_constitutionnelle: { label: "Révision Constitutionnelle", color: "bg-purple-500" },
    sermon: { label: "Prestation de Serment", color: "bg-amber-500" },
    etat_nation: { label: "Discours État de la Nation", color: "bg-blue-500" },
    autre: { label: "Autre", color: "bg-slate-500" },
};

const SESSION_STATUS = {
    draft: { label: "Brouillon", color: "bg-slate-400" },
    planifiee: { label: "Planifiée", color: "bg-blue-400" },
    convoquee: { label: "Convoquée", color: "bg-green-500" },
    en_cours: { label: "En cours", color: "bg-amber-500" },
    terminee: { label: "Terminée", color: "bg-slate-600" },
    annulee: { label: "Annulée", color: "bg-red-500" },
};

export const CongressSessionsSection = () => {
    const [isNewSessionOpen, setIsNewSessionOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    // Mock data
    const [sessions] = useState<Session[]>([
        {
            id: "S-2024-001",
            title: "Révision Constitutionnelle - Art. 24",
            date: "2024-12-20",
            time: "10:00",
            location: "Hémicycle AN - Libreville",
            type: "revision_constitutionnelle",
            status: "convoquee",
            quorum: 75,
            attendees: { deputies: 145, senators: 67 },
        },
        {
            id: "S-2025-001",
            title: "Discours sur l'État de la Nation",
            date: "2025-01-15",
            time: "09:00",
            location: "Hémicycle AN - Libreville",
            type: "etat_nation",
            status: "planifiee",
            quorum: 60,
            attendees: { deputies: 0, senators: 0 },
        },
        {
            id: "S-2024-002",
            title: "Prestation de Serment - Président élu",
            date: "2024-09-01",
            time: "11:00",
            location: "Palais Léon Mba",
            type: "sermon",
            status: "terminee",
            quorum: 100,
            attendees: { deputies: 145, senators: 102 },
        },
    ]);

    const filteredSessions = sessions.filter(session => {
        const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            session.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === "all" || session.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const handleNewSession = () => {
        toast.success("Session créée avec succès");
        setIsNewSessionOpen(false);
    };

    const handleConvoke = (sessionId: string) => {
        toast.success(`Session ${sessionId} convoquée - Notifications envoyées aux parlementaires`);
    };

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Convocations & Sessions</h2>
                    <p className="text-muted-foreground">Gérer les sessions du Congrès du Parlement</p>
                </div>
                <Dialog open={isNewSessionOpen} onOpenChange={setIsNewSessionOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-900 hover:bg-blue-800 gap-2">
                            <Plus className="h-4 w-4" />
                            Nouvelle Convocation
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Nouvelle Convocation de Session</DialogTitle>
                            <DialogDescription>
                                Créer une nouvelle session du Congrès du Parlement
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Objet de la session</Label>
                                <Input id="title" placeholder="Ex: Révision Constitutionnelle - Art. 24" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="type">Type de session</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(SESSION_TYPES).map(([key, value]) => (
                                                <SelectItem key={key} value={key}>{value.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="quorum">Quorum requis (%)</Label>
                                    <Input id="quorum" type="number" defaultValue={60} min={50} max={100} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input id="date" type="date" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="time">Heure</Label>
                                    <Input id="time" type="time" defaultValue="10:00" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="location">Lieu</Label>
                                <Input id="location" placeholder="Hémicycle AN - Libreville" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="notes">Notes / Ordre du jour préliminaire</Label>
                                <Textarea id="notes" placeholder="Points à aborder durant la session..." rows={3} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsNewSessionOpen(false)}>
                                Annuler
                            </Button>
                            <Button onClick={handleNewSession} className="bg-blue-900 hover:bg-blue-800">
                                Créer la session
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher une session..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[180px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filtrer par statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les statuts</SelectItem>
                                {Object.entries(SESSION_STATUS).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>{value.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Sessions Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Référence</TableHead>
                                <TableHead>Session</TableHead>
                                <TableHead>Date & Heure</TableHead>
                                <TableHead>Lieu</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Participants</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSessions.map((session) => (
                                <TableRow key={session.id}>
                                    <TableCell className="font-mono font-medium">{session.id}</TableCell>
                                    <TableCell>
                                        <div className="max-w-[200px]">
                                            <p className="font-medium truncate">{session.title}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span>{new Date(session.date).toLocaleDateString('fr-FR')}</span>
                                            <Clock className="h-3.5 w-3.5 text-muted-foreground ml-2" />
                                            <span>{session.time}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-sm">{session.location}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={SESSION_TYPES[session.type].color}>
                                            {SESSION_TYPES[session.type].label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`${SESSION_STATUS[session.status].color} text-white border-0`}>
                                            {SESSION_STATUS[session.status].label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-sm">
                                            <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span>{session.attendees.deputies + session.attendees.senators}</span>
                                            <span className="text-muted-foreground text-xs">
                                                ({session.attendees.deputies}D / {session.attendees.senators}S)
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {session.status === "planifiee" && (
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700 gap-1"
                                                    onClick={() => handleConvoke(session.id)}
                                                >
                                                    <Send className="h-3.5 w-3.5" />
                                                    Convoquer
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="sm">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Sessions planifiées</p>
                            <p className="text-2xl font-bold">{sessions.filter(s => s.status === 'planifiee').length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Sessions convoquées</p>
                            <p className="text-2xl font-bold">{sessions.filter(s => s.status === 'convoquee').length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-slate-100 text-slate-600">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Sessions terminées</p>
                            <p className="text-2xl font-bold">{sessions.filter(s => s.status === 'terminee').length}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
