import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  ArrowRight, 
  Building2, 
  Users, 
  FileText, 
  Vote, 
  Gavel,
  Clock,
  CheckCircle2,
  Scale,
  GitCompare,
  Home
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import MermaidDiagram from "@/components/MermaidDiagram";

const ProcessComparison = () => {
  const navigate = useNavigate();
  const [activePhase, setActivePhase] = useState<string>("depot");

  const phases = [
    {
      id: "depot",
      name: "Dépôt",
      anIcon: FileText,
      snIcon: FileText,
      anTitle: "Dépôt à l'AN",
      snTitle: "Dépôt au Sénat",
      anDescription: "Les projets de loi du gouvernement et les propositions de loi des députés sont déposés au Bureau de l'Assemblée Nationale.",
      snDescription: "Les projets de loi concernant les collectivités locales et les propositions de loi des sénateurs sont déposés au Bureau du Sénat.",
      anDetails: [
        "Enregistrement au Bureau",
        "Attribution d'un numéro de référence",
        "Publication au Journal Officiel",
        "Transmission à la commission compétente"
      ],
      snDetails: [
        "Réception au Bureau du Sénat",
        "Vérification de la recevabilité",
        "Attribution de la référence SN",
        "Notification aux groupes parlementaires"
      ],
      anColor: "bg-emerald-500",
      snColor: "bg-amber-500"
    },
    {
      id: "commission",
      name: "Commission",
      anIcon: Users,
      snIcon: Users,
      anTitle: "Examen en commission AN",
      snTitle: "Examen en commission SN",
      anDescription: "La commission permanente compétente examine le texte, auditionne les parties prenantes et adopte un rapport.",
      snDescription: "La commission sénatoriale analyse le texte avec un focus particulier sur l'impact territorial et les collectivités locales.",
      anDetails: [
        "Désignation du rapporteur",
        "Auditions et consultations",
        "Examen article par article",
        "Vote du rapport de commission"
      ],
      snDetails: [
        "Nomination du rapporteur sénatorial",
        "Consultation des collectivités",
        "Analyse d'impact territorial",
        "Avis sur la constitutionnalité"
      ],
      anColor: "bg-emerald-500",
      snColor: "bg-amber-500"
    },
    {
      id: "pleniere",
      name: "Séance plénière",
      anIcon: Gavel,
      snIcon: Gavel,
      anTitle: "Discussion en plénière AN",
      snTitle: "Discussion en plénière SN",
      anDescription: "L'ensemble des députés débat du texte en séance publique, examine les amendements et vote article par article.",
      snDescription: "Les sénateurs débattent en séance plénière avec une attention particulière aux amendements territoriaux.",
      anDetails: [
        "Discussion générale",
        "Examen des amendements",
        "Vote article par article",
        "Vote solennel sur l'ensemble"
      ],
      snDetails: [
        "Présentation par le rapporteur",
        "Discussion des amendements",
        "Votes successifs",
        "Adoption ou rejet du texte"
      ],
      anColor: "bg-emerald-500",
      snColor: "bg-amber-500"
    },
    {
      id: "navette",
      name: "Navette",
      anIcon: ArrowRight,
      snIcon: ArrowLeft,
      anTitle: "Transmission au Sénat",
      snTitle: "Retour à l'AN",
      anDescription: "Le texte adopté est transmis au Sénat pour examen. En cas de désaccord, la navette continue.",
      snDescription: "Le texte modifié par le Sénat retourne à l'Assemblée Nationale pour examen des modifications.",
      anDetails: [
        "Transmission officielle",
        "Délai de 40 jours (ordinaire)",
        "15 jours en procédure d'urgence",
        "Possibilité de CMP après 2 lectures"
      ],
      snDetails: [
        "Examen des modifications AN",
        "Adoption conforme ou nouvelle lecture",
        "Convergence vers un texte commun",
        "Possibilité de désaccord persistant"
      ],
      anColor: "bg-emerald-500",
      snColor: "bg-amber-500"
    },
    {
      id: "adoption",
      name: "Adoption finale",
      anIcon: CheckCircle2,
      snIcon: CheckCircle2,
      anTitle: "Vote définitif AN",
      snTitle: "Vote définitif SN",
      anDescription: "En cas de désaccord persistant, l'Assemblée Nationale peut statuer définitivement sur le texte.",
      snDescription: "Le Sénat peut donner son accord final ou maintenir son opposition, déclenchant le dernier mot de l'AN.",
      anDetails: [
        "Dernier mot de l'AN si échec CMP",
        "Vote à la majorité simple",
        "Transmission au Président",
        "Promulgation sous 15 jours"
      ],
      snDetails: [
        "Vote final du Sénat",
        "Possibilité de saisine du CC",
        "Participation à la promulgation",
        "Publication au Journal Officiel"
      ],
      anColor: "bg-emerald-500",
      snColor: "bg-amber-500"
    }
  ];

  const navetteCompleteDiagram = `flowchart TB
    subgraph AN["🏛️ ASSEMBLÉE NATIONALE"]
      AN_DEPOT["📥 Dépôt"]
      AN_COMM["👥 Commission"]
      AN_PLEN["🏛️ Plénière"]
      AN_VOTE["🗳️ Vote"]
    end
    
    subgraph NAVETTE["⚡ NAVETTE PARLEMENTAIRE"]
      NAV_1["1ère Lecture"]
      NAV_2["2ème Lecture"]
      CMP["🤝 CMP"]
    end
    
    subgraph SN["🏛️ SÉNAT"]
      SN_DEPOT["📥 Réception"]
      SN_COMM["👥 Commission"]
      SN_PLEN["🏛️ Plénière"]
      SN_VOTE["🗳️ Vote"]
    end
    
    subgraph FINAL["✅ ADOPTION"]
      ACCORD["Texte Commun"]
      PROMUL["Promulgation"]
    end
    
    AN_DEPOT --> AN_COMM
    AN_COMM --> AN_PLEN
    AN_PLEN --> AN_VOTE
    AN_VOTE -->|"Transmis"| NAV_1
    
    NAV_1 --> SN_DEPOT
    SN_DEPOT --> SN_COMM
    SN_COMM --> SN_PLEN
    SN_PLEN --> SN_VOTE
    
    SN_VOTE -->|"Modifié"| NAV_2
    NAV_2 --> AN_COMM
    
    SN_VOTE -->|"Désaccord"| CMP
    CMP -->|"Accord"| ACCORD
    CMP -->|"Échec"| AN_VOTE
    
    AN_VOTE -->|"Adopté"| ACCORD
    ACCORD --> PROMUL
    
    style AN fill:#10b98120,stroke:#10b981,stroke-width:2px
    style SN fill:#f59e0b20,stroke:#f59e0b,stroke-width:2px
    style NAVETTE fill:#3b82f620,stroke:#3b82f6,stroke-width:2px
    style FINAL fill:#8b5cf620,stroke:#8b5cf6,stroke-width:2px`;

  const differencesComparison = [
    {
      aspect: "Représentation",
      an: "Représente le peuple français directement élu",
      sn: "Représente les collectivités territoriales",
      icon: Users
    },
    {
      aspect: "Mode d'élection",
      an: "Suffrage universel direct",
      sn: "Suffrage universel indirect (grands électeurs)",
      icon: Vote
    },
    {
      aspect: "Nombre de membres",
      an: "143 députés",
      sn: "52 à 102 sénateurs",
      icon: Building2
    },
    {
      aspect: "Durée du mandat",
      an: "5 ans renouvelables",
      sn: "6 ans (renouvellement par moitié)",
      icon: Clock
    },
    {
      aspect: "Pouvoir spécifique",
      an: "Dernier mot en cas de désaccord",
      sn: "Priorité sur lois collectivités locales",
      icon: Gavel
    },
    {
      aspect: "Focus législatif",
      an: "Intérêt national, réformes structurelles",
      sn: "Impact territorial, décentralisation",
      icon: Scale
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500 text-white">
                  <GitCompare className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Comparaison des Processus</h1>
                  <p className="text-sm text-muted-foreground">Assemblée Nationale vs Sénat</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/an/processus">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                  Processus AN
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/senat/processus">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mr-2" />
                  Processus Sénat
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                  <Home className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Diagramme navette complète */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-3">
                <Scale className="h-7 w-7 text-primary" />
                Cycle Complet de la Navette Parlementaire
              </CardTitle>
              <p className="text-muted-foreground">
                Visualisation du parcours d'un texte entre les deux chambres
              </p>
            </CardHeader>
            <CardContent>
              <MermaidDiagram chart={navetteCompleteDiagram} />
            </CardContent>
          </Card>
        </motion.section>

        {/* Navigation par phases */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs value={activePhase} onValueChange={setActivePhase} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap h-auto p-1 bg-muted/50">
              {phases.map((phase) => (
                <TabsTrigger 
                  key={phase.id} 
                  value={phase.id}
                  className="flex-shrink-0 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  {phase.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {phases.map((phase) => (
              <TabsContent key={phase.id} value={phase.id} className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Colonne AN */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="h-full border-l-4 border-l-emerald-500 hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-xl bg-emerald-500/10">
                            <phase.anIcon className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div>
                            <Badge variant="outline" className="mb-1 border-emerald-500 text-emerald-600">
                              Assemblée Nationale
                            </Badge>
                            <CardTitle className="text-lg">{phase.anTitle}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">{phase.anDescription}</p>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm text-emerald-600">Étapes clés :</h4>
                          <ul className="space-y-2">
                            {phase.anDetails.map((detail, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Colonne Sénat */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="h-full border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-xl bg-amber-500/10">
                            <phase.snIcon className="h-6 w-6 text-amber-600" />
                          </div>
                          <div>
                            <Badge variant="outline" className="mb-1 border-amber-500 text-amber-600">
                              Sénat
                            </Badge>
                            <CardTitle className="text-lg">{phase.snTitle}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">{phase.snDescription}</p>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm text-amber-600">Étapes clés :</h4>
                          <ul className="space-y-2">
                            {phase.snDetails.map((detail, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.section>

        {/* Tableau comparatif des différences */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Différences Institutionnelles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Aspect</th>
                      <th className="text-left p-3 font-semibold">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-emerald-500" />
                          Assemblée Nationale
                        </div>
                      </th>
                      <th className="text-left p-3 font-semibold">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-amber-500" />
                          Sénat
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {differencesComparison.map((diff, idx) => (
                      <motion.tr 
                        key={diff.aspect}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                        className="border-b hover:bg-muted/50 transition-colors"
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-2 font-medium">
                            <diff.icon className="h-4 w-4 text-muted-foreground" />
                            {diff.aspect}
                          </div>
                        </td>
                        <td className="p-3 text-sm">{diff.an}</td>
                        <td className="p-3 text-sm">{diff.sn}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Liens vers les pages détaillées */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <Link to="/an/processus">
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-emerald-500 cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white group-hover:scale-110 transition-transform">
                  <Building2 className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg group-hover:text-emerald-600 transition-colors">
                    Processus Assemblée Nationale
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Voir le détail complet du processus législatif à l'AN
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>
          </Link>

          <Link to="/senat/processus">
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-amber-500 cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white group-hover:scale-110 transition-transform">
                  <Building2 className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg group-hover:text-amber-600 transition-colors">
                    Processus Sénat
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Voir le détail complet du processus législatif au Sénat
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>
          </Link>
        </motion.section>
      </main>
    </div>
  );
};

export default ProcessComparison;
