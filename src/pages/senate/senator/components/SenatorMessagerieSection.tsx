import { MessageSquare, Send, Inbox, Archive } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const SenatorMessagerieSection = () => {
  const messages = [
    {
      id: 1,
      sender: "Cabinet du Président",
      subject: "Convocation séance extraordinaire",
      preview: "Vous êtes convoqué à une séance extraordinaire...",
      date: "Il y a 2h",
      unread: true,
    },
    {
      id: 2,
      sender: "Commission des Collectivités",
      subject: "Ordre du jour - 15 décembre",
      preview: "Veuillez trouver ci-joint l'ordre du jour...",
      date: "Hier",
      unread: true,
    },
    {
      id: 3,
      sender: "Greffe du Sénat",
      subject: "Documents de la navette PL-2024-045",
      preview: "Les documents relatifs au projet de loi...",
      date: "12 Déc",
      unread: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
            Messagerie
          </h1>
          <p className="text-muted-foreground">
            Vos messages et notifications
          </p>
        </div>
        <Button>
          <Send className="h-4 w-4 mr-2" />
          Nouveau message
        </Button>
      </div>

      <div className="grid gap-3">
        {messages.map((message) => (
          <Card key={message.id} className={`hover:shadow-lg transition-shadow cursor-pointer ${message.unread ? 'border-l-4 border-l-primary' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback>{message.sender[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`font-medium ${message.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {message.sender}
                    </p>
                    <span className="text-xs text-muted-foreground">{message.date}</span>
                  </div>
                  <p className={`text-sm ${message.unread ? 'font-semibold' : ''}`}>{message.subject}</p>
                  <p className="text-sm text-muted-foreground truncate">{message.preview}</p>
                </div>
                {message.unread && <Badge className="bg-primary">Nouveau</Badge>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
