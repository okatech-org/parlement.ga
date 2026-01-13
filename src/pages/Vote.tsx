import { useState } from "react";
import { Shield, ThumbsUp, ThumbsDown, Minus, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Vote = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const currentBill = {
    id: "PL-2025-001",
    title: "Loi portant protection de l'environnement et des forêts",
    description: "Cette loi vise à renforcer les sanctions contre la déforestation illégale et à protéger la biodiversité gabonaise.",
    details: [
      "Article 1: Interdiction de la coupe d'arbres sans autorisation",
      "Article 2: Sanctions pénales pour déforestation illégale",
      "Article 3: Création d'un fonds pour la reforestation",
      "Article 4: Mise en place d'un système de surveillance par satellite"
    ],
    voteDeadline: "2025-03-15 18:00"
  };

  const voteResults = {
    pour: 65,
    contre: 30,
    abstention: 25,
    total: 145
  };

  const handleAuthenticate = () => {
    // Simulation d'authentification 2FA
    toast({
      title: "Authentification réussie",
      description: "Vous pouvez maintenant voter en toute sécurité",
    });
    setIsAuthenticated(true);
  };

  const handleVote = (voteType: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentification requise",
        description: "Veuillez vous authentifier pour voter",
        variant: "destructive"
      });
      return;
    }

    setSelectedVote(voteType);

    // Simulation d'enregistrement du vote
    setTimeout(() => {
      setHasVoted(true);
      toast({
        title: "Vote enregistré",
        description: `Votre vote "${voteType}" a été enregistré de manière sécurisée et immuable`,
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header - Mode Député */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-serif font-bold">Espace Député</h1>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Session Active
            </Badge>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Authentication Card */}
        {!isAuthenticated && (
          <Card className="p-8 mb-8 bg-card shadow-elegant border-primary/20 animate-fade-in">
            <div className="text-center">
              <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-serif font-bold mb-2">Authentification Sécurisée</h2>
              <p className="text-muted-foreground mb-6">
                Pour accéder au système de vote, veuillez vous authentifier avec votre badge biométrique
              </p>
              <Button size="lg" onClick={handleAuthenticate} className="shadow-elegant">
                <Shield className="mr-2 h-5 w-5" />
                S'authentifier (2FA)
              </Button>
            </div>
          </Card>
        )}

        {/* Bill Information */}
        <Card className="p-8 mb-8 bg-card shadow-card-custom animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="mb-6">
            <Badge variant="outline" className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
              Vote en cours
            </Badge>
            <h2 className="text-3xl font-serif font-bold mb-3">{currentBill.title}</h2>
            <p className="text-muted-foreground mb-2">{currentBill.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
              <span className="font-mono">{currentBill.id}</span>
              <span>•</span>
              <span>Clôture: {currentBill.voteDeadline}</span>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-semibold mb-4">Articles principaux:</h3>
            <ul className="space-y-3">
              {currentBill.details.map((detail, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Voting Interface */}
        {isAuthenticated && !hasVoted && (
          <Card className="p-8 mb-8 bg-card shadow-elegant border-primary/10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-xl font-serif font-bold mb-6 text-center">Exprimez votre vote</h3>
            <div className="grid grid-cols-3 gap-4">
              <Button
                size="lg"
                variant={selectedVote === "Pour" ? "default" : "outline"}
                className="h-32 flex flex-col gap-3 hover:shadow-elegant transition-all"
                onClick={() => handleVote("Pour")}
              >
                <ThumbsUp className="h-8 w-8" />
                <span className="font-semibold">Pour</span>
              </Button>
              <Button
                size="lg"
                variant={selectedVote === "Contre" ? "default" : "outline"}
                className="h-32 flex flex-col gap-3 hover:shadow-elegant transition-all"
                onClick={() => handleVote("Contre")}
              >
                <ThumbsDown className="h-8 w-8" />
                <span className="font-semibold">Contre</span>
              </Button>
              <Button
                size="lg"
                variant={selectedVote === "Abstention" ? "default" : "outline"}
                className="h-32 flex flex-col gap-3 hover:shadow-elegant transition-all"
                onClick={() => handleVote("Abstention")}
              >
                <Minus className="h-8 w-8" />
                <span className="font-semibold">Abstention</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-6">
              <Shield className="inline h-3 w-3 mr-1" />
              Vote chiffré et immuable • Traçabilité blockchain
            </p>
          </Card>
        )}

        {/* Vote Confirmation */}
        {hasVoted && (
          <Card className="p-8 mb-8 bg-primary/5 border-primary/20 shadow-elegant animate-fade-in">
            <div className="text-center">
              <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-serif font-bold mb-2">Vote enregistré</h3>
              <p className="text-muted-foreground mb-4">
                Votre vote "<span className="font-semibold text-primary">{selectedVote}</span>" a été enregistré avec succès
              </p>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Hash: 0xA3F8...92BC
              </Badge>
            </div>
          </Card>
        )}

        {/* Live Results */}
        <Card className="p-8 bg-card shadow-card-custom animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <h3 className="text-xl font-serif font-bold mb-6">Résultats en temps réel</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-primary" />
                  Pour
                </span>
                <span className="font-mono text-sm">{voteResults.pour}/{voteResults.total}</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${(voteResults.pour / voteResults.total) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="flex items-center gap-2">
                  <ThumbsDown className="h-4 w-4 text-destructive" />
                  Contre
                </span>
                <span className="font-mono text-sm">{voteResults.contre}/{voteResults.total}</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-destructive rounded-full transition-all duration-500"
                  style={{ width: `${(voteResults.contre / voteResults.total) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="flex items-center gap-2">
                  <Minus className="h-4 w-4 text-muted-foreground" />
                  Abstention
                </span>
                <span className="font-mono text-sm">{voteResults.abstention}/{voteResults.total}</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-muted-foreground rounded-full transition-all duration-500"
                  style={{ width: `${(voteResults.abstention / voteResults.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Vote;
