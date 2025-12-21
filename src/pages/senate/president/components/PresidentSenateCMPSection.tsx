import { Gavel, ArrowLeftRight, AlertTriangle, Users, Calendar, CheckSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AnimatedDashboardCard } from "@/components/animations/DashboardAnimations";

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

  const handleConvocation = (reference: string) => {
    toast.success(`CMP convoquée pour ${reference}`, {
      description: "Les invitations ont été envoyées aux membres."
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-1">
          Convocation CMP
        </h1>
        <p className="text-muted-foreground text-sm">
          Gestion des Commissions Mixtes Paritaires en cas de navette infructueuse
        </p>
      </div>

      <AnimatedDashboardCard delay={0.1}>
        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Textes en désaccord (Urgent)
            </CardTitle>
            <CardDescription>Textes nécessitant une convocation immédiate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {disagreements.map((text) => (
              <div key={text.id} className="p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-lg border border-amber-200/50 dark:border-amber-800/50 hover:border-amber-500/50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-background">{text.reference}</Badge>
                      <Badge variant="secondary" className="text-amber-700 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400">
                        {text.shuttles} navettes
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-lg">{text.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Le Sénat et l'Assemblée Nationale n'ont pu s'accorder sur la version finale.
                    </p>
                  </div>
                  <Button
                    className="bg-amber-600 hover:bg-amber-700 shrink-0"
                    onClick={() => handleConvocation(text.reference)}
                  >
                    <ArrowLeftRight className="h-4 w-4 mr-2" />
                    Convoquer la CMP
                  </Button>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-amber-200/30">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Composition : 7 Sénateurs + 7 Députés
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Délai : 7 jours
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </AnimatedDashboardCard>

      <AnimatedDashboardCard delay={0.2}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Gavel className="h-5 w-5 text-primary" />
              CMP en cours
            </CardTitle>
            <CardDescription>Suivi des travaux des commissions mixtes</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {activeCMPs.map((cmp) => (
              <div key={cmp.id} className="p-4 bg-muted/40 rounded-lg border border-border/50 hover:bg-muted/60 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{cmp.reference}</Badge>
                    <span className="font-medium text-sm">{cmp.title}</span>
                  </div>
                  <Badge variant="secondary" className="gap-1">
                    <Users className="h-3 w-3" />
                    {cmp.members.senators}S + {cmp.members.deputies}D
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Avancement des négociations</span>
                    <span>{cmp.progress}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                      <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${cmp.progress}%` }} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="ghost" size="sm" className="h-8">Voir le rapport</Button>
                  <Button variant="outline" size="sm" className="h-8">
                    <CheckSquare className="h-3.5 w-3.5 mr-1.5" />
                    Superviser
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </AnimatedDashboardCard>
    </div>
  );
};
