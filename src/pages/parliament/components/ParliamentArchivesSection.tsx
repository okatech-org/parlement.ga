import { Search, FileText, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AnimatedDashboardCard } from "@/components/animations/DashboardAnimations";

export const ParliamentArchivesSection = () => {
  const archives = [
    {
      id: 1,
      reference: "LOI-2024-045",
      title: "Loi de finances pour l'exercice 2024",
      type: "Loi",
      adoptedAt: "22 Décembre 2023",
      promulgatedAt: "28 Décembre 2023",
      status: "promulgated"
    },
    {
      id: 2,
      reference: "LOI-2024-032",
      title: "Révision Constitutionnelle - Art. 47",
      type: "Loi Constitutionnelle",
      adoptedAt: "10 Octobre 2024",
      promulgatedAt: "15 Octobre 2024",
      status: "promulgated"
    },
    {
      id: 3,
      reference: "LOI-2024-028",
      title: "Réforme du Code Électoral",
      type: "Loi Organique",
      adoptedAt: "15 Novembre 2024",
      promulgatedAt: "20 Novembre 2024",
      status: "promulgated"
    },
    {
      id: 4,
      reference: "RES-2024-012",
      title: "Résolution sur la Paix en Afrique Centrale",
      type: "Résolution",
      adoptedAt: "05 Septembre 2024",
      promulgatedAt: "-",
      status: "adopted"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <AnimatedDashboardCard delay={0}>
        <DashboardHeader
          title="Archives Nationales"
          subtitle="Recherche dans le Journal Officiel et les textes adoptés"
          avatarInitial="ARC"
        />
      </AnimatedDashboardCard>

      <AnimatedDashboardCard delay={0.1}>
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            placeholder="Rechercher par mot-clé, référence ou date..."
            className="pl-10 py-6 text-lg bg-card shadow-sm border-primary/20 focus:border-primary transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Button size="sm" variant="ghost">Filtres avancés</Button>
          </div>
        </div>
      </AnimatedDashboardCard>

      <div className="grid gap-4">
        {archives.map((archive, index) => (
          <AnimatedDashboardCard key={archive.id} delay={0.2 + index * 0.05}>
            <Card className="hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer group bg-white dark:bg-card border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono bg-muted/50">{archive.reference}</Badge>
                      <Badge className={archive.type === 'Loi Constitutionnelle' ? 'bg-purple-500' : archive.type === 'Loi Organique' ? 'bg-blue-500' : 'bg-primary'}>
                        {archive.type}
                      </Badge>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                      {archive.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded">
                        <Calendar className="h-3.5 w-3.5" />
                        Adopté: {archive.adoptedAt}
                      </span>
                      {archive.promulgatedAt !== '-' && (
                        <span className="flex items-center gap-1.5 bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-1 rounded">
                          <FileText className="h-3.5 w-3.5" />
                          Promulgué: {archive.promulgatedAt}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity self-start sm:self-center shrink-0">
                    Consulter le document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimatedDashboardCard>
        ))}
      </div>
    </div>
  );
};
