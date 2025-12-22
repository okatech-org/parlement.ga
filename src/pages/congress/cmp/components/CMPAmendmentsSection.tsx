import { useState } from "react";
import { Filter, Search, CheckCircle, XCircle, Clock, Eye, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Amendment {
    id: string;
    ref: string;
    author: string;
    origin: 'AN' | 'SENAT' | 'GOV';
    targetArticle: string;
    summary: string;
    status: 'pending' | 'adopted' | 'rejected';
    date: string;
}

const MOCK_AMENDMENTS: Amendment[] = [
    {
        id: "am-1",
        ref: "CMP-004",
        author: "Commission des Lois (AN)",
        origin: "AN",
        targetArticle: "Art. 1",
        summary: "Précision sur la définition des zones rurales prioritaires.",
        status: "pending",
        date: "22/12/2024"
    },
    {
        id: "am-2",
        ref: "CMP-002",
        author: "Groupe RDPI (Sénat)",
        origin: "SENAT",
        targetArticle: "Art. 4",
        summary: "Suppression de l'alinéa 3 concernant la redevance.",
        status: "adopted",
        date: "21/12/2024"
    },
    {
        id: "am-3",
        ref: "CMP-008",
        author: "Gouvernement",
        origin: "GOV",
        targetArticle: "Art. 12",
        summary: "Mise en conformité avec la directive communautaire.",
        status: "rejected",
        date: "20/12/2024"
    }
];

export const CMPAmendmentsSection = () => {
    const [filterStatus, setFilterStatus] = useState("all");

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Amendements CMP</h2>
                    <p className="text-muted-foreground">Gestion des propositions de modification du texte de compromis.</p>
                </div>
                <Button className="gap-2">
                    <FileText className="h-4 w-4" />
                    Déposer un amendement
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/20 rounded-lg border">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Rechercher un amendement..." className="pl-9 bg-background" />
                </div>
                <Select defaultValue="all" onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px] bg-background">
                        <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="adopted">Adoptés</SelectItem>
                        <SelectItem value="rejected">Rejetés</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">N°</TableHead>
                            <TableHead>Auteur & Origine</TableHead>
                            <TableHead>Article</TableHead>
                            <TableHead>Objet</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {MOCK_AMENDMENTS.map((am) => (
                            <TableRow key={am.id}>
                                <TableCell className="font-medium">{am.ref}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{am.author}</span>
                                        <Badge
                                            variant="outline"
                                            className={`w-fit mt-1 text-[10px] ${am.origin === 'AN' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                                                    am.origin === 'SENAT' ? 'border-orange-200 text-orange-700 bg-orange-50' :
                                                        'border-purple-200 text-purple-700 bg-purple-50'
                                                }`}
                                        >
                                            {am.origin}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell>{am.targetArticle}</TableCell>
                                <TableCell className="max-w-[300px] truncate" title={am.summary}>
                                    {am.summary}
                                </TableCell>
                                <TableCell>
                                    {am.status === 'adopted' && (
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none gap-1">
                                            <CheckCircle className="h-3 w-3" /> Adopté
                                        </Badge>
                                    )}
                                    {am.status === 'rejected' && (
                                        <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none gap-1">
                                            <XCircle className="h-3 w-3" /> Rejeté
                                        </Badge>
                                    )}
                                    {am.status === 'pending' && (
                                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none gap-1">
                                            <Clock className="h-3 w-3" /> En examen
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
