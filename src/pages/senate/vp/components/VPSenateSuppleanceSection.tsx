import { Crown, CheckCircle, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const VPSenateSuppleanceSection = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Suppléance Présidence</h1>
        <p className="text-muted-foreground">Gestion de la présidence par intérim</p>
      </div>

      <Card className="border-2 border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Crown className="h-5 w-5 text-primary" />Statut de suppléance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
            <div>
              <p className="font-medium">Mode suppléance</p>
              <p className="text-sm text-muted-foreground">Activer pour présider les séances</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique des suppléances</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { date: "10 Déc 2024", type: "Séance plénière", duration: "3h" },
            { date: "5 Déc 2024", type: "Commission des finances", duration: "2h" },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium">{s.type}</p>
                <p className="text-sm text-muted-foreground">{s.date}</p>
              </div>
              <Badge variant="secondary">{s.duration}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
