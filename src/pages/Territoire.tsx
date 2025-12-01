import { useState } from "react";
import { Map as MapIcon, MapPin, ArrowLeft, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import GabonMap from "@/components/map/GabonMap";

const Territoire = () => {
  const navigate = useNavigate();
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  const provinces = [
    { name: "Estuaire", capital: "Libreville", population: "850 000", doleances: 45 },
    { name: "Haut-Ogooué", capital: "Franceville", population: "250 000", doleances: 32 },
    { name: "Moyen-Ogooué", capital: "Lambaréné", population: "70 000", doleances: 18 },
    { name: "Ngounié", capital: "Mouila", population: "100 000", doleances: 24 },
    { name: "Nyanga", capital: "Tchibanga", population: "52 000", doleances: 15 },
    { name: "Ogooué-Ivindo", capital: "Makokou", population: "63 000", doleances: 21 },
    { name: "Ogooué-Lolo", capital: "Koulamoutou", population: "65 000", doleances: 19 },
    { name: "Ogooué-Maritime", capital: "Port-Gentil", population: "140 000", doleances: 38 },
    { name: "Woleu-Ntem", capital: "Oyem", population: "154 000", doleances: 27 }
  ];

  const recentDoleances = [
    {
      id: 1,
      title: "Réhabilitation de l'école primaire de Kango",
      province: "Estuaire",
      status: "En traitement",
      priority: "Haute",
      date: "2025-02-15"
    },
    {
      id: 2,
      title: "Électrification du quartier PK12",
      province: "Estuaire",
      status: "Transmis au Ministère",
      priority: "Moyenne",
      date: "2025-02-10"
    },
    {
      id: 3,
      title: "Route Lastourville - Koulamoutou",
      province: "Ogooué-Lolo",
      status: "Reçu",
      priority: "Haute",
      date: "2025-02-08"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Transmis au Ministère":
        return "bg-primary/10 text-primary border-primary/20";
      case "En traitement":
        return "bg-secondary/10 text-secondary border-secondary/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Haute":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "Moyenne":
        return "bg-accent/10 text-accent-foreground border-accent/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Accueil
            </Button>
            <h1 className="text-lg font-serif font-bold">Gestion Territoriale</h1>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle doléance
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-card shadow-card-custom mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapIcon className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-serif font-bold">Carte du Gabon</h2>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrer
                </Button>
              </div>

              {/* Interactive Mapbox Map */}
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <GabonMap />
              </div>
            </Card>

            {/* Recent Doleances */}
            <Card className="p-6 bg-card shadow-card-custom">
              <h3 className="text-lg font-serif font-bold mb-4">Doléances Récentes</h3>
              <div className="space-y-4">
                {recentDoleances.map((doleance, index) => (
                  <Card
                    key={doleance.id}
                    className="p-4 bg-muted/30 border-l-4 border-l-primary hover:shadow-card-custom transition-all animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-semibold mb-1">{doleance.title}</h4>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {doleance.province}
                            </Badge>
                            <Badge variant="outline" className={`text-xs ${getStatusColor(doleance.status)}`}>
                              {doleance.status}
                            </Badge>
                            <Badge variant="outline" className={`text-xs ${getPriorityColor(doleance.priority)}`}>
                              {doleance.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{doleance.date}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>

          {/* Provinces List */}
          <div>
            <Card className="p-6 bg-card shadow-card-custom sticky top-24">
              <h3 className="text-lg font-serif font-bold mb-4">Provinces du Gabon</h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {provinces.map((province, index) => (
                  <Card
                    key={province.name}
                    className={`p-4 cursor-pointer transition-all border-l-4 hover:shadow-card-custom animate-fade-in ${
                      selectedProvince === province.name
                        ? "border-l-primary bg-primary/5"
                        : "border-l-transparent bg-muted/30"
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => setSelectedProvince(province.name)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{province.name}</h4>
                        <p className="text-xs text-muted-foreground">{province.capital}</p>
                      </div>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {province.doleances}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                      <span>{province.population} hab.</span>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Territoire;
