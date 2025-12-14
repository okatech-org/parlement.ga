import { Shield, Globe, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const VPSenateDelegationsSection = () => {
  const delegations = [
    { name: "Délégation UIP", destination: "Genève", date: "20-22 Déc 2024", members: 5 },
    { name: "Délégation CEMAC", destination: "Yaoundé", date: "15-17 Jan 2025", members: 4 },
    { name: "Délégation France-Gabon", destination: "Paris", date: "5-8 Fév 2025", members: 6 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Délégations</h1>
        <p className="text-muted-foreground">Gestion des délégations parlementaires</p>
      </div>

      <div className="grid gap-4">
        {delegations.map((d, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{d.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Globe className="h-3 w-3" />{d.destination}
                  </p>
                  <p className="text-sm text-muted-foreground">{d.date}</p>
                </div>
                <Badge variant="secondary"><Users className="h-3 w-3 mr-1" />{d.members}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
