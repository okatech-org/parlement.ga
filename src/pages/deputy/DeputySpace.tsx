import { useState } from "react";
import {
  Vote,
  FileText,
  Map,
  MessageSquare,
  FolderOpen,
  TrendingUp,
  Wallet,
  Plane,
  Settings,
  Bell,
} from "lucide-react";
import { AdminSpaceLayout } from "@/components/layout/AdminSpaceLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GabonMap from "@/components/map/GabonMap";

const DeputySpace = () => {
  const [activeSection, setActiveSection] = useState("hemicycle");

  const userContext = {
    name: "Hon. Jean Dupont",
    role: "Député - Circonscription Est",
    avatar: undefined,
  };

  const navItems = [
    { id: "hemicycle", label: "E-Hémicycle", icon: Vote },
    { id: "bureau", label: "Bureau Virtuel", icon: FileText },
    { id: "circonscription", label: "CRM Circonscription", icon: Map, badge: "12" },
    { id: "messagerie", label: "Messagerie", icon: MessageSquare, badge: "3" },
    { id: "documents", label: "Documents", icon: FolderOpen },
    { id: "remontees", label: "Remontées Citoyens", icon: TrendingUp, badge: "8" },
    { id: "budget", label: "Budget & Fiche Pays", icon: Wallet },
    { id: "missions", label: "Frais de Mission", icon: Plane },
    { id: "notifications", label: "Notifications", icon: Bell, badge: "5" },
    { id: "parametres", label: "Paramètres", icon: Settings },
  ];

  const quickAccessItems = [
    { id: "hemicycle", label: "Vote", icon: Vote },
    { id: "circonscription", label: "Terrain", icon: Map, badge: "12" },
    { id: "messagerie", label: "Messages", icon: MessageSquare, badge: "3" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "hemicycle":
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">E-Hémicycle</h1>
              <p className="text-muted-foreground">
                Système de vote électronique sécurisé
              </p>
            </div>
            <Card className="p-6 bg-card shadow-card-custom">
              <h3 className="text-xl font-serif font-bold mb-4">Vote en cours</h3>
              <div className="space-y-4">
                <div className="p-4 border border-border rounded-lg bg-muted/30">
                  <Badge variant="outline" className="mb-2 bg-secondary/10 text-secondary border-secondary/20">
                    Session Active
                  </Badge>
                  <h4 className="font-semibold mb-2">
                    Loi portant protection de l'environnement et des forêts
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Clôture: 2025-03-15 18:00
                  </p>
                </div>
              </div>
            </Card>
          </div>
        );

      case "bureau":
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Bureau Virtuel</h1>
              <p className="text-muted-foreground">
                Accès aux textes de loi et agenda des commissions
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-6 bg-card shadow-card-custom">
                <FileText className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Textes en cours</h3>
                <p className="text-sm text-muted-foreground">5 projets de loi à examiner</p>
              </Card>
              <Card className="p-6 bg-card shadow-card-custom">
                <FileText className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Agenda</h3>
                <p className="text-sm text-muted-foreground">3 commissions cette semaine</p>
              </Card>
            </div>
          </div>
        );

      case "circonscription":
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">CRM Circonscription</h1>
              <p className="text-muted-foreground">
                Carte interactive et gestion des doléances
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2 p-6 bg-card shadow-card-custom">
                <h3 className="font-semibold mb-4">Carte du Gabon</h3>
                <GabonMap />
              </Card>
              <div className="space-y-4">
                <Card className="p-6 bg-card shadow-card-custom">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Doléances récentes</h3>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      12 nouvelles
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Suivi des demandes de votre circonscription
                  </p>
                  <div className="space-y-2">
                    <div className="p-3 border border-border rounded-lg bg-muted/30">
                      <p className="text-sm font-medium">Réfection route N1</p>
                      <p className="text-xs text-muted-foreground">Il y a 2 jours</p>
                    </div>
                    <div className="p-3 border border-border rounded-lg bg-muted/30">
                      <p className="text-sm font-medium">Centre de santé</p>
                      <p className="text-xs text-muted-foreground">Il y a 4 jours</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        );

      case "messagerie":
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Messagerie Sécurisée</h1>
              <p className="text-muted-foreground">
                Chat crypté et visioconférence
              </p>
            </div>
            <Card className="p-6 bg-card shadow-card-custom">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Messages non lus</h3>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  3
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Système de messagerie cryptée disponible prochainement
              </p>
            </Card>
          </div>
        );

      case "documents":
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Documents</h1>
              <p className="text-muted-foreground">
                Bibliothèque de documents parlementaires
              </p>
            </div>
            <Card className="p-6 bg-card shadow-card-custom">
              <FolderOpen className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Mes Documents</h3>
              <p className="text-sm text-muted-foreground">
                Accès à tous vos documents et rapports
              </p>
            </Card>
          </div>
        );

      case "remontees":
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Remontées Citoyens</h1>
              <p className="text-muted-foreground">
                Suivi des demandes et interpellations citoyennes
              </p>
            </div>
            <Card className="p-6 bg-card shadow-card-custom">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Nouvelles demandes</h3>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  8
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Gestion des interpellations citoyennes
              </p>
            </Card>
          </div>
        );

      case "budget":
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Budget & Fiche Pays</h1>
              <p className="text-muted-foreground">
                Informations budgétaires et économiques
              </p>
            </div>
            <Card className="p-6 bg-card shadow-card-custom">
              <Wallet className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Indicateurs Économiques</h3>
              <p className="text-sm text-muted-foreground">
                Accès aux données budgétaires nationales
              </p>
            </Card>
          </div>
        );

      case "missions":
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Frais de Mission</h1>
              <p className="text-muted-foreground">
                Gestion des déplacements et remboursements
              </p>
            </div>
            <Card className="p-6 bg-card shadow-card-custom">
              <Plane className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Mes Missions</h3>
              <p className="text-sm text-muted-foreground">
                Suivi des frais et demandes de remboursement
              </p>
            </Card>
          </div>
        );

      case "notifications":
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Notifications</h1>
              <p className="text-muted-foreground">
                Alertes et notifications importantes
              </p>
            </div>
            <Card className="p-6 bg-card shadow-card-custom">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Alertes récentes</h3>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  5
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Système de notifications en temps réel
              </p>
            </Card>
          </div>
        );

      case "parametres":
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Paramètres</h1>
              <p className="text-muted-foreground">
                Configuration de votre espace député
              </p>
            </div>
            <Card className="p-6 bg-card shadow-card-custom">
              <Settings className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Préférences</h3>
              <p className="text-sm text-muted-foreground">
                Personnalisez votre expérience
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
      title="Espace Député"
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

export default DeputySpace;
