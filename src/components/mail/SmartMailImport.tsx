import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Upload,
    Scan,
    FileText,
    CheckCircle2,
    Loader2,
    BrainCircuit,
    ArrowRight,
    FolderInput,
    AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface SmartMailImportProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = "upload" | "analyzing" | "review" | "filing" | "success";

const SmartMailImport = ({ isOpen, onClose }: SmartMailImportProps) => {
    const [step, setStep] = useState<Step>("upload");
    const [progress, setProgress] = useState(0);
    const [analysisData, setAnalysisData] = useState<any>(null);

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setStep("upload");
            setProgress(0);
            setAnalysisData(null);
        }
    }, [isOpen]);

    const handleSimulateScan = () => {
        setStep("analyzing");
        simulateAnalysis();
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setStep("analyzing");
            simulateAnalysis();
        }
    };

    const simulateAnalysis = () => {
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 5;
            setProgress(currentProgress);

            if (currentProgress >= 100) {
                clearInterval(interval);
                setAnalysisData({
                    sender: "Ministère de la Santé",
                    subject: "Rapport Annuel sur les Infrastructures Hospitalières",
                    date: "2025-11-28",
                    urgency: "Haute",
                    summary: "Le rapport détaille l'état des infrastructures hospitalières dans les provinces de l'Estuaire et du Woleu-Ntem. Il souligne un besoin urgent de rénovation pour 3 structures majeures et propose un budget prévisionnel pour 2026.",
                    suggestedPath: "/Documents/2025/Rapports/Santé",
                    tags: ["Santé", "Budget", "Infrastructures", "Urgent"]
                });
                setStep("review");
            }
        }, 150); // 3 seconds total
    };

    const handleConfirmFiling = () => {
        setStep("filing");
        setTimeout(() => {
            setStep("success");
            toast.success("Document traité et classé avec succès !");
        }, 1500);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5 text-cyan-600" />
                        Assistant Courrier Intelligent (iAsted)
                    </DialogTitle>
                    <DialogDescription>
                        Numérisation, analyse et classement automatique de vos courriers.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6">
                    {step === "upload" && (
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer group"
                                onClick={() => document.getElementById('file-upload')?.click()}
                            >
                                <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                    <Upload className="w-8 h-8 text-cyan-600" />
                                </div>
                                <h3 className="font-bold mb-1">Importer un fichier</h3>
                                <p className="text-xs text-muted-foreground">PDF, JPG, PNG</p>
                                <input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.jpg,.png"
                                    onChange={handleFileUpload}
                                />
                            </div>

                            <div
                                className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer group"
                                onClick={handleSimulateScan}
                            >
                                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                    <Scan className="w-8 h-8 text-purple-600" />
                                </div>
                                <h3 className="font-bold mb-1">Numériser</h3>
                                <p className="text-xs text-muted-foreground">Via scanner ou caméra</p>
                            </div>
                        </div>
                    )}

                    {step === "analyzing" && (
                        <div className="space-y-6 text-center py-8">
                            <div className="relative w-20 h-20 mx-auto">
                                <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin"></div>
                                <BrainCircuit className="absolute inset-0 m-auto w-8 h-8 text-cyan-600 animate-pulse" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-bold text-lg animate-pulse">Analyse par iAsted en cours...</h3>
                                <p className="text-sm text-muted-foreground">
                                    {progress < 30 ? "Lecture du document..." :
                                        progress < 60 ? "Extraction des entités..." :
                                            progress < 90 ? "Génération du résumé..." :
                                                "Finalisation..."}
                                </p>
                            </div>
                            <Progress value={progress} className="w-2/3 mx-auto h-2" />
                        </div>
                    )}

                    {step === "review" && analysisData && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="bg-cyan-50 dark:bg-cyan-900/10 p-4 rounded-lg border border-cyan-100 dark:border-cyan-800 mb-4">
                                <div className="flex items-start gap-3">
                                    <BrainCircuit className="w-5 h-5 text-cyan-600 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-sm text-cyan-800 dark:text-cyan-300">Analyse terminée</h4>
                                        <p className="text-xs text-cyan-600 dark:text-cyan-400">
                                            iAsted a extrait les informations suivantes. Veuillez vérifier avant classement.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Expéditeur</Label>
                                    <Input defaultValue={analysisData.sender} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Date du courrier</Label>
                                    <Input defaultValue={analysisData.date} type="date" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Objet</Label>
                                <Input defaultValue={analysisData.subject} />
                            </div>

                            <div className="space-y-2">
                                <Label>Résumé automatique</Label>
                                <Textarea defaultValue={analysisData.summary} className="h-24" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Urgence détectée</Label>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={analysisData.urgency === "Haute" ? "destructive" : "secondary"}>
                                            {analysisData.urgency}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Mots-clés</Label>
                                    <div className="flex flex-wrap gap-1">
                                        {analysisData.tags.map((tag: string, i: number) => (
                                            <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border">
                                <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm">
                                        <FolderInput className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Classement suggéré :</span>
                                    </div>
                                    <code className="text-xs bg-background px-2 py-1 rounded border border-border font-mono text-cyan-600">
                                        {analysisData.suggestedPath}
                                    </code>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === "filing" && (
                        <div className="space-y-6 text-center py-8">
                            <Loader2 className="w-12 h-12 text-cyan-600 animate-spin mx-auto" />
                            <h3 className="font-bold text-lg">Classement et indexation en cours...</h3>
                        </div>
                    )}

                    {step === "success" && (
                        <div className="space-y-6 text-center py-8 animate-scale-in">
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-2xl mb-2">Traitement Réussi !</h3>
                                <p className="text-muted-foreground max-w-sm mx-auto">
                                    Le document a été renommé, classé dans <strong>Documents</strong> et une copie a été placée dans votre <strong>iBoîte</strong>.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    {step === "review" && (
                        <>
                            <Button variant="outline" onClick={() => setStep("upload")}>Annuler</Button>
                            <Button onClick={handleConfirmFiling} className="bg-cyan-600 hover:bg-cyan-700 text-white gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Valider et Classer
                            </Button>
                        </>
                    )}
                    {step === "success" && (
                        <Button onClick={onClose} className="w-full">Fermer</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SmartMailImport;
