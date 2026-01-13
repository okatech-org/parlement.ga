import { Vote, Users, CheckCircle, XCircle, MinusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export const ParliamentVoteSection = () => {
  const currentVote = {
    reference: "CONG-2024-003",
    title: "Révision Constitutionnelle - Autonomie des Collectivités",
    majorityRequired: "Trois-Cinquièmes (60%)",
    quorumRequired: 123,
    deputiesPresent: 0,
    senatorsPresent: 0,
    canVote: false,
  };

  const recentVotes = [
    {
      id: 1,
      reference: "CONG-2024-002",
      title: "Modification du Code Électoral",
      result: "adopted",
      votesFor: 178,
      votesAgainst: 45,
      abstentions: 12,
    },
    {
      id: 2,
      reference: "CONG-2024-001",
      title: "Révision Art. 47",
      result: "adopted",
      votesFor: 195,
      votesAgainst: 32,
      abstentions: 8,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
          Vote Solennel
        </h1>
        <p className="text-muted-foreground">
          Participation aux scrutins du Congrès
        </p>
      </div>

      {/* Vote actuel */}
      <Card className="border-2 border-primary">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <Badge className="w-fit">{currentVote.reference}</Badge>
          <CardTitle>{currentVote.title}</CardTitle>
          <CardDescription>Majorité requise: {currentVote.majorityRequired}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Quorum</h4>
              <p className="text-3xl font-bold">
                {currentVote.deputiesPresent + currentVote.senatorsPresent}
                <span className="text-lg text-muted-foreground">/ {currentVote.quorumRequired}</span>
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-primary/10 rounded">
                <span className="text-sm font-medium">Députés</span>
                <Badge variant="secondary">{currentVote.deputiesPresent} / 145</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-primary/10 rounded">
                <span className="text-sm font-medium">Sénateurs</span>
                <Badge variant="secondary">{currentVote.senatorsPresent} / 102</Badge>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Button size="lg" disabled={!currentVote.canVote}>
                <CheckCircle className="h-5 w-5 mr-2" />
                Émarger
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Disponible le jour de la séance
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historique */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des votes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentVotes.map((vote) => (
              <div key={vote.id} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{vote.reference}</Badge>
                    <Badge className="bg-green-500">Adopté</Badge>
                  </div>
                </div>
                <h4 className="font-medium mb-3">{vote.title}</h4>
                <div className="flex items-center gap-6 text-sm">
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-4 w-4" /> {vote.votesFor} Pour
                  </span>
                  <span className="flex items-center gap-1 text-red-600">
                    <XCircle className="h-4 w-4" /> {vote.votesAgainst} Contre
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MinusCircle className="h-4 w-4" /> {vote.abstentions} Abstentions
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
