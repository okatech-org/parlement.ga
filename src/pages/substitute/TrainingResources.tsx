import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, PlayCircle, FileText, CheckCircle } from "lucide-react";

const TrainingResources = () => {
    const modules = [
        { id: 1, title: "La Constitution Gabonaise", type: "Document", status: "Completed", duration: "2h" },
        { id: 2, title: "Règlement Intérieur de l'Assemblée", type: "Document", status: "In Progress", duration: "4h" },
        { id: 3, title: "Procédure Législative : De la proposition au vote", type: "Video", status: "Locked", duration: "45m" },
        { id: 4, title: "Le rôle du Suppléant", type: "Guide", status: "Locked", duration: "30m" },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-serif font-bold text-foreground">Formation & Ressources</h1>
                <p className="text-muted-foreground">Modules de formation pour maîtriser le fonctionnement de l'Assemblée.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {modules.map((module) => (
                    <Card key={module.id} className="p-6 hover:shadow-md transition-all duration-200 border-border/50">
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${module.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                {module.type === 'Video' ? <PlayCircle className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg mb-1">{module.title}</h3>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                                    <span>{module.type}</span>
                                    <span>•</span>
                                    <span>{module.duration}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${module.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                            module.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-500'
                                        }`}>
                                        {module.status === 'Completed' ? 'Terminé' :
                                            module.status === 'In Progress' ? 'En cours' : 'Verrouillé'}
                                    </span>
                                    <Button size="sm" variant={module.status === 'Locked' ? 'outline' : 'default'} disabled={module.status === 'Locked'}>
                                        {module.status === 'Completed' ? 'Revoir' : 'Commencer'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default TrainingResources;
