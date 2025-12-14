import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Users,
    UserPlus,
    Search,
    MoreVertical,
    Shield,
    Building2,
    Landmark,
    Scale,
    Trash2,
    Edit,
    Lock,
    Unlock,
    CheckCircle2,
    XCircle,
    Loader2
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

// Initial Mock Data
const INITIAL_ADMINS = [
    { id: 1, name: "Super Admin", email: "super@parlement.ga", roles: ["system_admin"], status: "active", institution: "Système", environment: "system" },
    { id: 2, name: "Admin AN", email: "admin.an@parlement.ga", roles: ["admin_an"], status: "active", institution: "Assemblée", environment: "an" },
    { id: 3, name: "Admin Sénat", email: "admin.senat@parlement.ga", roles: ["admin_senat"], status: "active", institution: "Sénat", environment: "senat" },
    { id: 4, name: "Admin Parlement", email: "admin.parlement@parlement.ga", roles: ["admin_parlement"], status: "active", institution: "Congrès", environment: "congres" },
];

const INITIAL_OFFICIALS = [
    { id: 1, name: "Michel Régis Onanga Ndiaye", roles: ["president", "deputy"], institution: "AN", status: "active", phone: "01010101", environment: "an", province: "Estuaire" },
    { id: 2, name: "François Ndong Obiang", roles: ["vp", "deputy"], institution: "AN", status: "active", phone: "02020202", environment: "an", province: "Estuaire" },
    { id: 3, name: "Jean-Baptiste Bikalou", roles: ["deputy", "questeur"], institution: "AN", status: "active", phone: "06060606", environment: "an", province: "Haut-Ogooué" },
    { id: 4, name: "Marie Thérèse Bekale", roles: ["senator"], institution: "Sénat", status: "active", phone: "07070707", environment: "senat", province: "Woleu-Ntem" },
    { id: 5, name: "Paul Mba Abessole", roles: ["deputy"], institution: "AN", status: "suspended", phone: "08080808", environment: "an", province: "Ogooué-Maritime" },
    { id: 6, name: "Claire Nyingone", roles: ["senator"], institution: "Sénat", status: "active", phone: "09090909", environment: "senat", province: "Ngounié" },
    { id: 7, name: "Pierre Essono", roles: ["deputy"], institution: "AN", status: "active", phone: "10101010", environment: "an", province: "Moyen-Ogooué" },
    { id: 8, name: "Jeanne Mintsa", roles: ["senator"], institution: "Sénat", status: "active", phone: "11111111", environment: "senat", province: "Nyanga" },
];

const INITIAL_CITIZENS = [
    { id: 1, name: "Jean Dupont", phone: "+241 74 00 00 01", email: "jean@gmail.com", status: "verified", registeredAt: "2024-01-15", province: "Estuaire" },
    { id: 2, name: "Marie Claire", phone: "+241 74 00 00 02", email: "marie@gmail.com", status: "verified", registeredAt: "2024-02-20", province: "Haut-Ogooué" },
    { id: 3, name: "Pierre Moussavou", phone: "+241 74 00 00 03", email: "pierre@yahoo.fr", status: "pending", registeredAt: "2024-03-10", province: "Woleu-Ntem" },
    { id: 4, name: "Anne Ondo", phone: "+241 74 00 00 04", email: "anne@outlook.com", status: "suspended", registeredAt: "2024-03-25", province: "Ogooué-Maritime" },
];

const UserManagementSection = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [environmentFilter, setEnvironmentFilter] = useState("all");
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    // Data State
    const [admins, setAdmins] = useState(INITIAL_ADMINS);
    const [officials, setOfficials] = useState(INITIAL_OFFICIALS);
    const [citizens, setCitizens] = useState(INITIAL_CITIZENS);

    // Form State for Create/Edit
    const [editingUser, setEditingUser] = useState<any>(null);
    const [formData, setFormData] = useState<{
        type: string;
        name: string;
        email: string;
        phone: string;
        roles: string[];
        institution: string;
        province: string;
    }>({
        type: "official",
        name: "",
        email: "",
        phone: "",
        roles: ["deputy"],
        institution: "an",
        province: "Estuaire",
    });

    const [loading, setLoading] = useState(false);

    // Filter Logic
    const filteredOfficials = environmentFilter === "all"
        ? officials
        : officials.filter(o => o.environment === environmentFilter);

    // Generic Action Handler Pattern
    const handleAction = async (actionName: string, actionFn: () => Promise<void>) => {
        setLoading(true);
        try {
            await actionFn();
            toast.success(`${actionName} effectuée avec succès`);
        } catch (error) {
            console.error(error);
            toast.error(`Erreur lors de: ${actionName}`);
        } finally {
            setLoading(false);
        }
    };

    const openCreateDialog = () => {
        setEditingUser(null);
        setFormData({
            type: "official",
            name: "",
            email: "",
            phone: "",
            roles: ["deputy"],
            institution: "an",
            province: "Estuaire",
        });
        setCreateDialogOpen(true);
    };

    const openEditDialog = (user: any, type: string) => {
        setEditingUser({ ...user, type });
        setFormData({
            type: type,
            name: user.name,
            email: user.email || "",
            phone: user.phone || "",
            roles: user.roles || (user.role ? [user.role] : []),
            institution: user.institution === "AN" ? "an" : (user.institution === "Sénat" ? "senat" : "an"),
            province: user.province || "Estuaire",
        });
        setCreateDialogOpen(true);
    };

    const handleSaveUser = async () => {
        if (!formData.name || !formData.phone) {
            toast.error("Veuillez remplir les champs obligatoires (Nom, Téléphone)");
            return;
        }

        const actionName = editingUser ? "Modification utilisateur" : "Création utilisateur";

        await handleAction(actionName, async () => {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API

            const userData = {
                id: editingUser ? editingUser.id : Date.now(),
                name: formData.name,
                roles: formData.roles,
                institution: formData.institution === "an" ? "AN" : "Sénat",
                status: editingUser ? editingUser.status : "active",
                phone: formData.phone,
                environment: formData.institution,
                province: formData.province,
                email: formData.email
            };

            const updateList = (list: any[]) => {
                return editingUser
                    ? list.map(u => u.id === userData.id ? { ...u, ...userData } : u)
                    : [...list, userData];
            };

            if (formData.type === "official") {
                setOfficials(updateList(officials) as any);
            } else if (formData.type === "citizen") {
                const citizenData = { ...userData, status: editingUser ? editingUser.status : "pending", registeredAt: editingUser ? editingUser.registeredAt : new Date().toISOString().split('T')[0] };
                setCitizens(editingUser ? citizens.map(c => c.id === userData.id ? citizenData : c) as any : [...citizens, citizenData] as any);
            } else {
                const adminData = { ...userData, roles: formData.roles.length > 0 ? formData.roles : ["admin_" + formData.institution], environment: formData.institution };
                setAdmins(editingUser ? admins.map(a => a.id === userData.id ? adminData : a) as any : [...admins, adminData] as any);
            }

            setCreateDialogOpen(false);
        });
    };

    const handleDelete = async (type: "admin" | "official" | "citizen", id: number) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;

        await handleAction("Suppression utilisateur", async () => {
            await new Promise(resolve => setTimeout(resolve, 800));
            if (type === "admin") setAdmins(admins.filter(u => u.id !== id));
            else if (type === "official") setOfficials(officials.filter(u => u.id !== id));
            else setCitizens(citizens.filter(u => u.id !== id));
        });
    };

    const handleToggleStatus = async (type: "admin" | "official" | "citizen", id: number, currentStatus: string) => {
        const newStatus = currentStatus === "active" || currentStatus === "verified" ? "suspended" : "active";

        await handleAction(`Changement statut (${newStatus})`, async () => {
            await new Promise(resolve => setTimeout(resolve, 500));

            const updateList = (list: any[]) => list.map(u => u.id === id ? { ...u, status: newStatus === "active" && type === "citizen" ? "verified" : newStatus } : u);

            if (type === "admin") setAdmins(updateList(admins));
            else if (type === "official") setOfficials(updateList(officials));
            else setCitizens(updateList(citizens));
        });
    };

    const getRoleBadge = (roles: string[] | string) => {
        const rolesArray = Array.isArray(roles) ? roles : [roles];
        const config: Record<string, { label: string; className: string }> = {
            system_admin: { label: "Super Admin", className: "bg-red-100 text-red-700 border-red-200" },
            admin_an: { label: "Admin AN", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
            admin_senat: { label: "Admin Sénat", className: "bg-amber-100 text-amber-700 border-amber-200" },
            admin_parlement: { label: "Admin Congrès", className: "bg-blue-100 text-blue-700 border-blue-200" },
            president: { label: "Président", className: "bg-purple-100 text-purple-700 border-purple-200" },
            vp: { label: "Vice-Président", className: "bg-indigo-100 text-indigo-700 border-indigo-200" },
            deputy: { label: "Député", className: "bg-green-100 text-green-700 border-green-200" },
            senator: { label: "Sénateur", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
            questeur: { label: "Questeur", className: "bg-orange-100 text-orange-700 border-orange-200" },
            commission_president: { label: "Président Comm.", className: "bg-teal-100 text-teal-700 border-teal-200" },
        };

        return (
            <div className="flex flex-wrap gap-1">
                {rolesArray.map(role => {
                    const c = config[role] || { label: role, className: "bg-gray-100 text-gray-700" };
                    return <Badge key={role} variant="outline" className={c.className}>{c.label}</Badge>;
                })}
            </div>
        );
    };

    const getStatusBadge = (status: string) => {
        if (status === 'active' || status === 'verified') {
            return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200"><CheckCircle2 className="h-3 w-3 mr-1" />Actif</Badge>;
        } else if (status === 'suspended') {
            return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200"><XCircle className="h-3 w-3 mr-1" />Suspendu</Badge>;
        } else {
            return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">En attente</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestion des Utilisateurs</h1>
                    <p className="text-muted-foreground">Création, modification et supervision des comptes</p>
                </div>
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={openCreateDialog}>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Nouveau Compte
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{editingUser ? "Modifier Utilisateur" : "Créer un Nouveau Compte"}</DialogTitle>
                            <DialogDescription>
                                {editingUser ? "Modifiez les informations ci-dessous." : "Remplissez les informations pour créer un compte utilisateur."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Type de Compte</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(val) => {
                                        const defaultRoles = val === 'official' ? ['deputy'] : (val === 'admin' ? [] : []);
                                        setFormData({ ...formData, type: val, roles: defaultRoles });
                                    }}
                                    disabled={!!editingUser}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner le type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Administrateur</SelectItem>
                                        <SelectItem value="official">Élu / Officiel</SelectItem>
                                        <SelectItem value="citizen">Citoyen</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Nom Complet *</Label>
                                <Input
                                    placeholder="Prénom et Nom"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    placeholder="email@domain.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Téléphone *</Label>
                                <Input
                                    placeholder="+241 XX XX XX XX"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            {formData.type === "official" && (
                                <>
                                    <div className="grid gap-2">
                                        <Label>Institution</Label>
                                        <Select
                                            value={formData.institution}
                                            onValueChange={(val) => setFormData({ ...formData, institution: val })}
                                        >
                                            <SelectTrigger><SelectValue placeholder="Institution" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="an">Assemblée Nationale</SelectItem>
                                                <SelectItem value="senat">Sénat</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Rôles (Multi-sélection possible)</Label>
                                        <div className="flex flex-wrap gap-4 p-3 border rounded-md">
                                            {formData.institution === 'an' && (
                                                <>
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox id="r_deputy"
                                                            checked={formData.roles.includes('deputy')}
                                                            onCheckedChange={(c) => {
                                                                const roles = c ? [...formData.roles, 'deputy'] : formData.roles.filter(r => r !== 'deputy');
                                                                setFormData({ ...formData, roles });
                                                            }}
                                                        />
                                                        <label htmlFor="r_deputy" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Député</label>
                                                    </div>
                                                </>
                                            )}
                                            {formData.institution === 'senat' && (
                                                <>
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox id="r_senator"
                                                            checked={formData.roles.includes('senator')}
                                                            onCheckedChange={(c) => {
                                                                const roles = c ? [...formData.roles, 'senator'] : formData.roles.filter(r => r !== 'senator');
                                                                setFormData({ ...formData, roles });
                                                            }}
                                                        />
                                                        <label htmlFor="r_senator" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Sénateur</label>
                                                    </div>
                                                </>
                                            )}
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="r_questeur"
                                                    checked={formData.roles.includes('questeur')}
                                                    onCheckedChange={(c) => {
                                                        const roles = c ? [...formData.roles, 'questeur'] : formData.roles.filter(r => r !== 'questeur');
                                                        setFormData({ ...formData, roles });
                                                    }}
                                                />
                                                <label htmlFor="r_questeur" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Questeur</label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="r_president"
                                                    checked={formData.roles.includes('president')}
                                                    onCheckedChange={(c) => {
                                                        const roles = c ? [...formData.roles, 'president'] : formData.roles.filter(r => r !== 'president');
                                                        setFormData({ ...formData, roles });
                                                    }}
                                                />
                                                <label htmlFor="r_president" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Président</label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="r_comm"
                                                    checked={formData.roles.includes('commission_president')}
                                                    onCheckedChange={(c) => {
                                                        const roles = c ? [...formData.roles, 'commission_president'] : formData.roles.filter(r => r !== 'commission_president');
                                                        setFormData({ ...formData, roles });
                                                    }}
                                                />
                                                <label htmlFor="r_comm" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Prés. Commission</label>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setCreateDialogOpen(false)} disabled={loading}>
                                Annuler
                            </Button>
                            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleSaveUser} disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingUser ? "Enregistrer Modifications" : "Créer le Compte"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        className="pl-9"
                        placeholder="Rechercher un utilisateur..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={environmentFilter} onValueChange={setEnvironmentFilter}>
                    <SelectTrigger className="w-[200px]">
                        <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Filtrer par environnement" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous environnements</SelectItem>
                        <SelectItem value="an">Assemblée Nationale</SelectItem>
                        <SelectItem value="senat">Sénat</SelectItem>
                        <SelectItem value="congres">Congrès</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Tabs defaultValue="admins" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-md">
                    <TabsTrigger value="admins" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Admins
                    </TabsTrigger>
                    <TabsTrigger value="officials" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Élus ({filteredOfficials.length})
                    </TabsTrigger>
                    <TabsTrigger value="citizens" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Citoyens
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="admins" className="mt-6">
                    <Card className="overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-900">
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 font-medium text-sm">Administrateur</th>
                                    <th className="text-left py-3 px-4 font-medium text-sm">Rôle</th>
                                    <th className="text-left py-3 px-4 font-medium text-sm">Institution</th>
                                    <th className="text-left py-3 px-4 font-medium text-sm">Statut</th>
                                    <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase())).map((admin) => (
                                    <tr key={admin.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-900/50">
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="font-medium">{admin.name}</p>
                                                <p className="text-xs text-muted-foreground">{admin.email}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">{getRoleBadge(admin.roles)}</td>
                                        <td className="py-3 px-4 text-sm">{admin.institution}</td>
                                        <td className="py-3 px-4">{getStatusBadge(admin.status)}</td>
                                        <td className="py-3 px-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" disabled={loading}><MoreVertical className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEditDialog(admin, "admin")}><Edit className="h-4 w-4 mr-2" />Modifier</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleToggleStatus("admin", admin.id, admin.status)}>
                                                        {admin.status === 'active' ? <><Lock className="h-4 w-4 mr-2" />Suspendre</> : <><Unlock className="h-4 w-4 mr-2" />Activer</>}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete("admin", admin.id)}><Trash2 className="h-4 w-4 mr-2" />Supprimer</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                </TabsContent>

                <TabsContent value="officials" className="mt-6">
                    <Card className="overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-900">
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 font-medium text-sm">Élu</th>
                                    <th className="text-left py-3 px-4 font-medium text-sm">Fonction</th>
                                    <th className="text-left py-3 px-4 font-medium text-sm">Institution</th>
                                    <th className="text-left py-3 px-4 font-medium text-sm">Statut</th>
                                    <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOfficials.filter(o => o.name.toLowerCase().includes(searchQuery.toLowerCase())).map((official) => (
                                    <tr key={official.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-900/50">
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="font-medium">{official.name}</p>
                                                <p className="text-xs text-muted-foreground">{official.phone}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">{getRoleBadge(official.roles)}</td>
                                        <td className="py-3 px-4">
                                            <Badge variant="outline" className={
                                                official.environment === 'an' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                    'bg-amber-50 text-amber-600 border-amber-200'
                                            }>
                                                {official.environment === 'an' ? <Building2 className="h-3 w-3 mr-1" /> : <Landmark className="h-3 w-3 mr-1" />}
                                                {official.institution}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-4">{getStatusBadge(official.status)}</td>
                                        <td className="py-3 px-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" disabled={loading}><MoreVertical className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEditDialog(official, "official")}><Edit className="h-4 w-4 mr-2" />Modifier</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleToggleStatus("official", official.id, official.status)}>
                                                        {official.status === 'active' ? <><Lock className="h-4 w-4 mr-2" />Suspendre</> : <><Unlock className="h-4 w-4 mr-2" />Activer</>}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete("official", official.id)}><Trash2 className="h-4 w-4 mr-2" />Supprimer</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                </TabsContent>

                <TabsContent value="citizens" className="mt-6">
                    <Card className="overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-900">
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 font-medium text-sm">Citoyen</th>
                                    <th className="text-left py-3 px-4 font-medium text-sm">Contact</th>
                                    <th className="text-left py-3 px-4 font-medium text-sm">Province</th>
                                    <th className="text-left py-3 px-4 font-medium text-sm">Statut</th>
                                    <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {citizens.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map((citizen) => (
                                    <tr key={citizen.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-900/50">
                                        <td className="py-3 px-4">
                                            <p className="font-medium">{citizen.name}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="text-sm">{citizen.phone}</p>
                                                <p className="text-xs text-muted-foreground">{citizen.email}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm">{citizen.province}</td>
                                        <td className="py-3 px-4">{getStatusBadge(citizen.status)}</td>
                                        <td className="py-3 px-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" disabled={loading}><MoreVertical className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEditDialog(citizen, "citizen")}><Edit className="h-4 w-4 mr-2" />Modifier</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleToggleStatus("citizen", citizen.id, citizen.status)}>
                                                        {citizen.status !== 'suspended' ? <><Lock className="h-4 w-4 mr-2" />Suspendre</> : <><Unlock className="h-4 w-4 mr-2" />Réactiver</>}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete("citizen", citizen.id)}><Trash2 className="h-4 w-4 mr-2" />Supprimer</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default UserManagementSection;
