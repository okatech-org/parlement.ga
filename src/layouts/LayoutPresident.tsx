import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    FileText,
    Mail,
    Bot,
    Landmark,
    TrendingUp,
    Users,
    Briefcase,
    Settings,
    LogOut,
    Menu,
    X,
    Moon,
    Sun,
    ChevronDown,
    ChevronRight,
    Calendar,
    Gavel
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import RoleSwitcher from "@/components/RoleSwitcher";
import { useUser } from "@/contexts/UserContext";

const LayoutPresident = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, setTheme } = useTheme();
    const { t, dir } = useLanguage();
    const { user } = useUser();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Check if user also has president_congress role (dual role)
    const userData = JSON.parse(sessionStorage.getItem('user_data') || '{}');
    const userRoles = userData.roles || [];
    const hasCongressRole = userRoles.includes('president_congress');

    const menuItems = [
        { icon: LayoutDashboard, label: t('president.sidebar.dashboard'), path: "/president" },
        { icon: Users, label: t('president.sidebar.bureau'), path: "/president/bureau" },
        { icon: Users, label: t('president.sidebar.conference'), path: "/president/conference" },
        { icon: Gavel, label: t('president.sidebar.commissions'), path: "/president/commissions" },
    ];

    const categories = [
        { icon: Mail, label: "iBoîte", path: "/president/mail" },
        { icon: Landmark, label: t('president.sidebar.plenary'), path: "/president/plenary" },
        { icon: Calendar, label: t('president.sidebar.agenda'), path: "/president/agenda" },
        { icon: FileText, label: t('president.sidebar.documents'), path: "/president/documents" },
        // Congress link for dual role
        ...(hasCongressRole ? [{ icon: Landmark, label: "Espace Congrès", path: "/congres/espace/president" }] : []),
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
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                P
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">{user?.name || "Michel Régis Onanga Ndiaye"}</h3>
                                <p className="text-xs text-muted-foreground">{t('president.title')}</p>
                            </div>
                        </div>
                        <RoleSwitcher />
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
                        <div>
                            <h4 className="text-xs font-semibold text-muted-foreground mb-3 px-2 uppercase tracking-wider">
                                Navigation
                            </h4>
                            <div className="space-y-1">
                                {menuItems.map((item, index) => (
                                    <Button
                                        key={index}
                                        variant={location.pathname === item.path ? "secondary" : "ghost"}
                                        className={cn(
                                            "w-full justify-start gap-3",
                                            location.pathname === item.path && "bg-primary/10 text-primary hover:bg-primary/15"
                                        )}
                                        onClick={() => navigate(item.path)}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="space-y-1">
                                {categories.map((item, index) => (
                                    <Button
                                        key={index}
                                        variant={location.pathname === item.path ? "secondary" : "ghost"}
                                        className={cn(
                                            "w-full justify-between group",
                                            location.pathname === item.path && "bg-primary/10 text-primary hover:bg-primary/15"
                                        )}
                                        onClick={() => navigate(item.path)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                                            {item.label}
                                        </div>
                                        {dir === 'rtl' ? <ChevronDown className="w-4 h-4 opacity-50 rotate-90" /> : <ChevronRight className="w-4 h-4 opacity-50" />}
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
                            onClick={() => navigate("/president/settings")}
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
                    <h1 className="font-bold">{t('president.title')}</h1>
                    <div className="w-10" /> {/* Spacer */}
                </div>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default LayoutPresident;
