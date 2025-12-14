import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Server,
    Database,
    HardDrive,
    Cpu,
    MemoryStick,
    Wifi,
    RefreshCw,
    Power,
    Download,
    Upload,
    CheckCircle2,
    AlertTriangle,
    Clock,
    Calendar,
    Wrench,
    Zap,
    Loader2
} from "lucide-react";
import { toast } from "sonner";

const INITIAL_SERVICES = [
    { name: "API Gateway", status: "running", uptime: "45j 12h", port: 443, lastRestart: "2024-10-30" },
    { name: "Base de Données (Primary)", status: "running", uptime: "45j 12h", port: 5432, lastRestart: "2024-10-30" },
    { name: "Base de Données (Replica)", status: "running", uptime: "45j 10h", port: 5433, lastRestart: "2024-10-30" },
    { name: "Service Notification", status: "running", uptime: "12j 5h", port: 8080, lastRestart: "2024-12-02" },
    { name: "Service Auth (OAuth)", status: "running", uptime: "45j 12h", port: 8443, lastRestart: "2024-10-30" },
    { name: "Cache Redis", status: "running", uptime: "30j 8h", port: 6379, lastRestart: "2024-11-14" },
];

const INITIAL_BACKUPS = [
    { type: "Full Backup", date: "2024-12-14 02:00", size: "2.4 TB", status: "completed", duration: "45 min" },
    { type: "Incremental", date: "2024-12-14 14:00", size: "128 MB", status: "completed", duration: "2 min" },
    { type: "Incremental", date: "2024-12-14 20:00", size: "256 MB", status: "completed", duration: "3 min" },
];

const SystemMaintenanceSection = () => {
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [services, setServices] = useState(INITIAL_SERVICES);
    const [backups, setBackups] = useState(INITIAL_BACKUPS);
    const [scheduledTasks, setScheduledTasks] = useState([
        { id: 1, name: "Backup Quotidien", schedule: "02:00 UTC", nextRun: "Demain 02:00", status: "scheduled" },
        { id: 2, name: "Nettoyage Logs", schedule: "Dimanche 03:00", nextRun: "Dans 5 jours", status: "scheduled" },
        { id: 3, name: "Renouvellement Certificats", schedule: "2025-01-10", nextRun: "Dans 27 jours", status: "scheduled" },
        { id: 4, name: "Mise à jour Sécurité", schedule: "Manuel", nextRun: "-", status: "manual" },
    ]);

    const [loadingAction, setLoadingAction] = useState<string | null>(null);

    // Task Dialog State
    const [taskDialogOpen, setTaskDialogOpen] = useState(false);
    const [newTask, setNewTask] = useState({ name: "", schedule: "Daily" });

    // Restore Dialog State
    const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
    const [selectedBackup, setSelectedBackup] = useState<string>("");

    const systemResources = [
        { name: "CPU", usage: 12, max: 100, unit: "%", icon: Cpu, status: "optimal" },
        { name: "RAM", usage: 8.2, max: 32, unit: "GB", icon: MemoryStick, status: "optimal" },
        { name: "Stockage Principal", usage: 2.4, max: 10, unit: "TB", icon: HardDrive, status: "normal" },
        { name: "Bande Passante", usage: 45, max: 100, unit: "Mbps", icon: Wifi, status: "optimal" },
    ];

    const getUsageColor = (usage: number, max: number) => {
        const percent = (usage / max) * 100;
        if (percent < 50) return "bg-green-500";
        if (percent < 80) return "bg-amber-500";
        return "bg-red-500";
    };

    const handleToggleMaintenance = async (checked: boolean) => {
        setLoadingAction("maintenance");
        // Simulate critical action delay
        setTimeout(() => {
            setMaintenanceMode(checked);
            setLoadingAction(null);
            toast(checked ? "Mode maintenance ACTIVÉ" : "Mode maintenance DÉSACTIVÉ", {
                description: checked ? "L'accès utilisateur est restreint." : "Système accessible à tous.",
                action: { label: "Annuler", onClick: () => setMaintenanceMode(!checked) },
                className: checked ? "bg-amber-100 border-amber-500 text-amber-900" : ""
            });
        }, 1500);
    };

    const handleRestartService = async (serviceName: string) => {
        setLoadingAction(`restart-${serviceName}`);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setServices(services.map(s =>
                s.name === serviceName ? { ...s, uptime: "0s", lastRestart: new Date().toISOString().split('T')[0] } : s
            ));
            toast.success(`Service ${serviceName} redémarré`);
        } catch (e) {
            toast.error("Échec du redémarrage");
        } finally {
            setLoadingAction(null);
        }
    };

    const handleCreateBackup = async () => {
        setLoadingAction("backup");
        toast.info("Démarrage de la sauvegarde...");

        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            const newBackup = {
                type: "Manuel Backup",
                date: new Date().toISOString().replace('T', ' ').substring(0, 16),
                size: "150 MB",
                status: "completed",
                duration: "Active"
            };
            setBackups([newBackup, ...backups]);
            toast.success("Sauvegarde terminée avec succès");
        } catch (e) {
            toast.error("Erreur sauvegarde");
        } finally {
            setLoadingAction(null);
        }
    };

    const handleCreateTask = async () => {
        if (!newTask.name) return;
        setLoadingAction("create-task");
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setScheduledTasks([...scheduledTasks, {
                id: Date.now(),
                name: newTask.name,
                schedule: newTask.schedule,
                nextRun: "Calcul en cours...",
                status: "scheduled"
            }]);
            setTaskDialogOpen(false);
            setNewTask({ name: "", schedule: "Daily" });
            toast.success("Tâche planifiée avec succès");
        } finally {
            setLoadingAction(null);
        }
    };

    const handleRestoreBackup = async () => {
        if (!selectedBackup) return;
        setLoadingAction("restore");
        try {
            await new Promise(resolve => setTimeout(resolve, 4000)); // Long process
            toast.success("Système restauré à la version: " + selectedBackup);
            setRestoreDialogOpen(false);
        } catch (e) {
            toast.error("Échec de la restauration");
        } finally {
            setLoadingAction(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Maintenance Système</h1>
                    <p className="text-muted-foreground">Infrastructure, services et sauvegardes</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        {loadingAction === "maintenance" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                        <span className="text-sm text-muted-foreground">Mode Maintenance</span>
                        <Switch
                            checked={maintenanceMode}
                            onCheckedChange={handleToggleMaintenance}
                            disabled={loadingAction === "maintenance"}
                            className={maintenanceMode ? "bg-amber-500" : ""}
                        />
                    </div>
                    {maintenanceMode && (
                        <Badge className="bg-amber-500 animate-pulse">
                            <Wrench className="h-3 w-3 mr-1" />
                            MAINTENANCE ACTIVE
                        </Badge>
                    )}
                </div>
            </div>

            {/* Resource Usage */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {systemResources.map((resource, idx) => {
                    const Icon = resource.icon;
                    const percent = (resource.usage / resource.max) * 100;
                    return (
                        <Card key={idx} className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Icon className="h-5 w-5 text-muted-foreground" />
                                    <span className="font-medium">{resource.name}</span>
                                </div>
                                <Badge variant="outline" className={
                                    resource.status === 'optimal' ? 'bg-green-50 text-green-600 border-green-200' :
                                        'bg-amber-50 text-amber-600 border-amber-200'
                                }>
                                    {resource.status}
                                </Badge>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-end justify-between">
                                    <span className="text-2xl font-bold">{resource.usage}</span>
                                    <span className="text-sm text-muted-foreground">/ {resource.max} {resource.unit}</span>
                                </div>
                                <Progress value={percent} className={`h-2 ${getUsageColor(resource.usage, resource.max)}`} />
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Services Status */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Server className="h-5 w-5 text-blue-500" />
                        Services Système
                    </h3>
                    <Button variant="outline" size="sm" onClick={() => toast.info("Vérification en cours...")}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Vérifier l'état
                    </Button>
                </div>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${loadingAction === `restart-${service.name}` ? 'bg-amber-500 animate-ping' : 'bg-green-500 animate-pulse'}`}></div>
                                <div>
                                    <p className="font-medium text-sm">{service.name}</p>
                                    <p className="text-xs text-muted-foreground">Port {service.port} • Uptime: {service.uptime}</p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleRestartService(service.name)}
                                    disabled={loadingAction === `restart-${service.name}`}
                                >
                                    <RefreshCw className={`h-3 w-3 ${loadingAction === `restart-${service.name}` ? 'animate-spin' : ''}`} />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => toast.warning("Arrêt de service non autorisé en production")}>
                                    <Power className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Backups */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Database className="h-5 w-5 text-purple-500" />
                            Sauvegardes Récentes
                        </h3>
                        <Button
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700"
                            onClick={handleCreateBackup}
                            disabled={loadingAction === "backup"}
                        >
                            {loadingAction === "backup" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                            Backup Manuel
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {backups.map((backup, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    <div>
                                        <p className="font-medium text-sm">{backup.type}</p>
                                        <p className="text-xs text-muted-foreground">{backup.date} • {backup.size}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">{backup.duration}</span>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Download className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Scheduled Tasks */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-500" />
                            Tâches Planifiées
                        </h3>
                        <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Zap className="h-4 w-4 mr-2" />
                                    Nouvelle Tâche
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Planifier une Tâche</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Nom de la Tâche</Label>
                                        <Input value={newTask.name} onChange={(e) => setNewTask({ ...newTask, name: e.target.value })} placeholder="Ex: Nettoyage Cache" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Fréquence</Label>
                                        <Select value={newTask.schedule} onValueChange={(val) => setNewTask({ ...newTask, schedule: val })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Daily">Quotidien</SelectItem>
                                                <SelectItem value="Weekly">Hebdomadaire</SelectItem>
                                                <SelectItem value="Monthly">Mensuel</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <Button variant="outline" onClick={() => setTaskDialogOpen(false)}>Annuler</Button>
                                        <Button onClick={handleCreateTask} disabled={!!loadingAction}>
                                            {loadingAction === "create-task" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Planifier
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="space-y-3">
                        {scheduledTasks.map((task, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-blue-500" />
                                    <div>
                                        <p className="font-medium text-sm">{task.name}</p>
                                        <p className="text-xs text-muted-foreground">{task.schedule}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge variant="outline" className={
                                        task.status === 'scheduled' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'
                                    }>
                                        {task.status === 'scheduled' ? 'Planifiée' : 'Manuel'}
                                    </Badge>
                                    <p className="text-xs text-muted-foreground mt-1">{task.nextRun}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6 bg-slate-900 text-white border-slate-800">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-amber-500" />
                    Actions Rapides (Zone Critique)
                </h3>
                <div className="grid gap-3 md:grid-cols-4">
                    <Button variant="outline" className="border-slate-700 hover:bg-slate-800 text-white" onClick={() => toast.info("Redémarrage de tous les services...")}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Restart All
                    </Button>
                    <Button variant="outline" className="border-slate-700 hover:bg-slate-800 text-white" onClick={() => toast.success("Cache système vidé")}>
                        <Database className="h-4 w-4 mr-2" />
                        Flush Redis
                    </Button>

                    <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="border-slate-700 hover:bg-slate-800 text-white">
                                <Upload className="h-4 w-4 mr-2" />
                                Restaurer
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Restaurer une Sauvegarde</DialogTitle>
                                <DialogDescription className="text-red-500">
                                    Attention: Cette action écrasera toutes les données actuelles.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <Label className="mb-2 block">Sélectionner un point de restauration</Label>
                                <Select onValueChange={setSelectedBackup}>
                                    <SelectTrigger><SelectValue placeholder="Choisir un backup..." /></SelectTrigger>
                                    <SelectContent>
                                        {backups.map((b, i) => (
                                            <SelectItem key={i} value={b.date}>{b.type} - {b.date}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setRestoreDialogOpen(false)}>Annuler</Button>
                                <Button variant="destructive" onClick={handleRestoreBackup} disabled={!selectedBackup || !!loadingAction}>
                                    {loadingAction === "restore" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Restaurer
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button variant="outline" className="border-red-500/50 hover:bg-red-900/50 text-red-400" onClick={() => { if (window.confirm("CECI EST UN ARRÊT D'URGENCE. CONFIRMER ?")) toast.error("SIGNAL D'ARRÊT ENVOYÉ À L'INFRASTRUCTURE"); }}>
                        <Power className="h-4 w-4 mr-2" />
                        Arrêt d'Urgence
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default SystemMaintenanceSection;
