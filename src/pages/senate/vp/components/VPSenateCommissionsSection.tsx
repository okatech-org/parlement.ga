import { Users, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const VPSenateCommissionsSection = () => {
  const commissions = [
    { name: "Commission des Collectivités", president: "Sen. Ndong", members: 12 },
    { name: "Commission des Finances", president: "Sen. Mba", members: 15 },
    { name: "Commission des Lois", president: "Sen. Ondo", members: 14 },
    { name: "Commission Affaires Sociales", president: "Sen. Nguema", members: 11 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Gestion Commissions</h1>
        <p className="text-muted-foreground">Supervision des commissions permanentes</p>
      </div>

      <div className="grid gap-4">
        {commissions.map((c, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Crown className="h-3 w-3" />{c.president}
                  </p>
                </div>
                <Badge variant="secondary"><Users className="h-3 w-3 mr-1" />{c.members}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
