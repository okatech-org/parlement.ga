import { Gavel, ArrowLeftRight, AlertTriangle, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const PresidentSenateCMPSection = () => {
  const disagreements = [
    {
      id: 1,
      reference: "PL-2024-038",
      title: "Code de la fonction publique territoriale",
      shuttles: 3,
      status: "disagreement",
    },
  ];

  const activeCMPs = [
    {
      id: 1,
      reference: "CMP-2024-007",
      title: "Loi de Finances 2025",
      members: { senators: 7, deputies: 7 },
      progress: 45,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
          Convocation CMP
        </h1>
        <p className="text-muted-foreground">
          Gestion des Commissions Mixtes Paritaires
        </p>
      </div>

      <Card className="border-l-4 border-l-amber-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Textes en désaccord
          </CardTitle>
          <CardDescription>Textes nécessitant une CMP</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {disagreements.map((text) => (
            <div key={text.id} className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Badge variant="outline">{text.reference}</Badge>
                  <h4 className="font-medium mt-1">{text.title}</h4>
                  <p className="text-xs text-amber-600 mt-1">{text.shuttles} navettes - Désaccord persistant</p>
                </div>
                <Badge className="bg-amber-500">À convoquer</Badge>
              </div>
              <Button className="w-full bg-amber-600 hover:bg-amber-700">
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                Convoquer la CMP (7+7)
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gavel className="h-5 w-5 text-primary" />
            CMP en cours
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeCMPs.map((cmp) => (
            <div key={cmp.id} className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Badge>{cmp.reference}</Badge>
                <Badge variant="secondary">
                  <Users className="h-3 w-3 mr-1" />
                  {cmp.members.senators}S + {cmp.members.deputies}D
                </Badge>
              </div>
              <h4 className="font-medium">{cmp.title}</h4>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${cmp.progress}%` }} />
                </div>
                <span className="text-sm font-medium">{cmp.progress}%</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
