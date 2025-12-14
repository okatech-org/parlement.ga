import { Banknote, Users, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const QuesteurSenateIndemnitesSection = () => {
  const indemnities = [
    { type: "Indemnités parlementaires", beneficiaries: 102, status: "paid", month: "Décembre 2024" },
    { type: "Frais de mission", beneficiaries: 15, status: "pending", month: "Décembre 2024" },
    { type: "Indemnités de fonction", beneficiaries: 8, status: "paid", month: "Décembre 2024" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Indemnités</h1>
        <p className="text-muted-foreground">Gestion des indemnités sénatoriales</p>
      </div>

      <div className="grid gap-4">
        {indemnities.map((ind, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{ind.type}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" />{ind.beneficiaries} bénéficiaires - {ind.month}
                  </p>
                </div>
                <Badge className={ind.status === 'paid' ? 'bg-green-500' : 'bg-amber-500'}>
                  {ind.status === 'paid' ? <><CheckCircle className="h-3 w-3 mr-1" />Payé</> : <><Clock className="h-3 w-3 mr-1" />En cours</>}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
