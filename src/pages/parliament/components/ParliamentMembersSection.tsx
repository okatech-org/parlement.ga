import { Users, Crown, Scale, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ParliamentMembersSection = () => {
  const deputies = [
    { id: 1, name: "Jean-Pierre Oyiba", constituency: "Libreville Est", group: "PDG" },
    { id: 2, name: "Marie Antoinette", constituency: "Franceville", group: "CLR" },
    { id: 3, name: "Paul Ndong", constituency: "Port-Gentil", group: "PDG" },
  ];

  const senators = [
    { id: 1, name: "Marie Ndong", province: "Woleu-Ntem", group: "PDG" },
    { id: 2, name: "Jacques Mbourou", province: "Estuaire", group: "CLR" },
    { id: 3, name: "Alice Nguema", province: "Ogooué-Maritime", group: "PDG" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
          Membres du Parlement
        </h1>
        <p className="text-muted-foreground">
          Députés et Sénateurs de la République Gabonaise
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Rechercher un membre..." className="pl-10" />
      </div>

      <Tabs defaultValue="deputies">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="deputies">Députés (145)</TabsTrigger>
          <TabsTrigger value="senators">Sénateurs (102)</TabsTrigger>
        </TabsList>

        <TabsContent value="deputies" className="mt-4">
          <div className="grid gap-3">
            {deputies.map((deputy) => (
              <Card key={deputy.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{deputy.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{deputy.name}</p>
                      <p className="text-sm text-muted-foreground">{deputy.constituency}</p>
                    </div>
                    <Badge variant="secondary">{deputy.group}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="senators" className="mt-4">
          <div className="grid gap-3">
            {senators.map((senator) => (
              <Card key={senator.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{senator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{senator.name}</p>
                      <p className="text-sm text-muted-foreground">{senator.province}</p>
                    </div>
                    <Badge variant="secondary">{senator.group}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
