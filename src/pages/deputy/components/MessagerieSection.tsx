import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Search, Phone, Video, MoreVertical, Send, Paperclip, Mic } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const MessagerieSection = () => {
    return (
        <div className="p-6 h-[calc(100vh-100px)] flex flex-col animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-serif font-bold mb-2">Messagerie Sécurisée</h1>
                <p className="text-muted-foreground">
                    Communications cryptées de bout en bout
                </p>
            </div>

            <Card className="flex-1 neu-raised flex overflow-hidden">

                {/* Sidebar List */}
                <div className="w-80 border-r border-border/50 flex flex-col bg-muted/10">
                    <div className="p-4 border-b border-border/50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Rechercher..." className="pl-9 bg-background" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {[
                            { name: "Président de l'Assemblée", msg: "Merci pour votre rapport.", time: "10:30", unread: 0, online: true },
                            { name: "Groupe Parlementaire", msg: "Réunion à 14h confirmée.", time: "Hier", unread: 2, online: false },
                            { name: "Commission Finances", msg: "Le document est disponible.", time: "Hier", unread: 0, online: false },
                            { name: "Assistant Parlementaire", msg: "J'ai préparé les dossiers.", time: "Lun", unread: 0, online: true },
                        ].map((chat, i) => (
                            <div key={i} className={`p-4 flex gap-3 hover:bg-muted/20 cursor-pointer transition-colors ${i === 1 ? 'bg-primary/5' : ''}`}>
                                <div className="relative">
                                    <Avatar>
                                        <AvatarFallback>{chat.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="font-semibold text-sm truncate">{chat.name}</span>
                                        <span className="text-xs text-muted-foreground">{chat.time}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-muted-foreground truncate">{chat.msg}</p>
                                        {chat.unread > 0 && (
                                            <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">{chat.unread}</Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-background">
                    {/* Header */}
                    <div className="p-4 border-b border-border/50 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarFallback>GP</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-bold text-sm">Groupe Parlementaire</h3>
                                <span className="text-xs text-green-500 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> En ligne
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon"><Phone className="w-5 h-5" /></Button>
                            <Button variant="ghost" size="icon"><Video className="w-5 h-5" /></Button>
                            <Button variant="ghost" size="icon"><MoreVertical className="w-5 h-5" /></Button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-muted/5">
                        <div className="flex justify-center">
                            <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">Aujourd'hui</span>
                        </div>

                        <div className="flex gap-3">
                            <Avatar className="w-8 h-8"><AvatarFallback>GP</AvatarFallback></Avatar>
                            <div className="bg-muted p-3 rounded-2xl rounded-tl-none max-w-[70%]">
                                <p className="text-sm">Bonjour Honorable, n'oubliez pas la réunion de groupe à 14h pour préparer la séance de questions au gouvernement.</p>
                                <span className="text-[10px] text-muted-foreground mt-1 block">10:00</span>
                            </div>
                        </div>

                        <div className="flex gap-3 flex-row-reverse">
                            <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-none max-w-[70%] shadow-md">
                                <p className="text-sm">Bien reçu. Je serai présent. J'ai préparé une question sur les infrastructures routières.</p>
                                <span className="text-[10px] text-primary-foreground/70 mt-1 block text-right">10:05</span>
                            </div>
                        </div>
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-border/50 bg-background">
                        <div className="flex gap-2 items-center">
                            <Button variant="ghost" size="icon"><Paperclip className="w-5 h-5" /></Button>
                            <Input placeholder="Écrivez votre message..." className="flex-1 rounded-full bg-muted/30 border-none focus-visible:ring-1" />
                            <Button variant="ghost" size="icon"><Mic className="w-5 h-5" /></Button>
                            <Button size="icon" className="rounded-full shadow-lg"><Send className="w-4 h-4 ml-0.5" /></Button>
                        </div>
                    </div>
                </div>

            </Card>
        </div>
    );
};
