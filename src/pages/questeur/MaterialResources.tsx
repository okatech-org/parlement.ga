import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Package, Monitor, Printer, Armchair } from "lucide-react";

const MaterialResources = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const resources = [
        { id: 1, name: "Ordinateurs Portables", quantity: 245, category: "Informatique", status: "Good", icon: Monitor },
        { id: 2, name: "Imprimantes", quantity: 48, category: "Bureautique", status: "Maintenance", icon: Printer },
        { id: 3, name: "Mobilier Bureau", quantity: 320, category: "Mobilier", status: "Good", icon: Armchair },
        { id: 4, name: "Serveurs", quantity: 12, category: "Informatique", status: "Good", icon: Monitor },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Good': return 'default';
            case 'Maintenance': return 'secondary';
            case 'Critical': return 'destructive';
            default: return 'outline';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-serif font-bold text-foreground">Ressources Matérielles</h1>
                <p className="text-muted-foreground">Inventaire et gestion des équipements.</p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                    placeholder="Rechercher une ressource..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Resources Grid */}
            <div className="grid md:grid-cols-2 gap-4">
                {resources.map((resource) => (
                    <Card key={resource.id} className="p-6 hover:shadow-md transition-all duration-200 border-border/50">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                <resource.icon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold text-lg">{resource.name}</h3>
                                    <Badge variant={getStatusColor(resource.status)}>
                                        {resource.status}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Catégorie : {resource.category}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-blue-600">{resource.quantity}</span>
                                    <Button variant="outline" size="sm">Détails</Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <Button className="gap-2">
                    <Package className="w-4 h-4" />
                    Nouvelle Demande
                </Button>
                <Button variant="outline">
                    Exporter Inventaire
                </Button>
            </div>
        </div>
    );
};

export default MaterialResources;
