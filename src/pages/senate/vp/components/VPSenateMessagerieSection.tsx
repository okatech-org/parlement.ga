import { MessageSquare, Send, Search, Star, Archive, Inbox, FileText, MoreVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

export const VPSenateMessagerieSection = () => {
  const messages = [
    { id: 1, sender: "Présidence du Sénat", subject: "URGENT : Activation Suppléance", preview: "Monsieur le Vice-Président, le Président vous prie de bien vouloir assurer...", date: "10:30", initial: "PS", unread: true },
    { id: 2, sender: "Commission Finances", subject: "Ordre du jour modifié - 17 Déc", preview: "Veuillez trouver ci-joint l'ordre du jour révisé pour la séance...", date: "Hier", initial: "CF", unread: false },
    { id: 3, sender: "Secrétariat Général", subject: "Note de Synthèse N°203", preview: "La note relative au projet de loi sur la décentralisation est disponible.", date: "12 Déc", initial: "SG", unread: false, attachment: true },
    { id: 4, sender: "Union Interparlementaire", subject: "Confirmation Délégation Genève", preview: "Nous avons le plaisir de confirmer votre accréditation pour...", date: "10 Déc", initial: "UI", unread: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[calc(100vh-120px)] flex flex-col gap-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground mb-1">Messagerie Officielle</h1>
          <p className="text-muted-foreground">Communications internes et diplomatiques</p>
        </div>
        <Button className="bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all">
          <Send className="h-4 w-4 mr-2" />
          Nouveau Message
        </Button>
      </div>

      <Card className="flex-1 overflow-hidden flex flex-col md:flex-row shadow-sm">
        {/* Sidebar */}
        <div className="w-full md:w-64 border-r bg-muted/10 p-4 flex flex-col gap-4">
          <Button variant="secondary" className="w-full justify-start font-medium">
            <Inbox className="mr-2 h-4 w-4" /> Boîte de réception
            <Badge className="ml-auto bg-primary text-primary-foreground">2</Badge>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <Send className="mr-2 h-4 w-4" /> Envoyés
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <Star className="mr-2 h-4 w-4" /> Favoris
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground pb-4 border-b">
            <Archive className="mr-2 h-4 w-4" /> Archives
          </Button>
        </div>

        {/* Message List */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Rechercher..." className="pl-9 bg-muted/20" />
            </div>
            <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="flex flex-col">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-start gap-4 p-4 border-b hover:bg-muted/40 transition-colors cursor-pointer ${m.unread ? 'bg-primary/5' : ''}`}
                >
                  <Avatar className="mt-0.5">
                    <AvatarFallback className={m.unread ? 'bg-primary text-primary-foreground' : ''}>{m.initial}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className={`text-sm truncate pr-2 ${m.unread ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}`}>
                        {m.sender}
                      </h4>
                      <span className={`text-xs whitespace-nowrap ${m.unread ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{m.date}</span>
                    </div>
                    <p className={`text-sm mb-1 ${m.unread ? 'font-semibold text-foreground' : 'font-medium text-foreground'}`}>{m.subject}</p>
                    <p className="text-xs text-muted-foreground truncate">{m.preview}</p>
                  </div>
                  {m.attachment && <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </Card>
    </motion.div>
  );
};
