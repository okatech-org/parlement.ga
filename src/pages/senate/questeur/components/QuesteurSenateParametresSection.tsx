import { Settings, User, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const QuesteurSenateParametresSection = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Paramètres</h1>
        <p className="text-muted-foreground">Configuration</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Informations</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Nom</Label><Input defaultValue="Jean Massard" disabled /></div>
            <div className="space-y-2"><Label>Fonction</Label><Input defaultValue="Questeur" disabled /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" />Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div><Label>Budget</Label><p className="text-sm text-muted-foreground">Alertes seuils</p></div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div><Label>Marchés</Label><p className="text-sm text-muted-foreground">Échéances</p></div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
