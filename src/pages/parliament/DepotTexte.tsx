import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNerve } from '@/hooks/useNerve';
import { useToast } from '@/hooks/use-toast';
import { FileText, Send, Loader2, CheckCircle } from 'lucide-react';

export default function DepotTexte() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        text_type: 'PROPOSITION_LOI',
        summary: '',
        content: '',
        origin_institution: 'ASSEMBLY'
    });

    // NEOCORTEX CONNECTION
    const { stimulate } = useNerve('LEGISLATIVE:TEXT_CREATED', (payload) => {
        setIsSubmitting(false);
        toast({
            title: "Texte déposé avec succès",
            description: `Référence: ${payload.text.reference}`,
            className: "bg-green-600 text-white"
        });
        // Reset form
        setFormData({ ...formData, title: '', summary: '', content: '' });
    });

    useNerve('LEGISLATIVE:ERROR', (payload) => {
        setIsSubmitting(false);
        toast({
            title: "Erreur de dépôt",
            description: payload.error,
            variant: "destructive"
        });
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Stimuler le système nerveux
        stimulate('LEGISLATIVE:SUBMIT_TEXT', formData);
    };

    return (
        <div className="container mx-auto p-6 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6 font-serif">Dépôt de Texte Législatif</h1>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Nouveau texte
                    </CardTitle>
                    <CardDescription>
                        Soumettez une nouvelle proposition ou un projet de loi au Bureau.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Type de texte / Origine</Label>
                            <div className="flex gap-4">
                                <Select
                                    value={formData.text_type}
                                    onValueChange={(v) => setFormData({ ...formData, text_type: v })}
                                >
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PROPOSITION_LOI">Proposition de Loi</SelectItem>
                                        <SelectItem value="PROJET_LOI">Projet de Loi</SelectItem>
                                        <SelectItem value="RESOLUTION">Résolution</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={formData.origin_institution}
                                    onValueChange={(v) => setFormData({ ...formData, origin_institution: v })}
                                >
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="Chambre" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ASSEMBLY">Assemblée Nationale</SelectItem>
                                        <SelectItem value="SENATE">Sénat</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Titre du texte</Label>
                            <Input
                                id="title"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="ex: Proposition de loi sur la modernisation..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="summary">Exposé des motifs (Résumé)</Label>
                            <Textarea
                                id="summary"
                                className="h-24"
                                value={formData.summary}
                                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Contenu du dispositif</Label>
                            <Textarea
                                id="content"
                                className="h-48 font-mono text-sm"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Transmission au système nerveux...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Déposer le texte
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
