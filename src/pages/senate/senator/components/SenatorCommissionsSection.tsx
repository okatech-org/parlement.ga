import { Users, Crown, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const SenatorCommissionsSection = () => {
  const commissions = [
    {
      id: 1,
      name: "Commission des Collectivités Territoriales",
      role: "Membre",
      members: 12,
      nextMeeting: "15 Déc 2024",
    },
    {
      id: 2,
      name: "Commission des Finances",
      role: "Vice-Président",
      members: 15,
      nextMeeting: "17 Déc 2024",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
          Mes Commissions
        </h1>
        <p className="text-muted-foreground">
          Commissions permanentes auxquelles vous appartenez
        </p>
      </div>

      <div className="grid gap-4">
        {commissions.map((commission) => (
          <Card key={commission.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">
                      {commission.role === "Vice-Président" && <Crown className="h-3 w-3 mr-1" />}
                      {commission.role}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">{commission.name}</h3>
                  <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {commission.members} membres
                    </span>
                    <span>Prochaine réunion: {commission.nextMeeting}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
