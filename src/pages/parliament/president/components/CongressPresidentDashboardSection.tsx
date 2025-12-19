import {
    Calendar,
    Users,
    FileText,
    CheckCircle2,
    ArrowRight,
    Clock,
    Gavel
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

interface CongressPresidentDashboardSectionProps {
    onNavigateToSection?: (section: string) => void;
}

export const CongressPresidentDashboardSection = ({ onNavigateToSection }: CongressPresidentDashboardSectionProps) => {
    const navigate = useNavigate();

    const stats = [
        { title: "Sessions à venir", value: "2", icon: Calendar, color: "text-blue-600", bg: "bg-blue-100" },
        { title: "CMP en cours", value: "3", icon: Users, color: "text-amber-600", bg: "bg-amber-100" },
        { title: "Textes en attente", value: "5", icon: FileText, color: "text-slate-600", bg: "bg-slate-100" },
        { title: "Taux de présence", value: "92%", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
    ];

    const sessions = [
        {
            id: "S-2024-001",
            title: "Révision Constitutionnelle - Art. 24",
            date: "20 Déc 2024",
            status: "Convoquée",
            type: "Congrès",
        },
        {
            id: "S-2025-001",
            title: "Discours sur l'État de la Nation",
            date: "15 Jan 2025",
            status: "Planifiée",
            type: "Congrès",
        },
    ];

    const cmps = [
        {
            id: "CMP-089",
            law: "Projet de Loi de Finances 2025",
            status: "Blocage",
            progress: 45,
            dateInfo: "J-5 avant date butoir",
        },
        {
            id: "CMP-090",
            law: "Loi sur la Cybersécurité",
            status: "En cours",
            progress: 70,
            dateInfo: "J-12",
        },
        {
            id: "CMP-091",
            law: "Code de l'Environnement",
            status: "Accord partiel",
            progress: 90,
            dateInfo: "Finalisation",
        },
    ];

    const agenda = [
        { time: "09:00", event: "Ouverture de la séance", type: "Protocolaire" },
        { time: "10:30", event: "Débat : Réforme Institutionnelle", type: "Législatif" },
        { time: "14:00", event: "Vote solennel", type: "Vote" },
        { time: "16:00", event: "Clôture", type: "Protocolaire" },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <Card key={idx} className="border-none shadow-sm">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upcoming Sessions */}
                <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>Sessions du Congrès</span>
                            <Button
                                variant="link"
                                className="text-blue-900"
                                onClick={() => onNavigateToSection?.('sessions')}
                            >
                                Voir tout <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </CardTitle>
                        <CardDescription>Prochaines convocations et état des préparatifs</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Référence</TableHead>
                                    <TableHead>Objet</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sessions.map((session) => (
                                    <TableRow key={session.id}>
                                        <TableCell className="font-medium">{session.id}</TableCell>
                                        <TableCell>{session.title}</TableCell>
                                        <TableCell>{session.date}</TableCell>
                                        <TableCell>
                                            <Badge variant={session.status === "Convoquée" ? "default" : "outline"} className={session.status === "Convoquée" ? "bg-blue-600" : ""}>
                                                {session.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">Gérer</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Quick Agenda */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader>
                        <CardTitle>Ordre du Jour (Aujourd'hui)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {agenda.map((item, idx) => (
                                <div key={idx} className="flex gap-4 relative">
                                    {idx !== agenda.length - 1 && (
                                        <div className="absolute left-[19px] top-8 bottom-[-24px] w-0.5 bg-slate-200 dark:bg-slate-800"></div>
                                    )}
                                    <div className="bg-blue-50 dark:bg-slate-800 text-blue-900 dark:text-blue-200 text-xs font-bold px-2 py-1 rounded h-fit min-w-[50px] text-center">
                                        {item.time}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{item.event}</p>
                                        <p className="text-xs text-slate-500">{item.type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Active CMPs Grid */}
            <h3 className="text-lg font-bold mt-8 mb-4">Supervision des Commissions Mixtes Paritaires (CMP)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cmps.map((cmp) => (
                    <Card key={cmp.id} className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <Badge variant="outline">{cmp.id}</Badge>
                                <Badge className={cmp.status === "Blocage" ? "bg-red-500" : cmp.status === "Accord partiel" ? "bg-green-600" : "bg-amber-500"}>
                                    {cmp.status}
                                </Badge>
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2 min-h-[48px]">
                                {cmp.law}
                            </h4>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm text-slate-500">
                                    <span>Progression</span>
                                    <span>{cmp.progress}%</span>
                                </div>
                                <Progress value={cmp.progress} className={`h-2 ${cmp.status === 'Blocage' ? 'bg-red-100' : 'bg-slate-100'}`} />
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {cmp.dateInfo}</span>
                                <Button variant="link" className="p-0 h-auto text-xs" onClick={() => navigate(`/parlement/cmp/${cmp.id}`)}>
                                    Superviser
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
