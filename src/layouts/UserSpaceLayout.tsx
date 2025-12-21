import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    LayoutDashboard,
    User,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    Sun,
    Moon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const UserSpaceLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, setTheme } = useTheme();

    const handleLogout = async () => {
        try {
            // Navigate to home FIRST to escape ProtectedRoute
            navigate("/");
            await supabase.auth.signOut();
            toast.success("Déconnexion réussie", {
                description: "À bientôt !",
            });
        } catch (error) {
            toast.error("Erreur", {
                description: "Erreur lors de la déconnexion",
            });
        }
    };

    const navItems = [
        { icon: LayoutDashboard, label: "Tableau de bord", path: "/user/dashboard" },
        { icon: User, label: "Mon Profil", path: "/user/profile" },
        { icon: Settings, label: "Paramètres", path: "/user/settings" },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-background border-r border-border/50 transform transition-transform duration-300 ease-in-out lg:transform-none flex flex-col shadow-elegant lg:shadow-none",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-8 flex items-center justify-between">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        Espace Membre
                    </h1>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden neu-icon-btn"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <nav className="flex-1 px-6 space-y-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <button
                                key={item.path}
                                className={cn(
                                    "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-medium",
                                    isActive
                                        ? "neu-inset text-primary"
                                        : "neu-raised hover:text-primary"
                                )}
                                onClick={() => {
                                    navigate(item.path);
                                    setIsSidebarOpen(false);
                                }}
                            >
                                <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-border/50 space-y-6">
                    <div className="neu-raised p-4 rounded-xl flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-primary/10 text-primary">U</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">Utilisateur</p>
                            <p className="text-xs text-muted-foreground truncate">user@presidence.ga</p>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 neu-raised"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-5 w-5" />
                        Déconnexion
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-background/80 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between gap-4 border-b border-border/50">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden neu-icon-btn"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    <div className="flex-1 max-w-md hidden md:block">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                className="w-full bg-background neu-inset rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            className="neu-icon-btn"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        >
                            <span className="sr-only">Thème</span>
                            {theme === "dark" ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </button>

                        <button className="neu-icon-btn relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-background" />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto scroll-smooth">
                    <div className="max-w-7xl mx-auto animate-fade-in">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UserSpaceLayout;
