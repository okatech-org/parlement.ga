import { Crown, CheckCircle, Calendar, Clock, FileText, ChevronRight, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

export const VPSenateSuppleanceSection = () => {
  const presidentAgenda = [
    { time: "09:00", title: "Audience Ambassadeur Chine", location: "Salon d'Honneur", delegate: false },
    { time: "11:00", title: "Conférence des Présidents", location: "Salle du Bureau", delegate: true, status: "Requis" },
    { time: "14:30", title: "Séance Plénière (Budget)", location: "Hémicycle", delegate: true, status: "Urgente" },
    { time: "17:00", title: "Entretien TV Gabon 24", location: "Bureau Président", delegate: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground mb-1">Suppléance Présidence</h1>
          <p className="text-muted-foreground">Gestion de l'intérim et délégation de pouvoirs</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-4 py-2 rounded-lg border border-amber-200 dark:border-amber-800">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Vacance momentanée du Président</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Status Control */}
        <Card className="border-t-4 border-t-primary md:col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Crown className="h-5 w-5 text-primary" />Statut Actif</CardTitle>
            <CardDescription>État de votre habilitation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/40 rounded-lg">
              <div className="space-y-1">
                <p className="font-medium text-sm">Mode Suppléance</p>
                <p className="text-xs text-muted-foreground">Pleins pouvoirs (Séances)</p>
              </div>
              <Switch checked={true} />
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-muted-foreground">Pouvoirs Délégués</h4>
              <div className="grid gap-2">
                {['Présidence Hémicycle', 'Signature Actes Admin', 'Représentation Extérieure'].map((p, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{p}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Ordonnancement Budget</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Presidential Agenda */}
        <Card className="md:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-amber-500" />
                Agenda du Président
              </div>
              <Badge variant="outline">Aujourd'hui</Badge>
            </CardTitle>
            <CardDescription>Événements nécessitant votre présence en suppléance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative border-l border-border ml-2 space-y-6">
              {presidentAgenda.map((event, i) => (
                <div key={i} className="ml-6 relative">
                  {/* Dot */}
                  <span className={`absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-background ${event.delegate ? 'bg-amber-500' : 'bg-muted-foreground/30'}`} />

                  <div className={`p-3 rounded-lg border ${event.delegate ? 'bg-card border-amber-200 dark:border-amber-900/50 shadow-sm' : 'bg-muted/20 border-transparent opacity-60'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold">{event.time}</span>
                        {event.delegate && <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] h-5 px-1.5">A Suppléer</Badge>}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" /> 1h
                      </div>
                    </div>
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Historique des Présidences</CardTitle>
          <Button variant="outline" size="sm">Voir tout</Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            {[
              { date: "10 Déc 2024", type: "Séance plénière", subject: "Vote Loi de Finances 2025", duration: "3h 15m" },
              { date: "05 Déc 2024", type: "Commission des Finances", subject: "Audition Ministre Économie", duration: "2h 30m" },
              { date: "28 Nov 2024", type: "Audience Protocolaire", subject: "Délégation Sénat Français", duration: "1h 00m" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b last:border-0 hover:bg-muted/40 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-secondary/50 text-secondary-foreground font-mono text-xs">
                    <span className="font-bold text-lg">{s.date.split(' ')[0]}</span>
                    <span>{s.date.split(' ')[1]}</span>
                  </div>
                  <div>
                    <h5 className="font-medium">{s.subject}</h5>
                    <p className="text-sm text-muted-foreground">{s.type}</p>
                  </div>
                </div>
                <div className="mt-2 sm:mt-0 flex items-center gap-4">
                  <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {s.duration}
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
