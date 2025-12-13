import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Mic2, FileText, Send, Clock, CheckCircle, Plus, Loader2 } from "lucide-react";
import { LegislativeSkills, SkillActivationSignal } from "@/Cortex/Skills";
import { iAstedSoul } from "@/Consciousness";
import { toast } from "sonner";

const MINISTRIES = [
  "Ministère de l'Intérieur",
  "Ministère des Finances",
  "Ministère de l'Éducation Nationale",
  "Ministère de la Santé",
  "Ministère des Travaux Publics",
  "Ministère de l'Agriculture",
  "Ministère de l'Environnement",
  "Ministère de la Défense",
  "Ministère des Affaires Étrangères"
];

export const QuestionsSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [questionType, setQuestionType] = useState<'orale' | 'ecrite'>('orale');
  const [formData, setFormData] = useState({
    ministry: '',
    subject: '',
    questionText: ''
  });

  const handleSubmitQuestion = async () => {
    if (!formData.ministry || !formData.subject || !formData.questionText) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsSubmitting(true);

    // Créer le signal d'activation
    const signal: SkillActivationSignal = {
      skillName: 'PrepareGovernmentQuestion',
      activatedBy: 'click',
      soulState: iAstedSoul.getState(),
      timestamp: new Date(),
      priority: 'normal'
    };

    // Activer iAsted si nécessaire
    if (!iAstedSoul.getState().isAwake) {
      iAstedSoul.awaken();
    }

    try {
      const result = await LegislativeSkills.prepareGovernmentQuestion(signal, {
        type: questionType,
        ministry: formData.ministry,
        subject: formData.subject,
        questionText: formData.questionText,
        authorId: 'current-user'
      });

      if (result.success) {
        toast.success(result.vocalFeedback);
        setDialogOpen(false);
        setFormData({ ministry: '', subject: '', questionText: '' });
      } else {
        toast.error(result.error || "Erreur lors de la soumission");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Questions au Gouvernement</h1>
        <p className="text-muted-foreground">
          Contrôle de l'action gouvernementale : Questions Orales et Écrites
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Questions Orales */}
        <Card className="p-6 neu-raised h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Mic2 className="text-primary" /> Questions Orales
            </h3>
            <Dialog open={dialogOpen && questionType === 'orale'} onOpenChange={(open) => {
              setDialogOpen(open);
              if (open) setQuestionType('orale');
            }}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" /> Nouvelle Question
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Question Orale au Gouvernement</DialogTitle>
                  <DialogDescription>
                    Préparez votre question pour la prochaine séance de QAG
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="ministry">Ministère concerné</Label>
                    <Select
                      value={formData.ministry}
                      onValueChange={(value) => setFormData({ ...formData, ministry: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un ministère" />
                      </SelectTrigger>
                      <SelectContent>
                        {MINISTRIES.map((m) => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet</Label>
                    <Input
                      id="subject"
                      placeholder="Ex: Réhabilitation des lycées techniques"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="question">Texte de la question</Label>
                    <Textarea
                      id="question"
                      placeholder="Rédigez votre question au gouvernement..."
                      rows={5}
                      value={formData.questionText}
                      onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleSubmitQuestion} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Soumettre
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-primary/5 p-4 rounded-xl mb-6 border border-primary/10">
            <h4 className="font-bold text-primary mb-2">Prochaine séance de QAG</h4>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Mardi 17 Décembre à 15h00</span>
              <Badge>Séance Publique</Badge>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              Vous avez <strong>1</strong> question inscrite à l'ordre du jour.
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Vos dernières interventions</h4>
            <div className="p-4 neu-inset rounded-xl">
              <div className="flex justify-between mb-2">
                <Badge variant="outline">Éducation</Badge>
                <span className="text-xs text-muted-foreground">28 Nov 2024</span>
              </div>
              <p className="font-medium text-sm mb-2">Sur la réhabilitation des lycées techniques de l'Estuaire.</p>
              <div className="flex items-center gap-2 text-xs text-green-600">
                <CheckCircle className="w-3 h-3" /> Réponse du Ministre obtenue
              </div>
            </div>
          </div>
        </Card>

        {/* Questions Écrites */}
        <Card className="p-6 neu-raised h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <FileText className="text-secondary" /> Questions Écrites
            </h3>
            <Dialog open={dialogOpen && questionType === 'ecrite'} onOpenChange={(open) => {
              setDialogOpen(open);
              if (open) setQuestionType('ecrite');
            }}>
              <DialogTrigger asChild>
                <Button size="sm" variant="secondary">
                  <Plus className="w-4 h-4 mr-2" /> Rédiger
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Question Écrite au Gouvernement</DialogTitle>
                  <DialogDescription>
                    Les questions écrites reçoivent une réponse dans un délai de 2 mois
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="ministry2">Ministère concerné</Label>
                    <Select
                      value={formData.ministry}
                      onValueChange={(value) => setFormData({ ...formData, ministry: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un ministère" />
                      </SelectTrigger>
                      <SelectContent>
                        {MINISTRIES.map((m) => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject2">Objet de la question</Label>
                    <Input
                      id="subject2"
                      placeholder="Ex: Desserte en eau potable"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="question2">Texte complet de la question</Label>
                    <Textarea
                      id="question2"
                      placeholder="Détaillez votre question écrite..."
                      rows={6}
                      value={formData.questionText}
                      onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleSubmitQuestion} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Envoyer
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 neu-inset rounded-lg">
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-xs text-muted-foreground">Posées (2025)</div>
            </div>
            <div className="text-center p-3 neu-inset rounded-lg">
              <div className="text-2xl font-bold text-orange-500">2</div>
              <div className="text-xs text-muted-foreground">En attente</div>
            </div>
            <div className="text-center p-3 neu-inset rounded-lg">
              <div className="text-2xl font-bold text-green-500">10</div>
              <div className="text-xs text-muted-foreground">Répondues</div>
            </div>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-2">
            {[
              { status: "waiting", title: "Desserte en eau potable à Oyem", date: "Il y a 15 jours" },
              { status: "waiting", title: "Entretien de la route nationale 2", date: "Il y a 20 jours" },
              { status: "answered", title: "Postes budgétaires Santé", date: "Répondu le 10/11" },
            ].map((q, i) => (
              <div key={i} className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm line-clamp-1">{q.title}</span>
                  {q.status === 'waiting' ? (
                    <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground">{q.date}</div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
};
