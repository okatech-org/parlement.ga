import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  BarChart3,
  Shield,
} from "lucide-react";
import { AdminSpaceLayout } from "@/components/layout/AdminSpaceLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AdminSpace = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const userContext = {
    name: "Admin Greffe",
    role: "Administrateur Système",
    avatar: undefined,
  };

  const navItems = [
    { id: "dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
    { id: "sessions", label: "Gestion Sessions", icon: FileText },
    { id: "users", label: "Utilisateurs", icon: Users },
    { id: "moderation", label: "Modération", icon: Shield, badge: "4" },
    { id: "analytics", label: "Statistiques", icon: BarChart3 },
    { id: "settings", label: "Paramètres", icon: Settings },
  ];

  const quickAccessItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "sessions", label: "Sessions", icon: FileText },
    { id: "moderation", label: "Modération", icon: Shield, badge: "4" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Tableau de Bord</h1>
              <p className="text-muted-foreground">
                Vue d'ensemble du système parlementaire
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-6 neu-raised">
                <h3 className="text-2xl font-bold mb-1">145</h3>
                <p className="text-sm text-muted-foreground">Députés Actifs</p>
              </Card>
              <Card className="p-6 neu-raised">
                <h3 className="text-2xl font-bold mb-1">8</h3>
                <p className="text-sm text-muted-foreground">Sessions en cours</p>
              </Card>
              <Card className="p-6 neu-raised">
                <h3 className="text-2xl font-bold mb-1">42</h3>
                <p className="text-sm text-muted-foreground">Lois votées (2025)</p>
              </Card>
            </div>
          </div>
        );

      case "sessions":
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Gestion des Sessions</h1>
              <p className="text-muted-foreground">
                Créer et gérer les sessions de vote
              </p>
            </div>
            <Card className="p-6 neu-raised">
              <FileText className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Sessions Actives</h3>
              <p className="text-sm text-muted-foreground">
                8 sessions de vote en cours
              </p>
            </Card>
          </div>
        );

      case "users":
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Gestion Utilisateurs</h1>
              <p className="text-muted-foreground">
                Administration des comptes et permissions
              </p>
            </div>
            <Card className="p-6 neu-raised">
              <Users className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Utilisateurs</h3>
              <p className="text-sm text-muted-foreground">
                145 députés, 15 administrateurs
              </p>
            </Card>
          </div>
        );

      case "moderation":
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Modération</h1>
              <p className="text-muted-foreground">
                Modération des doléances citoyennes
              </p>
            </div>
            <Card className="p-6 neu-raised">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">En attente de validation</h3>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  4
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Doléances en attente de modération
              </p>
            </Card>
          </div>
        );

      case "analytics":
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Statistiques</h1>
              <p className="text-muted-foreground">
                Analyses et rapports du système
              </p>
            </div>
            <Card className="p-6 neu-raised">
              <BarChart3 className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Rapports</h3>
              <p className="text-sm text-muted-foreground">
                Statistiques d'utilisation et de participation
              </p>
            </Card>
          </div>
        );

      case "settings":
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Paramètres Système</h1>
              <p className="text-muted-foreground">
                Configuration du système parlementaire
              </p>
            </div>
            <Card className="p-6 neu-raised">
              <Settings className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Paramètres avancés du système
              </p>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AdminSpaceLayout
      title="Espace Administrateur"
      userContext={userContext}
      navItems={navItems}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      quickAccessItems={quickAccessItems}
    >
      {renderContent()}
    </AdminSpaceLayout>
  );
};

export default AdminSpace;
