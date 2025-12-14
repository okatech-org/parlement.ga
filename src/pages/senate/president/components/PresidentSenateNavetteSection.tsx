import { ArrowLeftRight, Send, PenTool, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
          Validation Navette
        </h1>
        <p className="text-muted-foreground">
          Textes adoptés en attente de signature et transmission
        </p>
      </div>

      <div className="grid gap-4">
        {pendingTransmissions.map((text) => (
          <Card key={text.id} className="border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant="outline" className="mb-2">{text.reference}</Badge>
                  <h3 className="font-semibold text-lg">{text.title}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    Voté le {text.votedAt}
                  </p>
                </div>
                <Badge className={text.destination === "PRESIDENCY" ? "bg-green-500" : "bg-blue-500"}>
                  {text.destination === "PRESIDENCY" ? "→ Promulgation" : "→ Retour AN"}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">
                  <PenTool className="h-4 w-4 mr-2" />
                  Signer et Transmettre
                </Button>
                <Button variant="outline">Détails</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
