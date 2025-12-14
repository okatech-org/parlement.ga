import { Users, Crown, Calendar, ArrowRight, FileText, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export const VPSenateCommissionsSection = () => {
  const commissions = [
    {
      name: "Commission des Finances",
      president: "Sen. Jean-Paul Mba",
      members: 15,
      status: "Active",
      nextMeeting: "16 Déc à 10h00",
      topic: "Budget 2025",
      progress: 85,
      target: 20
    },
    {
      name: "Commission des Lois",
      president: "Sen. Marie Ondo",
      members: 14,
      status: "Active",
      nextMeeting: "17 Déc à 14h30",
      topic: "Code Décentralisation",
      progress: 40,
      target: 15
    },
    {
      name: "Commission Affaires Sociales",
      president: "Sen. Paul Nguema",
      members: 11,
      status: "En pause",
      nextMeeting: "10 Jan 2025",
      topic: "N/A",
      progress: 90,
      target: 12
    },
    {
      name: "Commission Collectivités Locales",
      president: "Sen. Alice Ndong",
      members: 12,
      status: "Active",
      nextMeeting: "18 Déc à 09h00",
      topic: "Aménagement Territoire",
      progress: 20,
      target: 10
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground mb-1">Gestion des Commissions</h1>
          <p className="text-muted-foreground">Supervision des travaux des commissions permanentes</p>
        </div>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Calendrier Global
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {commissions.map((c, i) => (
          <Card key={i} className={`hover:shadow-md transition-all duration-300 border-t-4 ${c.status === 'Active' ? 'border-t-green-500' : 'border-t-slate-300'}`}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Badge variant={c.status === 'Active' ? 'default' : 'secondary'} className={c.status === 'Active' ? 'bg-green-500 hover:bg-green-600' : ''}>
                  {c.status}
                </Badge>
                <div className="flex items-center text-muted-foreground text-xs">
                  <Users className="h-3 w-3 mr-1" /> {c.members} membres
                </div>
              </div>
              <CardTitle className="text-lg mt-2">{c.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Crown className="h-3 w-3 text-amber-500" /> Présidée par {c.president}
              </CardDescription>
            </CardHeader>
            <CardContent className="py-2">
              <div className="space-y-4">
                {/* Next Meeting */}
                <div className="p-3 bg-muted/30 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-background border flex items-center justify-center text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Prochaine Réunion</p>
                      <p className="text-sm font-semibold">{c.nextMeeting}</p>
                    </div>
                  </div>
                  {c.status === 'Active' && <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">{c.topic}</Badge>}
                </div>

                {/* Progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Textes traités (Session)</span>
                    <span className="font-medium">{Math.floor((c.progress / 100) * c.target)} / {c.target}</span>
                  </div>
                  <Progress value={c.progress} className="h-2" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button variant="ghost" size="sm" className="w-full justify-between hover:bg-muted/50">
                Voir les détails <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};
