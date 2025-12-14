import { Shield, Globe, Users, FileText, Download, MapPin, Calendar, Plane } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

export const VPSenateDelegationsSection = () => {
  const upcomingDelegations = [
    { name: "Union Interparlementaire", destination: "Genève, Suisse", date: "20-22 Déc 2024", members: 5, status: "Confirmé" },
    { name: "Sommet CEMAC", destination: "Yaoundé, Cameroun", date: "15-17 Jan 2025", members: 4, status: "En attente OM" },
  ];

  const pastDelegations = [
    { name: "Groupe Amitié France-Gabon", destination: "Paris, France", date: "10-15 Nov 2024", reportAvailable: true },
    { name: "Conférence Climatique COP29", destination: "Bakou, Azerbaïdjan", date: "11-20 Nov 2024", reportAvailable: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground mb-1">Délégations Parlementaires</h1>
          <p className="text-muted-foreground">Suivi des missions internationales et rapports</p>
        </div>
        <Button>
          <Plane className="mr-2 h-4 w-4" />
          Nouvelle Mission
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Upcoming Missions */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-500" />
            Prochaines Missions
          </h3>
          {upcomingDelegations.map((d, i) => (
            <Card key={i} className="overflow-hidden hover:border-blue-500/50 transition-colors">
              <div className="flex flex-col md:flex-row">
                {/* Fake Map Visual */}
                <div className="md:w-32 bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center p-4">
                  <MapPin className="h-8 w-8 text-blue-500" />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg">{d.name}</h4>
                    <Badge variant={d.status === 'Confirmé' ? 'default' : 'outline'}>{d.status}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> {d.destination}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> {d.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" /> {d.members} délégués
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary">Voir ordre de mission</Button>
                    <Button size="sm" variant="outline">Liste des participants</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Reports Archive */}
        <div className="space-y-6">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-500" />
            Rapports Récents
          </h3>
          <Card>
            <CardContent className="p-0">
              {pastDelegations.map((d, i) => (
                <div key={i} className="p-4 border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-sm line-clamp-1">{d.name}</h5>
                    {d.reportAvailable ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-[10px]">Dispo</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">En rédaction</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {d.destination} • {d.date}
                  </p>
                  {d.reportAvailable ? (
                    <Button size="sm" variant="outline" className="w-full h-8 text-xs">
                      <Download className="mr-2 h-3 w-3" /> Télécharger PDF
                    </Button>
                  ) : (
                    <Button size="sm" variant="ghost" disabled className="w-full h-8 text-xs">
                      En attente de dépôt
                    </Button>
                  )}
                </div>
              ))}
              <div className="p-3">
                <Button variant="ghost" size="sm" className="w-full text-xs">Voir toutes les archives</Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </motion.div>
  );
};
