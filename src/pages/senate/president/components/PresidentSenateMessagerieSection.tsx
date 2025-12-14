import { MessageSquare, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const PresidentSenateMessagerieSection = () => {
  const messages = [
    { id: 1, sender: "Présidence de la République", subject: "Convocation Conseil des Ministres", date: "Il y a 2h", unread: true },
    { id: 2, sender: "Président AN", subject: "Coordination CMP - Loi de finances", date: "Hier", unread: true },
    { id: 3, sender: "Secrétariat Général", subject: "Ordre du jour validé", date: "12 Déc", unread: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Messagerie</h1>
          <p className="text-muted-foreground">Communications officielles</p>
        </div>
        <Button><Send className="h-4 w-4 mr-2" />Nouveau message</Button>
      </div>

      <div className="grid gap-3">
        {messages.map((msg) => (
          <Card key={msg.id} className={`hover:shadow-lg transition-shadow cursor-pointer ${msg.unread ? 'border-l-4 border-l-primary' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar><AvatarFallback>{msg.sender[0]}</AvatarFallback></Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className={`font-medium ${msg.unread ? 'text-foreground' : 'text-muted-foreground'}`}>{msg.sender}</p>
                    <span className="text-xs text-muted-foreground">{msg.date}</span>
                  </div>
                  <p className={`text-sm ${msg.unread ? 'font-semibold' : ''}`}>{msg.subject}</p>
                </div>
                {msg.unread && <Badge className="bg-primary">Nouveau</Badge>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
