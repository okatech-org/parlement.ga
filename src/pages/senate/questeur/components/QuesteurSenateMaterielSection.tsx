import { Package, Car, Computer, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const QuesteurSenateMaterielSection = () => {
  const inventory = [
    { category: "Véhicules", total: 25, available: 18, maintenance: 7 },
    { category: "Informatique", total: 150, available: 142, maintenance: 8 },
    { category: "Mobilier", total: 500, available: 485, maintenance: 15 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Gestion Matériel</h1>
          <p className="text-muted-foreground">Inventaire et suivi du matériel</p>
        </div>
        <Button>Nouvelle demande</Button>
      </div>

      <div className="grid gap-4">
        {inventory.map((item, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{item.category}</h3>
                  <p className="text-sm text-muted-foreground">Total: {item.total} unités</p>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-green-500">{item.available} disponibles</Badge>
                  <Badge variant="secondary">{item.maintenance} en maintenance</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
