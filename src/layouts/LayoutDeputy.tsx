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
    Briefcase,
    Gavel,
    ChevronRight,
    ChevronDown,
    Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import RoleSwitcher from "@/components/RoleSwitcher";
import { useUser } from "@/contexts/UserContext";

const LayoutDeputy = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, setTheme } = useTheme();
    const { t, dir } = useLanguage();
    const { user } = useUser();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const menuItems = [
        { icon: LayoutDashboard, label: "Tableau de bord", path: "/vote" },
        { icon: Gavel, label: "Outils Législatifs", path: "/vote/tools" },
        { icon: Calendar, label: "Agenda Parlementaire", path: "/vote/agenda" },
        { icon: Briefcase, label: "Gestion du Mandat", path: "/vote/mandate" },
        { icon: Mail, label: "iBoîte", path: "/vote/mail" },
        { icon: FileText, label: "Documents", path: "/vote/documents" },
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
                    {/* Profile Section */}
                    <div className="p-6 border-b border-border/50">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold text-xl">
                                D
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">{user?.name || "Honorable Député"}</h3>
                                <p className="text-xs text-muted-foreground">Espace Législatif</p>
                            </div>
                        </div>
                        <RoleSwitcher />
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
                        <div>
                            <h4 className="text-xs font-semibold text-muted-foreground mb-3 px-2 uppercase tracking-wider">
                                Espace Député
                            </h4>
                            <div className="space-y-1">
                                {menuItems.map((item, index) => (
                                    <Button
                                        key={index}
                                        variant={location.pathname === item.path ? "secondary" : "ghost"}
                                        className={cn(
                                            "w-full justify-start gap-3",
                                            location.pathname === item.path && "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15"
                                        )}
                                        onClick={() => navigate(item.path)}
                                    >
                                        <item.icon className="w-4 h-4" />
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
                            onClick={() => navigate("/vote/settings")}
                        >
                            <Settings className="w-4 h-4" />
                            {t('common.settings')}
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            onClick={() => {
                                sessionStorage.removeItem('user_data');
                                sessionStorage.removeItem('current_role');
                                navigate("/auth");
                            }}
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
                    <h1 className="font-bold">Espace Député</h1>
                    <div className="w-10" /> {/* Spacer */}
                </div>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default LayoutDeputy;
