import { MessageSquare, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const VPSenateMessagerieSection = () => {
  const messages = [
    { id: 1, sender: "Présidence du Sénat", subject: "Suppléance demain", date: "Il y a 1h", unread: true },
    { id: 2, sender: "Commission Finances", subject: "Ordre du jour modifié", date: "Hier", unread: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Messagerie</h1>
          <p className="text-muted-foreground">Vos messages</p>
        </div>
        <Button><Send className="h-4 w-4 mr-2" />Nouveau</Button>
      </div>

      <div className="grid gap-3">
        {messages.map((m) => (
          <Card key={m.id} className={`cursor-pointer ${m.unread ? 'border-l-4 border-l-primary' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar><AvatarFallback>{m.sender[0]}</AvatarFallback></Avatar>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">{m.sender}</p>
                    <span className="text-xs text-muted-foreground">{m.date}</span>
                  </div>
                  <p className={`text-sm ${m.unread ? 'font-semibold' : ''}`}>{m.subject}</p>
                </div>
                {m.unread && <Badge>Nouveau</Badge>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
