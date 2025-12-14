import { useState, useEffect } from "react";
import {
    Vote, CheckCircle, XCircle, Minus, Scale, Users,
    Shield, Clock, AlertTriangle, Lock, Fingerprint,
    Landmark, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface CongressVoteProps {
    sessionId?: string;
}

/**
 * Interface de Vote du Congrès
 * Pour les révisions constitutionnelles avec majorité qualifiée
 */
const CongressVote = ({ sessionId }: CongressVoteProps) => {
    const [hasVoted, setHasVoted] = useState(false);
    const [userVote, setUserVote] = useState<"for" | "against" | "abstain" | null>(null);
    const [pinDialogOpen, setPinDialogOpen] = useState(false);
    const [pin, setPin] = useState("");
    const [pendingVote, setPendingVote] = useState<"for" | "against" | "abstain" | null>(null);

    // Données de la session (simulées)
    const session = {
        reference: "CONG-2024-003",
        title: "Révision Constitutionnelle - Article 47",
        subtitle: "Autonomie renforcée des collectivités territoriales",
        majorityType: "THREE_FIFTHS" as const, // ou "TWO_THIRDS"
        majorityLabel: "Trois-Cinquièmes (60%)",
        majorityPercent: 60,
        status: "IN_PROGRESS",
    };

    // Résultats en temps réel (simulés)
    const [results, setResults] = useState({
        totalEligible: 245, // 143 députés + 102 sénateurs
        totalPresent: 198,
        votesFor: 142,
        votesAgainst: 31,
        votesAbstain: 18,
        notVoted: 7,
        // Par chambre
        deputiesPresent: 120,
        deputiesFor: 95,
        deputiesAgainst: 15,
        senatorsPresent: 78,
        senatorsFor: 47,
        senatorsAgainst: 16,
    });

    // Calculs de majorité
    const totalExpressed = results.votesFor + results.votesAgainst;
    const currentPercent = totalExpressed > 0
        ? Math.round((results.votesFor / totalExpressed) * 100)
        : 0;
    const requiredVotes = Math.ceil(totalExpressed * (session.majorityPercent / 100));
    const isAdopted = results.votesFor >= requiredVotes;
    const remainingForAdoption = Math.max(0, requiredVotes - results.votesFor);

    // Simulation des sièges (hémicycle unifié)
    const generateSeats = () => {
        const seats = [];
        // Députés (premier bloc)
        for (let i = 0; i < 143; i++) {
            const status = i < results.deputiesFor ? "for"
                : i < results.deputiesFor + results.deputiesAgainst ? "against"
                    : i < results.deputiesPresent ? "abstain"
                        : "absent";
            seats.push({ id: `d-${i}`, chamber: "ASSEMBLY", status });
        }
        // Sénateurs (second bloc)
        for (let i = 0; i < 102; i++) {
            const status = i < results.senatorsFor ? "for"
                : i < results.senatorsFor + results.senatorsAgainst ? "against"
                    : i < results.senatorsPresent ? "abstain"
                        : "absent";
            seats.push({ id: `s-${i}`, chamber: "SENATE", status });
        }
        return seats;
    };

    const seats = generateSeats();

    // Initier le vote (ouvre le dialogue de confirmation)
    const initiateVote = (vote: "for" | "against" | "abstain") => {
        setPendingVote(vote);
        setPinDialogOpen(true);
    };

    // Confirmer le vote avec PIN
    const confirmVote = () => {
        if (pin.length !== 6) return;

        setUserVote(pendingVote);
        setHasVoted(true);
        setPinDialogOpen(false);
        setPin("");

        // Mettre à jour les résultats (simulation)
        if (pendingVote === "for") {
            setResults(r => ({ ...r, votesFor: r.votesFor + 1, notVoted: r.notVoted - 1 }));
        } else if (pendingVote === "against") {
            setResults(r => ({ ...r, votesAgainst: r.votesAgainst + 1, notVoted: r.notVoted - 1 }));
        } else {
            setResults(r => ({ ...r, votesAbstain: r.votesAbstain + 1, notVoted: r.notVoted - 1 }));
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Header Solennel */}
            <header className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 border-b border-blue-800 py-6">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-blue-800/50 flex items-center justify-center border-2 border-blue-600">
                                <Vote className="h-8 w-8 text-blue-300" />
                            </div>
                            <div>
                                <Badge className="bg-amber-500 text-black mb-1">{session.reference}</Badge>
                                <h1 className="text-2xl font-serif font-bold">{session.title}</h1>
                                <p className="text-blue-300 text-sm">{session.subtitle}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <Badge variant="outline" className="border-blue-500 text-blue-300 mb-2">
                                {session.majorityLabel}
                            </Badge>
                            <div className="flex items-center gap-2 text-sm text-blue-200">
                                <Clock className="h-4 w-4" />
                                <span>Vote en cours</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Colonne Principale : Jauge de Majorité */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Grande Jauge */}
                        <Card className="bg-slate-800 border-slate-700 overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-blue-900 to-slate-800 border-b border-slate-700">
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Scale className="h-5 w-5" />
                                    Progression vers l'adoption
                                </CardTitle>
                                <CardDescription className="text-blue-200">
                                    Seuil requis : {session.majorityLabel} des suffrages exprimés
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="relative h-16 bg-slate-700 rounded-full overflow-hidden mb-4">
                                    {/* Barre de progression */}
                                    <div
                                        className={cn(
                                            "absolute inset-y-0 left-0 transition-all duration-500 rounded-full",
                                            isAdopted ? "bg-gradient-to-r from-green-500 to-emerald-400" : "bg-gradient-to-r from-blue-600 to-blue-400"
                                        )}
                                        style={{ width: `${currentPercent}%` }}
                                    />
                                    {/* Ligne de seuil */}
                                    <div
                                        className="absolute inset-y-0 w-1 bg-white/50 z-10"
                                        style={{ left: `${session.majorityPercent}%` }}
                                    />
                                    <div
                                        className="absolute -top-6 text-xs text-white/70"
                                        style={{ left: `${session.majorityPercent - 3}%` }}
                                    >
                                        {session.majorityPercent}%
                                    </div>
                                    {/* Pourcentage actuel */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-3xl font-bold text-white drop-shadow-lg">
                                            {currentPercent}%
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="p-4 bg-green-900/30 rounded-lg border border-green-800">
                                        <CheckCircle className="h-6 w-6 mx-auto text-green-400 mb-2" />
                                        <p className="text-3xl font-bold text-green-400">{results.votesFor}</p>
                                        <p className="text-sm text-green-300">Pour</p>
                                    </div>
                                    <div className="p-4 bg-red-900/30 rounded-lg border border-red-800">
                                        <XCircle className="h-6 w-6 mx-auto text-red-400 mb-2" />
                                        <p className="text-3xl font-bold text-red-400">{results.votesAgainst}</p>
                                        <p className="text-sm text-red-300">Contre</p>
                                    </div>
                                    <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                                        <Minus className="h-6 w-6 mx-auto text-slate-400 mb-2" />
                                        <p className="text-3xl font-bold text-slate-400">{results.votesAbstain}</p>
                                        <p className="text-sm text-slate-300">Abstentions</p>
                                    </div>
                                </div>

                                {/* Message de résultat */}
                                <div className={cn(
                                    "mt-6 p-4 rounded-lg text-center",
                                    isAdopted
                                        ? "bg-green-900/50 border border-green-700"
                                        : "bg-amber-900/30 border border-amber-700"
                                )}>
                                    {isAdopted ? (
                                        <p className="font-bold text-green-300 flex items-center justify-center gap-2">
                                            <CheckCircle className="h-5 w-5" />
                                            Majorité atteinte - Révision adoptée
                                        </p>
                                    ) : (
                                        <p className="text-amber-300">
                                            <AlertTriangle className="h-4 w-4 inline mr-2" />
                                            Il manque <strong>{remainingForAdoption}</strong> voix pour atteindre le seuil
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Hémicycle Visuel (simplifié) */}
                        <Card className="bg-slate-800 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Landmark className="h-5 w-5" />
                                    Hémicycle Unifié
                                </CardTitle>
                                <CardDescription className="text-slate-400">
                                    143 Députés + 102 Sénateurs
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-1 justify-center p-4 bg-slate-900 rounded-lg">
                                    {seats.map((seat) => (
                                        <div
                                            key={seat.id}
                                            className={cn(
                                                "w-3 h-3 rounded-full transition-all",
                                                seat.status === "for" && "bg-green-500",
                                                seat.status === "against" && "bg-red-500",
                                                seat.status === "abstain" && "bg-slate-500",
                                                seat.status === "absent" && "bg-slate-700 border border-slate-600",
                                                seat.chamber === "ASSEMBLY" && "ring-1 ring-primary/30",
                                                seat.chamber === "SENATE" && "ring-1 ring-red-500/30"
                                            )}
                                            title={`${seat.chamber === "ASSEMBLY" ? "Député" : "Sénateur"} - ${seat.status}`}
                                        />
                                    ))}
                                </div>
                                <div className="flex justify-center gap-6 mt-4 text-xs">
                                    <span className="flex items-center gap-1">
                                        <span className="w-3 h-3 rounded-full bg-green-500" /> Pour
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="w-3 h-3 rounded-full bg-red-500" /> Contre
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="w-3 h-3 rounded-full bg-slate-500" /> Abstention
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="w-3 h-3 rounded-full bg-slate-700 border border-slate-600" /> Absent
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Colonne Droite : Controls de Vote */}
                    <div className="space-y-6">
                        {/* Panel de Vote Personnel */}
                        <Card className={cn(
                            "border-2",
                            hasVoted
                                ? "bg-green-950/30 border-green-700"
                                : "bg-blue-950/50 border-blue-700"
                        )}>
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    {hasVoted ? (
                                        <>
                                            <CheckCircle className="h-5 w-5 text-green-400" />
                                            Vote enregistré
                                        </>
                                    ) : (
                                        <>
                                            <Vote className="h-5 w-5" />
                                            Votre vote
                                        </>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {hasVoted ? (
                                    <div className="text-center p-4">
                                        <p className="text-lg mb-2">Vous avez voté :</p>
                                        <Badge className={cn(
                                            "text-lg py-2 px-4",
                                            userVote === "for" && "bg-green-500",
                                            userVote === "against" && "bg-red-500",
                                            userVote === "abstain" && "bg-slate-500"
                                        )}>
                                            {userVote === "for" && "✓ Pour"}
                                            {userVote === "against" && "✗ Contre"}
                                            {userVote === "abstain" && "○ Abstention"}
                                        </Badge>
                                        <p className="text-xs text-slate-400 mt-4">
                                            <Lock className="h-3 w-3 inline mr-1" />
                                            Vote enregistré de manière sécurisée
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <Button
                                            className="w-full h-16 text-lg bg-green-600 hover:bg-green-700"
                                            onClick={() => initiateVote("for")}
                                        >
                                            <CheckCircle className="h-6 w-6 mr-2" />
                                            Voter POUR
                                        </Button>
                                        <Button
                                            className="w-full h-16 text-lg bg-red-600 hover:bg-red-700"
                                            onClick={() => initiateVote("against")}
                                        >
                                            <XCircle className="h-6 w-6 mr-2" />
                                            Voter CONTRE
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full h-12 border-slate-500 text-slate-300 hover:bg-slate-700"
                                            onClick={() => initiateVote("abstain")}
                                        >
                                            <Minus className="h-5 w-5 mr-2" />
                                            S'abstenir
                                        </Button>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Statistiques par Chambre */}
                        <Card className="bg-slate-800 border-slate-700">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-white text-sm">Par chambre</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-primary">Assemblée Nationale</span>
                                        <span>{results.deputiesPresent}/{143} présents</span>
                                    </div>
                                    <div className="flex gap-2 text-xs">
                                        <Badge className="bg-green-600">{results.deputiesFor} Pour</Badge>
                                        <Badge className="bg-red-600">{results.deputiesAgainst} Contre</Badge>
                                    </div>
                                </div>
                                <div className="border-t border-slate-700 pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-red-400">Sénat</span>
                                        <span>{results.senatorsPresent}/{102} présents</span>
                                    </div>
                                    <div className="flex gap-2 text-xs">
                                        <Badge className="bg-green-600">{results.senatorsFor} Pour</Badge>
                                        <Badge className="bg-red-600">{results.senatorsAgainst} Contre</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Sécurité */}
                        <Card className="bg-amber-950/30 border-amber-800">
                            <CardContent className="p-4 flex items-center gap-3">
                                <Shield className="h-8 w-8 text-amber-500" />
                                <div>
                                    <p className="font-bold text-amber-200">Vote Sécurisé</p>
                                    <p className="text-xs text-amber-300/70">
                                        Double validation PIN + Session
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Dialogue de confirmation (PIN) */}
            <Dialog open={pinDialogOpen} onOpenChange={setPinDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-700 text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Fingerprint className="h-5 w-5 text-blue-400" />
                            Confirmation de vote
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Entrez votre code PIN Congrès pour confirmer votre vote.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6">
                        <div className="text-center mb-6">
                            <Badge className={cn(
                                "text-lg py-2 px-6",
                                pendingVote === "for" && "bg-green-500",
                                pendingVote === "against" && "bg-red-500",
                                pendingVote === "abstain" && "bg-slate-500"
                            )}>
                                {pendingVote === "for" && "Voter POUR"}
                                {pendingVote === "against" && "Voter CONTRE"}
                                {pendingVote === "abstain" && "S'abstenir"}
                            </Badge>
                        </div>
                        <div className="space-y-2">
                            <Label>Code PIN (6 chiffres)</Label>
                            <Input
                                type="password"
                                maxLength={6}
                                placeholder="••••••"
                                className="text-center text-2xl tracking-widest bg-slate-800 border-slate-600"
                                value={pin}
                                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            className="border-slate-600"
                            onClick={() => setPinDialogOpen(false)}
                        >
                            Annuler
                        </Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={confirmVote}
                            disabled={pin.length !== 6}
                        >
                            <Lock className="h-4 w-4 mr-2" />
                            Confirmer le vote
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CongressVote;
