import { useState } from "react";
import { FileText, Clock, CheckCircle2, XCircle, ArrowLeft, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const Legislation = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const laws = [
    {
      id: "PL-2025-001",
      title: "Loi portant protection de l'environnement et des forêts",
      status: "En cours",
      stage: "Commission Environnement",
      date: "2025-01-15",
      progress: 60,
      description: "Renforcement des sanctions contre la déforestation illégale"
    },
    {
      id: "PL-2025-002",
      title: "Loi de finances rectificative 2025",
      status: "En débat",
      stage: "Séance plénière",
      date: "2025-02-01",
      progress: 80,
      description: "Ajustement budgétaire pour les investissements publics"
    },
    {
      id: "PL-2024-089",
      title: "Loi sur la digitalisation des services publics",
      status: "Adoptée",
      stage: "Promulguée",
      date: "2024-12-20",
      progress: 100,
      description: "Modernisation de l'administration gabonaise"
    },
    {
      id: "PL-2025-003",
      title: "Loi portant réforme du code électoral",
      status: "En cours",
      stage: "Commission Lois",
      date: "2025-02-10",
      progress: 40,
      description: "Amélioration de la transparence électorale"
    },
    {
      id: "PL-2024-088",
      title: "Loi sur l'éducation numérique",
      status: "Rejetée",
      stage: "Vote final",
      date: "2024-11-30",
      progress: 90,
      description: "Introduction du coding dans les programmes scolaires"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Adoptée":
        return <CheckCircle2 className="h-5 w-5 text-primary" />;
      case "Rejetée":
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-secondary" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Adoptée":
        return "bg-primary/10 text-primary border-primary/20";
      case "Rejetée":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-secondary/10 text-secondary border-secondary/20";
    }
  };

  const filteredLaws = laws.filter(law =>
    law.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    law.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Accueil
            </Button>
            <h1 className="text-lg font-serif font-bold">Suivi Législatif</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <Card className="p-6 mb-8 bg-card shadow-card-custom">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un projet de loi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtrer
            </Button>
          </div>
        </Card>

        {/* Timeline */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-serif font-bold">Projets de Loi en Cours</h2>
          </div>

          {filteredLaws.map((law, index) => (
            <Card
              key={law.id}
              className="p-6 bg-card shadow-card-custom hover:shadow-elegant transition-all duration-300 animate-fade-in border-l-4"
              style={{
                animationDelay: `${index * 0.1}s`,
                borderLeftColor: law.status === "Adoptée" ? "hsl(var(--primary))" : 
                                law.status === "Rejetée" ? "hsl(var(--destructive))" : 
                                "hsl(var(--secondary))"
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  {getStatusIcon(law.status)}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-serif font-semibold">{law.title}</h3>
                      <Badge variant="outline" className={getStatusColor(law.status)}>
                        {law.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{law.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="font-mono">{law.id}</span>
                      <span>•</span>
                      <span>{law.date}</span>
                      <span>•</span>
                      <span className="font-medium">{law.stage}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Progression</span>
                  <span className="text-xs font-mono text-muted-foreground">{law.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500 rounded-full"
                    style={{ width: `${law.progress}%` }}
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-4 border-t border-border">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                  Voir les détails →
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredLaws.length === 0 && (
          <Card className="p-12 text-center bg-card shadow-card-custom">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun résultat</h3>
            <p className="text-muted-foreground">
              Aucun projet de loi ne correspond à votre recherche
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Legislation;
