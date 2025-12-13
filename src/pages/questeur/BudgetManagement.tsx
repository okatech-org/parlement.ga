
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    Wallet,
    TrendingUp,
    AlertCircle,
    Download,
    Filter,
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    FileText,
    MoreHorizontal
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const BudgetManagement = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const budgetLines = [
        { id: 1, code: "BUD-2024-001", category: "Personnel Parlementaire", allocated: 180000000, spent: 142000000, committed: 15000000, status: "On Track" },
        { id: 2, code: "BUD-2024-002", category: "Équipements Informatiques", allocated: 120000000, spent: 95000000, committed: 20000000, status: "On Track" },
        { id: 3, code: "BUD-2024-003", category: "Maintenance Bâtiments", allocated: 80000000, spent: 78000000, committed: 1000000, status: "Warning" },
        { id: 4, code: "BUD-2024-004", category: "Services Généraux", allocated: 70000000, spent: 45000000, committed: 5000000, status: "On Track" },
        { id: 5, code: "BUD-2024-005", category: "Missions & Déplacements", allocated: 50000000, spent: 12000000, committed: 8000000, status: "On Track" },
    ];

    const transactions = [
        { id: 1, date: "2024-06-15", desc: "Achat Ordinateurs Dell", amount: -12500000, type: "expense", status: "Completed" },
        { id: 2, date: "2024-06-14", desc: "Allocation Trimestrielle", amount: +45000000, type: "income", status: "Completed" },
        { id: 3, date: "2024-06-12", desc: "Maintenance Climatisation", amount: -850000, type: "expense", status: "Pending" },
        { id: 4, date: "2024-06-10", desc: "Fournitures Bureau", amount: -2400000, type: "expense", status: "Completed" },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'On Track': return 'default';
            case 'Warning': return 'secondary';
            case 'Critical': return 'destructive';
            case 'Completed': return 'outline';
            case 'Pending': return 'secondary';
            default: return 'outline';
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header with Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">Gestion Budgétaire</h1>
                    <p className="text-muted-foreground">Suivi détaillé des lignes budgétaires et des transactions.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        Exporter
                    </Button>
                    <Button className="gap-2 bg-amber-600 hover:bg-amber-700 text-white">
                        <Plus className="w-4 h-4" />
                        Nouvelle Allocation
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/20">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                            <Wallet className="w-5 h-5 text-amber-600" />
                        </div>
                        <Badge variant="outline" className="bg-background/50">Annuel</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Budget Total Alloué</p>
                    <h3 className="text-3xl font-bold text-amber-700 dark:text-amber-500">450M FCFA</h3>
                    <div className="mt-4 h-2 bg-amber-200 dark:bg-amber-900/30 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 w-[68%]" />
                    </div>
                    <p className="text-xs text-right mt-1 text-muted-foreground">68% Utilisé</p>
                </Card>

                <Card className="p-6 bg-white dark:bg-card">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                            <ArrowDownRight className="w-5 h-5 text-emerald-600" />
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Dépenses Réalisées</p>
                    <h3 className="text-3xl font-bold text-emerald-700 dark:text-emerald-500">306M FCFA</h3>
                    <p className="text-xs text-emerald-600 mt-2 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" /> +12% vs mois dernier
                    </p>
                </Card>

                <Card className="p-6 bg-white dark:bg-card">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Engagements en Cours</p>
                    <h3 className="text-3xl font-bold text-blue-700 dark:text-blue-500">48M FCFA</h3>
                    <p className="text-xs text-muted-foreground mt-2">
                        12 dossiers en attente de validation
                    </p>
                </Card>
            </div>

            {/* Main Content Tabs/Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Budget Lines Table */}
                <Card className="lg:col-span-2 p-6 border-none shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold font-serif">Lignes Budgétaires</h3>
                        <div className="flex gap-2">
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    placeholder="Rechercher..."
                                    className="pl-9 h-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="icon" className="h-9 w-9">
                                <Filter className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ligne</TableHead>
                                    <TableHead className="text-right">Alloué</TableHead>
                                    <TableHead className="text-right">Dépensé</TableHead>
                                    <TableHead className="text-center">État</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {budgetLines.map((line) => (
                                    <TableRow key={line.id}>
                                        <TableCell>
                                            <div className="font-medium">{line.category}</div>
                                            <div className="text-xs text-muted-foreground">{line.code}</div>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {formatCurrency(line.allocated)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="text-sm">{formatCurrency(line.spent)}</div>
                                            <Progress value={(line.spent / line.allocated) * 100} className="h-1.5 mt-1" />
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={getStatusColor(line.status)} className="text-xs">
                                                {line.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem>Voir détails</DropdownMenuItem>
                                                    <DropdownMenuItem>Historique</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-amber-600">Réallouer</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>

                {/* Recent Transactions */}
                <Card className="p-6 border-none shadow-sm h-fit">
                    <h3 className="text-xl font-bold font-serif mb-6">Transactions Récentes</h3>
                    <div className="space-y-6">
                        {transactions.map((tx) => (
                            <div key={tx.id} className="flex items-start justify-between group">
                                <div className="flex items-start gap-3">
                                    <div className={`p - 2 rounded - full mt - 1 ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'} `}>
                                        {tx.type === 'income' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm group-hover:text-primary transition-colors">{tx.desc}</p>
                                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font - bold text - sm ${tx.type === 'income' ? 'text-emerald-600' : 'text-foreground'} `}>
                                        {tx.type === 'income' ? '+' : ''}{formatCurrency(tx.amount)}
                                    </p>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 dark:bg-muted">
                                        {tx.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button variant="ghost" className="w-full mt-6 text-muted-foreground hover:text-primary">
                        Voir toutes les transactions
                    </Button>
                </Card>
            </div>
        </div>
    );
};

export default BudgetManagement;

