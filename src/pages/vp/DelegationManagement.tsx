import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, CheckCircle, Clock } from "lucide-react";

const DelegationManagement = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const delegations = [
        { id: 1, title: "Supervision Commission des Lois", type: "Supervision", status: "Active", deadline: "2025-12-30" },
        { id: 2, title: "Représentation au Sommet CEEAC", type: "Representation", status: "Pending", deadline: "2025-12-15" },
        { id: 3, title: "Validation Budget Communication", type: "Validation", status: "Completed", deadline: "2025-11-30" },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-serif font-bold text-foreground">Gestion des Délégations</h1>
                <p className="text-muted-foreground">Suivi des dossiers et missions délégués par le Président.</p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                    placeholder="Rechercher une délégation..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Delegations List */}
            <div className="space-y-4">
                {delegations.map((item) => (
                    <Card key={item.id} className="p-6 hover:shadow-md transition-all duration-200 border-border/50">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                                    <FileText className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-lg">{item.title}</h3>
                                        <Badge variant={item.status === 'Active' ? 'default' : item.status === 'Pending' ? 'secondary' : 'outline'}>
                                            {item.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {item.type} • Échéance : {item.deadline}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">Détails</Button>
                                {item.status !== 'Completed' && (
                                    <Button size="sm">Traiter</Button>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default DelegationManagement;
