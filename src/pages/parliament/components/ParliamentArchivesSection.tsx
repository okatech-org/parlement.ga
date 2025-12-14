import { BookOpen, Search, FileText, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const ParliamentArchivesSection = () => {
  const archives = [
    {
      id: 1,
      reference: "LOI-2024-045",
      title: "Loi de finances pour l'exercice 2024",
      type: "Loi",
      adoptedAt: "22 Décembre 2023",
      promulgatedAt: "28 Décembre 2023",
    },
    {
      id: 2,
      reference: "LOI-2024-032",
      title: "Révision Constitutionnelle - Art. 47",
      type: "Loi Constitutionnelle",
      adoptedAt: "10 Octobre 2024",
      promulgatedAt: "15 Octobre 2024",
    },
    {
      id: 3,
      reference: "LOI-2024-028",
      title: "Réforme du Code Électoral",
      type: "Loi Organique",
      adoptedAt: "15 Novembre 2024",
      promulgatedAt: "20 Novembre 2024",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
          Archives Nationales
        </h1>
        <p className="text-muted-foreground">
          Recherche dans le Journal Officiel et les textes adoptés
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Rechercher un texte de loi..." className="pl-10" />
      </div>

      <div className="grid gap-4">
        {archives.map((archive) => (
          <Card key={archive.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{archive.reference}</Badge>
                    <Badge className="bg-primary">{archive.type}</Badge>
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">{archive.title}</h3>
                  <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Adopté: {archive.adoptedAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      Promulgué: {archive.promulgatedAt}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Consulter
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
