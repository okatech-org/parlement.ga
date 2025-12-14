import { useState } from "react";
import { Calendar, Clock, MapPin, Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

export const VPSenateAgendaSection = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Mock events logic (in a real app, filter by date)
  const events = [
    { id: 1, title: "Séance Plénière (Suppléance)", date: "Aujourd'hui", time: "09:00 - 12:00", location: "Hémicycle", type: "Officiel", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
    { id: 2, title: "Déjeuner de Travail - Commission Lois", date: "Aujourd'hui", time: "12:30 - 14:00", location: "Salon des Pas Perdus", type: "Interne", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
    { id: 3, title: "Réunion Préparatoire Délégation", date: "Demain", time: "16:00 - 17:30", location: "Salle B", type: "Diplomatie", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground mb-1">Agenda Parlementaire</h1>
          <p className="text-muted-foreground">Planning des séances et engagements officiels</p>
        </div>
        <div className="flex gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Rechercher un événement..." className="pl-9 h-9" />
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nouvel Événement
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
        {/* Calendar View */}
        <Card className="md:col-span-3 lg:col-span-2 shadow-sm h-fit">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Calendrier</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex justify-center pb-4">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border-none"
            />
          </CardContent>
        </Card>

        {/* Events List */}
        <Card className="md:col-span-4 lg:col-span-5 shadow-sm border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Programme du {date?.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </CardTitle>
            <CardDescription>3 événements prévus ce jour</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {events.map(event => (
              <div key={event.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                <div className="flex sm:flex-col items-center sm:items-start min-w-[100px] gap-2 sm:gap-0">
                  <span className="font-mono font-bold text-lg">{event.time.split(' - ')[0]}</span>
                  <span className="text-xs text-muted-foreground hidden sm:block">{event.time.split(' - ')[1]}</span>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-base">{event.title}</h4>
                    <Badge variant="secondary" className={`${event.color} border-none`}>{event.type}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};
