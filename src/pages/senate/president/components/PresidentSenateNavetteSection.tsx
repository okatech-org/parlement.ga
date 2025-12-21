import { useState } from "react";
import { ArrowLeftRight, Send, PenTool, Clock, FileText, CheckCircle, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AnimatedDashboardCard } from "@/components/animations/DashboardAnimations";

export const PresidentSenateNavetteSection = () => {
  const pendingTransmissions = [
    {
      id: 1,
      reference: "PL-2024-041",
      title: "Loi organique sur le statut des collectivités",
      votedAt: "12 Déc 2024",
      destination: "PRESIDENCY",
    },
    {
      id: 2,
      reference: "PL-2024-039",
      title: "Projet de loi portant code minier",
      votedAt: "10 Déc 2024",
      destination: "ASSEMBLY",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const handleSign = (reference: string) => {
    toast.success(`Texte ${reference} signé`, {
      description: "La transmission est en cours..."
    });
  };

  const handleDetails = (reference: string) => {
    toast.info(`Consultation du texte ${reference}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground mb-1">
            Validation Navette
          </h1>
          <p className="text-muted-foreground text-sm">
            Textes adoptés en attente de signature et transmission
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un texte..."
              className="pl-9 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {pendingTransmissions.map((text, index) => (
          <AnimatedDashboardCard key={text.id} delay={index * 0.1}>
            <Card className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">{text.reference}</Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Voté le {text.votedAt}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg text-foreground">{text.title}</h3>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        Lecture définitive
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Adopté à la majorité
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Badge className={`${text.destination === "PRESIDENCY" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"} px-3 py-1`}>
                      {text.destination === "PRESIDENCY" ? "→ Promulgation" : "→ Retour AN"}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t mt-4">
                  <Button className="flex-1 md:flex-none" onClick={() => handleSign(text.reference)}>
                    <PenTool className="h-4 w-4 mr-2" />
                    Signer et Transmettre
                  </Button>
                  <Button variant="outline" className="flex-1 md:flex-none" onClick={() => handleDetails(text.reference)}>
                    Détails
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimatedDashboardCard>
        ))}
      </div>
    </div>
  );
};
