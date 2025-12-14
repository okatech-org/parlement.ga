import { FolderOpen, FileText, Download, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const ParliamentDocumentsSection = () => {
  const documents = [
    {
      id: 1,
      name: "CONG-2024-003 - Projet de révision constitutionnelle.pdf",
      type: "PDF",
      size: "3.2 MB",
      date: "12 Déc 2024",
      category: "Texte de loi",
    },
    {
      id: 2,
      name: "CMP-2024-007 - Tableau comparatif.pdf",
      type: "PDF",
      size: "1.5 MB",
      date: "10 Déc 2024",
      category: "CMP",
    },
    {
      id: 3,
      name: "Procès-verbal Congrès 15-11-2024.pdf",
      type: "PDF",
      size: "2.1 MB",
      date: "16 Nov 2024",
      category: "PV",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
          Documents
        </h1>
        <p className="text-muted-foreground">
          Documents officiels du Congrès et des CMP
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Rechercher un document..." className="pl-10" />
      </div>

      <div className="grid gap-3">
        {documents.map((doc) => (
          <Card key={doc.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{doc.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{doc.category}</Badge>
                      <span>{doc.size}</span>
                      <span>{doc.date}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
