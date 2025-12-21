import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    Moon,
    Sun,
    Calendar,
    Bell,
    Users,
    Heart,
    TrendingUp,
    Building2,
    Landmark,
    Scale,
    Mail,
    FolderOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import { Separator } from "@/components/ui/separator";

interface LayoutCitizenProps {
    children: React.ReactNode;
}

/**
 * Layout Citoyen Universel
 * Un seul espace citoyen avec accès à toutes les institutions (AN, Sénat, Parlement)
 * 
 * Palette officielle:
 * - AN: #3A87FD (bleu)
 * - Sénat: #D19C00 (or)
 * - Parlement: #77BA41 (vert)
 * - Citoyen: #04CDB9 (cyan)
 */
const LayoutCitizen = ({ children }: LayoutCitizenProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, setTheme } = useTheme();
    const { t, dir } = useLanguage();
    const { user, logout } = useUser();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const basePath = "/espace/citoyen";

    // Menu principal - accès à toutes les fonctionnalités citoyen
    const menuItems = [
        { icon: LayoutDashboard, label: "Tableau de bord", path: basePath },
        { icon: TrendingUp, label: "Suivre les travaux", path: `${basePath}/suivi` },
        { icon: Calendar, label: "Agenda public", path: `${basePath}/agenda` },
        { icon: Users, label: "Mes élus", path: `${basePath}/elus` },
        { icon: Heart, label: "Pétitions", path: `${basePath}/petitions` },
        { icon: Bell, label: "Notifications", path: `${basePath}/notifications` },
        { icon: Mail, label: "iBoîte", path: `${basePath}/mail` },
        { icon: FolderOpen, label: "iDocuments", path: `${basePath}/documents` },
    ];

    // Raccourcis vers les 3 institutions avec couleurs officielles
    const institutionLinks = [
        { icon: Building2, label: "Assemblée Nationale", path: "/an", colorClass: "text-[#3A87FD]" },
        { icon: Landmark, label: "Sénat", path: "/senat", colorClass: "text-[#D19C00]" },
        { icon: Scale, label: "Parlement / Congrès", path: "/parlement", colorClass: "text-[#77BA41]" },
    ];



    return (
        <div className="min-h-screen bg-background flex" dir={dir}>
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
                    !isSidebarOpen && dir === 'ltr' && "-translate-x-full",
                    !isSidebarOpen && dir === 'rtl' && "translate-x-full",
                    dir === 'rtl' ? "right-0 border-l border-r-0" : "left-0"
                )}
            >
                <div className="h-full flex flex-col">
                    {/* Profile Section - Couleur Citoyen #04CDB9 */}
                    <div className="p-6 border-b border-border/50">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 rounded-full bg-[#04CDB9]/20 flex items-center justify-center text-[#04CDB9] font-bold text-xl">
                                C
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">{user?.name || "Citoyen"}</h3>
                                <p className="text-xs text-muted-foreground">Espace Citoyen</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
                        {/* Menu Principal */}
                        <div>
                            <h4 className="text-xs font-semibold text-muted-foreground mb-3 px-2 uppercase tracking-wider">
                                Menu Principal
                            </h4>
                            <div className="space-y-1">
                                {menuItems.map((item, index) => (
                                    <Button
                                        key={index}
                                        variant={location.pathname === item.path ? "secondary" : "ghost"}
                                        className={cn(
                                            "w-full justify-start gap-3",
                                            location.pathname === item.path && "bg-[#04CDB9]/10 text-[#04CDB9] hover:bg-[#04CDB9]/15"
                                        )}
                                        onClick={() => navigate(item.path)}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Accès aux Institutions */}
                        <div>
                            <h4 className="text-xs font-semibold text-muted-foreground mb-3 px-2 uppercase tracking-wider">
                                Portails Institutionnels
                            </h4>
                            <div className="space-y-1">
                                {institutionLinks.map((item, index) => (
                                    <Button
                                        key={index}
                                        variant="ghost"
                                        className="w-full justify-start gap-3"
                                        onClick={() => navigate(item.path)}
                                    >
                                        <item.icon className={cn("w-4 h-4", item.colorClass)} />
                                        {item.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="p-4 border-t border-border/50 space-y-2">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        >
                            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            {theme === "dark" ? t('common.light') : t('common.dark')}
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3"
                            onClick={() => navigate(`${basePath}/settings`)}
                        >
                            <Settings className="w-4 h-4" />
                            {t('common.settings')}
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            onClick={() => logout()}
                        >
                            <LogOut className="w-4 h-4" />
                            {t('common.logout')}
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {!isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(true)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen">
                {/* Mobile Header */}
                <div className="lg:hidden p-4 border-b border-border flex items-center justify-between bg-background sticky top-0 z-30">
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </Button>
                    <h1 className="font-bold">Espace Citoyen</h1>
                    <div className="w-10" /> {/* Spacer */}
                </div>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default LayoutCitizen;
