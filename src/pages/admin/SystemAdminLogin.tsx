
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, Server, Terminal, Building2, Landmark, Scale, ArrowLeft } from "lucide-react";
import { useTheme } from "next-themes";

const SystemAdminLogin = () => {
    const navigate = useNavigate();
    const { login } = useUser();
    const { setTheme } = useTheme();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Ensure dark mode for "Matrix/Admin" feel
    // useEffect(() => setTheme("dark"), []); 

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Fallback login
        if (username === "admin" && password === "admin") {
            login("admin00", "admin");
        }
    };

    const demoAccounts = [
        {
            id: "system",
            title: "Super Admin",
            desc: "Accès global système",
            icon: Terminal,
            phone: "admin00",
            color: "text-red-500",
            border: "border-red-500/20 hover:border-red-500/50"
        },
        {
            id: "an",
            title: "Admin Assemblée",
            desc: "Gestion AN",
            icon: Building2,
            phone: "admin01",
            color: "text-emerald-500",
            border: "border-emerald-500/20 hover:border-emerald-500/50"
        },
        {
            id: "senat",
            title: "Admin Sénat",
            desc: "Gestion Sénat",
            icon: Landmark,
            phone: "admin02",
            color: "text-amber-500",
            border: "border-amber-500/20 hover:border-amber-500/50"
        },
        {
            id: "parlement",
            title: "Admin Parlement",
            desc: "Gestion Congrès",
            icon: Scale,
            phone: "admin03",
            color: "text-blue-500",
            border: "border-blue-500/20 hover:border-blue-500/50"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="z-10 w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">

                {/* Login Form Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-8">
                        <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={() => navigate("/")}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Retour
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-mono font-bold text-white tracking-tight flex items-center gap-3">
                            <Shield className="h-8 w-8 text-indigo-500" />
                            SYSTEM_ADMIN_ACCESS
                        </h1>
                        <p className="text-slate-400">Portail d'administration sécurisé de la République</p>
                    </div>

                    <Card className="p-6 bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Identifiant Système</Label>
                                <div className="relative">
                                    <Server className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                    <Input
                                        className="pl-9 bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus:ring-indigo-500"
                                        placeholder="sys_admin_01"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Clé de Sécurité</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                    <Input
                                        type="password"
                                        className="pl-9 bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus:ring-indigo-500"
                                        placeholder="••••••••••••"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-mono">
                                INITIALISER_SESSION
                            </Button>
                        </form>
                    </Card>

                    <div className="flex justify-between text-xs text-slate-500 font-mono">
                        <span>v2.4.0-stable</span>
                        <span>SECURE_CONN_ESTABLISHED</span>
                    </div>
                </div>

                {/* Quick Access Demo Grid */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <Terminal className="h-5 w-5 text-green-500" />
                        <h2 className="text-xl font-mono text-white">ACCÈS_RAPIDE__DEMO</h2>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {demoAccounts.map((acc) => {
                            const Icon = acc.icon;
                            return (
                                <Card
                                    key={acc.id}
                                    className={`p-4 bg-slate-900/40 cursor-pointer transition-all duration-300 border ${acc.border} hover:bg-slate-800 group`}
                                    onClick={() => login(acc.phone, "admin")}
                                >
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className={`p-2 rounded-md bg-slate-950 group-hover:bg-slate-900 transition-colors ${acc.color}`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className={`font-bold font-mono ${acc.color} mb-1`}>{acc.title}</h3>
                                        <p className="text-xs text-slate-400">{acc.desc}</p>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>

                    <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 mt-4">
                        <p className="text-xs text-orange-400 font-mono">
                            ⚠ ATTENTION: Ces accès sont réservés aux démonstrations techniques. Toute modification sera répercutée sur l'environnement de production simulé.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemAdminLogin;
