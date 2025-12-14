import { Building, Users, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const QuesteurSenateServicesSection = () => {
  const services = [
    { name: "Service du Personnel", responsable: "M. Obiang", effectif: 45, contact: "personnel@senat.ga" },
    { name: "Service Logistique", responsable: "Mme Nzoghe", effectif: 32, contact: "logistique@senat.ga" },
    { name: "Service Informatique", responsable: "M. Mba", effectif: 12, contact: "dsi@senat.ga" },
    { name: "Service Protocole", responsable: "M. Ondo", effectif: 18, contact: "protocole@senat.ga" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Services Administratifs</h1>
        <p className="text-muted-foreground">Gestion des services du Sénat</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {services.map((s, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold">{s.name}</h3>
                <Badge variant="secondary"><Users className="h-3 w-3 mr-1" />{s.effectif}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Responsable: {s.responsable}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Mail className="h-3 w-3" />{s.contact}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
