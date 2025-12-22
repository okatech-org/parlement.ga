import { useState } from "react";
import { Vote, Check, X, Minus, ShieldCheck, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export const CMPVoteSection = () => {
    const [hasVoted, setHasVoted] = useState(false);

    // Mock Tally (7 Députés + 7 Sénateurs = 14)
    const votes = {
        for: 8,
        against: 4,
        abstain: 1,
        total: 13, // 1 missing (user)
        required: 14
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold">Vote Solennel sur le Texte de Compromis</h2>
                <p className="text-lg text-muted-foreground">
                    Projet de loi relatif à la souveraineté numérique • Commission Mixte Paritaire
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Vote Interface */}
                <Card className={hasVoted ? "opacity-75 pointer-events-none" : "border-t-4 border-t-purple-500 shadow-lg"}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Vote className="h-6 w-6 text-purple-600" />
                            Votre Voix
                        </CardTitle>
                        <CardDescription>
                            En tant que Commissaire Titulaire, votre vote engage votre institution.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {!hasVoted ? (
                            <div className="grid gap-4">
                                <Button
                                    className="h-16 text-lg bg-green-600 hover:bg-green-700"
                                    onClick={() => setHasVoted(true)}
                                >
                                    <Check className="mr-2 h-6 w-6" /> POUR l'adoption
                                </Button>
                                <Button
                                    className="h-16 text-lg bg-red-600 hover:bg-red-700"
                                    onClick={() => setHasVoted(true)}
                                >
                                    <X className="mr-2 h-6 w-6" /> CONTRE l'adoption
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-12"
                                    onClick={() => setHasVoted(true)}
                                >
                                    <Minus className="mr-2 h-4 w-4" /> Abstention
                                </Button>
                            </div>
                        ) : (
                            <Alert className="bg-green-50 border-green-200">
                                <ShieldCheck className="h-4 w-4 text-green-600" />
                                <AlertTitle className="text-green-800">Vote enregistré</AlertTitle>
                                <AlertDescription className="text-green-700">
                                    Votre vote a été scellé dans l'urne numérique.
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                    <CardFooter className="bg-muted/30 text-xs text-muted-foreground justify-center p-4">
                        <Lock className="h-3 w-3 mr-1" /> Scrutin sécurisé par Neocortex
                    </CardFooter>
                </Card>

                {/* Live Tally */}
                <Card>
                    <CardHeader>
                        <CardTitle>Résultats en Temps Réel</CardTitle>
                        <CardDescription>Scrutin en cours (13/14 votants)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-green-700">POUR</span>
                                <span>{votes.for}</span>
                            </div>
                            <Progress value={(votes.for / 14) * 100} className="h-3 bg-green-100 [&>div]:bg-green-600" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-red-700">CONTRE</span>
                                <span>{votes.against}</span>
                            </div>
                            <Progress value={(votes.against / 14) * 100} className="h-3 bg-red-100 [&>div]:bg-red-600" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-gray-700">ABSTENTION</span>
                                <span>{votes.abstain}</span>
                            </div>
                            <Progress value={(votes.abstain / 14) * 100} className="h-3 bg-gray-100 [&>div]:bg-gray-500" />
                        </div>

                        <Separator />

                        <div className="pt-2">
                            <p className="text-sm font-semibold text-center mb-4">Majorité requise : 8 voix</p>
                            {votes.for >= 8 && (
                                <div className="p-3 bg-green-100 text-green-800 rounded-lg text-center font-bold animate-pulse">
                                    Texte Adopté Provisoirement
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
