import { Settings, User, Bell, Shield, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const SenatorParametresSection = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
          Paramètres
        </h1>
        <p className="text-muted-foreground">
          Gérez vos préférences et informations personnelles
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations Personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input defaultValue="Marie Ndong" disabled />
            </div>
            <div className="space-y-2">
              <Label>Email officiel</Label>
              <Input defaultValue="m.ndong@senat.ga" disabled />
            </div>
            <div className="space-y-2">
              <Label>Province</Label>
              <Input defaultValue="Woleu-Ntem" disabled />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Alertes navette</Label>
                <p className="text-sm text-muted-foreground">Nouveaux textes en navette</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Convocations</Label>
                <p className="text-sm text-muted-foreground">Séances et commissions</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Doléances</Label>
                <p className="text-sm text-muted-foreground">Nouvelles doléances citoyennes</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
