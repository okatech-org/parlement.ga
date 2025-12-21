import { useState } from "react";
import {
  Home,
  FileText,
  Send,
  Tv,
  User,
  Mail,
  FolderOpen
} from "lucide-react";
import { AdminSpaceLayout } from "@/components/layout/AdminSpaceLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Mailbox from "@/pages/shared/Mailbox";
import SharedDocumentsPage from "@/pages/shared/SharedDocumentsPage";
import IBoitePage from "@/pages/shared/IBoitePage";

const CitizenSpace = () => {
  const [activeSection, setActiveSection] = useState("accueil");

  const userContext = {
    name: "Citoyen Gabonais",
    role: "Électeur",
    avatar: undefined,
  };

  const navItems = [
    { id: "accueil", label: "Accueil", icon: Home },
    { id: "legislation", label: "Suivi Législatif", icon: FileText },
    { id: "interpellation", label: "Interpeller mon Député", icon: Send },
    { id: "direct", label: "Direct TV", icon: Tv },
    { id: "profil", label: "Mon Profil", icon: User },
    { id: "mail", label: "iBoîte", icon: Mail },
    { id: "documents", label: "Mes Documents", icon: FolderOpen },
  ];

  const quickAccessItems = [
    { id: "accueil", label: "Accueil", icon: Home },
    { id: "legislation", label: "Lois", icon: FileText },
    { id: "interpellation", label: "Contact", icon: Send },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "accueil":
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Bienvenue sur Gabon E-Parlement</h1>
              <p className="text-muted-foreground">
                Suivez l'activité parlementaire en temps réel
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-6 neu-raised cursor-pointer" onClick={() => setActiveSection("legislation")}>
                <FileText className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Suivi des Lois</h3>
                <p className="text-sm text-muted-foreground">
                  Consultez l'avancement des projets de loi
                </p>
              </Card>
              <Card className="p-6 neu-raised cursor-pointer" onClick={() => setActiveSection("interpellation")}>
                <Send className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Contactez votre Député</h3>
                <p className="text-sm text-muted-foreground">
                  Faites remonter vos préoccupations
                </p>
              </Card>
            </div>
          </div>
        );

      case "legislation":
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Suivi Législatif</h1>
              <p className="text-muted-foreground">
                Timeline des projets de loi en cours
              </p>
            </div>
            <Card className="p-6 neu-raised">
              <div className="space-y-4">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">
                    Loi portant protection de l'environnement et des forêts
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    En cours de vote - Clôture: 15 mars 2025
                  </p>
                  <div className="flex gap-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      Pour: 65
                    </span>
                    <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">
                      Contre: 30
                    </span>
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                      Abstention: 25
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );

      case "interpellation":
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Interpeller votre Député</h1>
              <p className="text-muted-foreground">
                Formulaire de contact certifié
              </p>
            </div>
            <Card className="p-6 neu-raised">
              <form className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Votre Nom</label>
                  <Input placeholder="Nom complet" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input type="email" placeholder="votre@email.com" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Circonscription</label>
                  <Input placeholder="Votre circonscription" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea
                    placeholder="Décrivez votre demande ou préoccupation..."
                    rows={5}
                  />
                </div>
                <Button className="w-full neu-raised hover:scale-[1.02] transition-transform">
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer l'interpellation
                </Button>
              </form>
            </Card>
          </div>
        );

      case "direct":
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Direct TV</h1>
              <p className="text-muted-foreground">
                Streaming des séances plénières
              </p>
            </div>
            <Card className="p-6 neu-raised">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <Tv className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Aucune séance en direct actuellement
              </p>
            </Card>
          </div>
        );

      case "profil":
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Mon Profil</h1>
              <p className="text-muted-foreground">
                Informations et préférences
              </p>
            </div>
            <Card className="p-6 neu-raised">
              <User className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Profil Citoyen</h3>
              <p className="text-sm text-muted-foreground">
                Gérez vos informations personnelles et préférences
              </p>
            </Card>
          </div>
        );

      case "mail":
        return <IBoitePage />;

      case "documents":
        return <SharedDocumentsPage />;

      default:
        return null;
    }
  };

  return (
    <AdminSpaceLayout
      title="Espace Citoyen"
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

export default CitizenSpace;
