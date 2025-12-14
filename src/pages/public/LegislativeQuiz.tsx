import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    HelpCircle, CheckCircle, XCircle, Trophy,
    RotateCcw, ArrowRight, Lightbulb, Star,
    Home, Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import CommonFooter from "@/components/layout/CommonFooter";
import { toast } from "sonner";

interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    difficulty: "easy" | "medium" | "hard";
}

const questions: QuizQuestion[] = [
    {
        id: 1,
        question: "Combien de chambres composent le Parlement gabonais ?",
        options: ["Une seule", "Deux chambres", "Trois chambres", "Quatre chambres"],
        correctIndex: 1,
        explanation: "Le Parlement gabonais est bicaméral : l'Assemblée Nationale et le Sénat.",
        difficulty: "easy",
    },
    {
        id: 2,
        question: "Qui peut déposer un projet de loi au Gabon ?",
        options: [
            "Uniquement le Président",
            "Uniquement les députés",
            "Le Gouvernement et les parlementaires",
            "Uniquement les citoyens"
        ],
        correctIndex: 2,
        explanation: "Les projets de loi viennent du Gouvernement, les propositions de loi des parlementaires.",
        difficulty: "easy",
    },
    {
        id: 3,
        question: "Quel est le rôle principal du Sénat ?",
        options: [
            "Voter le budget uniquement",
            "Représenter les collectivités territoriales",
            "Nommer le Premier Ministre",
            "Juger les crimes"
        ],
        correctIndex: 1,
        explanation: "Le Sénat représente les collectivités locales et examine les textes en seconde lecture.",
        difficulty: "medium",
    },
    {
        id: 4,
        question: "Qu'est-ce qu'une Commission Mixte Paritaire (CMP) ?",
        options: [
            "Une commission d'enquête",
            "Un groupe de 14 parlementaires pour trouver un compromis",
            "Le bureau du Président",
            "Une instance judiciaire"
        ],
        correctIndex: 1,
        explanation: "La CMP réunit 7 députés et 7 sénateurs pour harmoniser un texte en cas de désaccord.",
        difficulty: "medium",
    },
    {
        id: 5,
        question: "Quelle majorité est requise pour une révision constitutionnelle en Congrès ?",
        options: ["Majorité simple (50%)", "Majorité absolue", "Trois cinquièmes (60%)", "Unanimité"],
        correctIndex: 2,
        explanation: "Les révisions constitutionnelles requièrent une majorité qualifiée des 3/5 ou 2/3.",
        difficulty: "hard",
    },
    {
        id: 6,
        question: "Combien de députés siègent à l'Assemblée Nationale du Gabon ?",
        options: ["100 députés", "120 députés", "143 députés", "200 députés"],
        correctIndex: 2,
        explanation: "L'Assemblée Nationale compte 143 députés élus au suffrage universel direct.",
        difficulty: "medium",
    },
    {
        id: 7,
        question: "Que signifie la 'navette parlementaire' ?",
        options: [
            "Le transport des députés",
            "L'échange d'un texte entre les deux chambres",
            "Une procédure d'urgence",
            "Le vote électronique"
        ],
        correctIndex: 1,
        explanation: "La navette est le va-et-vient d'un texte entre l'AN et le Sénat jusqu'à accord.",
        difficulty: "easy",
    },
    {
        id: 8,
        question: "Qui préside les séances du Congrès ?",
        options: [
            "Le Président de la République",
            "Le Président de l'Assemblée Nationale",
            "Le Président du Sénat",
            "Le Premier Ministre"
        ],
        correctIndex: 1,
        explanation: "Le Président de l'Assemblée Nationale préside les sessions du Congrès.",
        difficulty: "hard",
    },
];

const LegislativeQuiz = () => {
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [answers, setAnswers] = useState<boolean[]>([]);
    const [quizComplete, setQuizComplete] = useState(false);

    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    const handleAnswer = (index: number) => {
        if (selectedAnswer !== null) return; // Déjà répondu

        setSelectedAnswer(index);
        const isCorrect = index === question.correctIndex;

        if (isCorrect) {
            setScore(score + 1);
        }

        setAnswers([...answers, isCorrect]);
        setShowExplanation(true);
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        } else {
            setQuizComplete(true);
        }
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setScore(0);
        setAnswers([]);
        setQuizComplete(false);
    };

    const shareResult = () => {
        const text = `J'ai obtenu ${score}/${questions.length} au Quiz Législatif Gabonais sur parlement.ga ! 🏛️🇬🇦`;
        if (navigator.share) {
            navigator.share({ text, url: window.location.href });
        } else {
            navigator.clipboard.writeText(text);
            toast.success("Résultat copié !");
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "easy": return "bg-green-500";
            case "medium": return "bg-amber-500";
            case "hard": return "bg-red-500";
            default: return "bg-slate-500";
        }
    };

    const getScoreMessage = () => {
        const percentage = (score / questions.length) * 100;
        if (percentage === 100) return { message: "Parfait ! Vous êtes un expert ! 🎉", emoji: "🏆" };
        if (percentage >= 75) return { message: "Excellent ! Très bonne connaissance ! 👏", emoji: "🥇" };
        if (percentage >= 50) return { message: "Bien ! Continuez à apprendre ! 📚", emoji: "🥈" };
        return { message: "Continuez à vous informer sur le Parlement ! 💪", emoji: "📖" };
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-800 to-blue-700 text-white py-6">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            className="text-white hover:bg-white/10"
                            onClick={() => navigate("/")}
                        >
                            <Home className="h-4 w-4 mr-2" />
                            Accueil
                        </Button>
                        <div className="text-center">
                            <h1 className="text-2xl font-bold flex items-center gap-2 justify-center">
                                <HelpCircle className="h-6 w-6" />
                                Quiz Législatif
                            </h1>
                            <p className="text-blue-200 text-sm">Testez vos connaissances !</p>
                        </div>
                        <div className="w-24" />
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <AnimatePresence mode="wait">
                    {!quizComplete ? (
                        <motion.div
                            key={currentQuestion}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Progression */}
                            <div className="mb-6">
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Question {currentQuestion + 1}/{questions.length}</span>
                                    <span className="flex items-center gap-1">
                                        <Star className="h-4 w-4 text-amber-500" />
                                        {score} points
                                    </span>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </div>

                            {/* Question */}
                            <Card className="mb-6">
                                <CardHeader>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge className={getDifficultyColor(question.difficulty)}>
                                            {question.difficulty === "easy" ? "Facile" : question.difficulty === "medium" ? "Moyen" : "Difficile"}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-xl">{question.question}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {question.options.map((option, index) => {
                                        const isSelected = selectedAnswer === index;
                                        const isCorrect = index === question.correctIndex;
                                        const showResult = selectedAnswer !== null;

                                        return (
                                            <motion.button
                                                key={index}
                                                whileHover={!showResult ? { scale: 1.02 } : {}}
                                                whileTap={!showResult ? { scale: 0.98 } : {}}
                                                onClick={() => handleAnswer(index)}
                                                disabled={showResult}
                                                className={cn(
                                                    "w-full p-4 rounded-lg border-2 text-left transition-all",
                                                    !showResult && "hover:border-primary hover:bg-primary/5 cursor-pointer",
                                                    showResult && isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/30",
                                                    showResult && isSelected && !isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/30",
                                                    showResult && !isSelected && !isCorrect && "opacity-50"
                                                )}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span>{option}</span>
                                                    {showResult && isCorrect && (
                                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                                    )}
                                                    {showResult && isSelected && !isCorrect && (
                                                        <XCircle className="h-5 w-5 text-red-500" />
                                                    )}
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </CardContent>
                            </Card>

                            {/* Explication */}
                            <AnimatePresence>
                                {showExplanation && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950/30">
                                            <CardContent className="p-4">
                                                <div className="flex items-start gap-3">
                                                    <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                                                    <div>
                                                        <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                                                            Explication
                                                        </p>
                                                        <p className="text-sm text-blue-800 dark:text-blue-200">
                                                            {question.explanation}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Button
                                            className="w-full"
                                            size="lg"
                                            onClick={nextQuestion}
                                        >
                                            {currentQuestion < questions.length - 1 ? (
                                                <>
                                                    Question suivante
                                                    <ArrowRight className="h-4 w-4 ml-2" />
                                                </>
                                            ) : (
                                                <>
                                                    Voir mes résultats
                                                    <Trophy className="h-4 w-4 ml-2" />
                                                </>
                                            )}
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Résultats */}
                            <Card className="text-center">
                                <CardHeader>
                                    <div className="text-6xl mb-4">{getScoreMessage().emoji}</div>
                                    <CardTitle className="text-3xl">Quiz Terminé !</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="text-5xl font-bold text-primary">
                                        {score}/{questions.length}
                                    </div>
                                    <p className="text-lg text-muted-foreground">
                                        {getScoreMessage().message}
                                    </p>

                                    {/* Détail des réponses */}
                                    <div className="flex justify-center gap-2">
                                        {answers.map((correct, index) => (
                                            <div
                                                key={index}
                                                className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center",
                                                    correct ? "bg-green-500" : "bg-red-500"
                                                )}
                                            >
                                                {correct ? (
                                                    <CheckCircle className="h-5 w-5 text-white" />
                                                ) : (
                                                    <XCircle className="h-5 w-5 text-white" />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-4 justify-center pt-4">
                                        <Button variant="outline" onClick={resetQuiz}>
                                            <RotateCcw className="h-4 w-4 mr-2" />
                                            Recommencer
                                        </Button>
                                        <Button onClick={shareResult}>
                                            <Share2 className="h-4 w-4 mr-2" />
                                            Partager
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <CommonFooter />
        </div>
    );
};

export default LegislativeQuiz;
