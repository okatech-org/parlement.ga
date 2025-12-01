import { useState } from "react";
import { Landmark, Users, FileText, Map, Vote, Shield, ChevronRight, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const features = [
    {
      icon: Vote,
      title: "Vote Électronique",
      description: "Système de vote sécurisé en temps réel avec traçabilité complète",
      color: "primary",
      path: "/vote"
    },
    {
      icon: FileText,
      title: "Suivi Législatif",
      description: "Timeline visuelle de l'avancée des projets de loi",
      color: "secondary",
      path: "/legislation"
    },
    {
      icon: Map,
      title: "Gestion Territoriale",
      description: "Carte interactive du Gabon avec doléances citoyennes",
      color: "accent",
      path: "/territoire"
    },
    {
      icon: BarChart3,
      title: "Statistiques",
      description: "Données transparentes sur l'activité parlementaire",
      color: "primary",
      path: "/statistiques"
    }
  ];

  const stats = [
    { value: "14e", label: "Législature" },
    { value: "120", label: "Députés" },
    { value: "150+", label: "Lois votées" },
    { value: "100%", label: "Digital" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Landmark className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-serif font-bold text-foreground">Gabon E-Parlement</h1>
                <p className="text-xs text-muted-foreground">Assemblée Nationale du Gabon</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                Mode Citoyen
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/vote")}>
                <Shield className="mr-2 h-4 w-4" />
                Espace Député
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20" variant="outline">
              XIVe Législature • Souveraineté Digitale
            </Badge>
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 animate-fade-in">
              Parlement <span className="text-gradient">Digital</span> du Gabon
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Transparence, efficacité et proximité citoyenne au cœur de la démocratie gabonaise. 
              Zéro papier, sécurité maximale, engagement total.
            </p>
            <div className="flex gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Button size="lg" className="shadow-elegant" onClick={() => navigate("/legislation")}>
                <FileText className="mr-2 h-5 w-5" />
                Suivre les Lois
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/territoire")}>
                <Map className="mr-2 h-5 w-5" />
                Explorer la Carte
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <Card 
                key={index} 
                className="p-6 text-center bg-card shadow-card-custom border-border/50 hover:shadow-elegant transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className="text-3xl font-serif font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold mb-4">Fonctionnalités Principales</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Une plateforme complète pour moderniser le travail parlementaire et renforcer le lien démocratique
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="p-6 bg-card shadow-card-custom hover:shadow-elegant transition-all duration-300 cursor-pointer border-border/50 animate-slide-in-right"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => navigate(feature.path)}
                >
                  <div className={`w-12 h-12 rounded-lg bg-${feature.color}/10 flex items-center justify-center mb-4 transition-transform duration-300 ${hoveredCard === index ? 'scale-110' : ''}`}>
                    <Icon className={`h-6 w-6 text-${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-serif font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                  <ChevronRight className={`h-5 w-5 text-muted-foreground mt-4 transition-transform duration-300 ${hoveredCard === index ? 'translate-x-2' : ''}`} />
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Banner */}
      <section className="py-16 bg-primary/5 border-y border-primary/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <div className="font-semibold">Sécurité Maximale</div>
                <div className="text-sm text-muted-foreground">Chiffrement AES-256</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-secondary" />
              <div>
                <div className="font-semibold">Authentification 2FA</div>
                <div className="text-sm text-muted-foreground">Accès sécurisé</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Landmark className="h-8 w-8 text-accent" />
              <div>
                <div className="font-semibold">Souveraineté Nationale</div>
                <div className="text-sm text-muted-foreground">Données au Gabon</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Landmark className="h-6 w-6 text-primary" />
                <span className="font-serif font-bold">Gabon E-Parlement</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Plateforme officielle de l'Assemblée Nationale de la République Gabonaise
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Liens Rapides</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/legislation" className="hover:text-primary transition-colors">Projets de Loi</a></li>
                <li><a href="/vote" className="hover:text-primary transition-colors">Espace Député</a></li>
                <li><a href="/territoire" className="hover:text-primary transition-colors">Carte du Gabon</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-sm text-muted-foreground">
                Assemblée Nationale du Gabon<br />
                Libreville, Gabon<br />
                contact@parlement.ga
              </p>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2025 Assemblée Nationale du Gabon • Tous droits réservés
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
