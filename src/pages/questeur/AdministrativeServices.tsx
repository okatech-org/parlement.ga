import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, CheckCircle, Clock } from "lucide-react";

const AdministrativeServices = () => {
    const services = [
        { id: 1, name: "Service Courrier", staff: 12, status: "Operational", tasks: 45 },
        { id: 2, name: "Maintenance", staff: 18, status: "Operational", tasks: 23 },
        { id: 3, name: "Sécurité", staff: 32, status: "Operational", tasks: 8 },
        { id: 4, name: "Restauration", staff: 15, status: "Operational", tasks: 12 },
        { id: 5, name: "Transport", staff: 10, status: "Maintenance", tasks: 5 },
        { id: 6, name: "Informatique", staff: 14, status: "Operational", tasks: 34 },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Operational': return 'default';
            case 'Maintenance': return 'secondary';
            case 'Critical': return 'destructive';
            default: return 'outline';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-serif font-bold text-foreground">Services Administratifs</h1>
                <p className="text-muted-foreground">Coordination des services et du personnel.</p>
            </div>

            {/* Services Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                    <Card key={service.id} className="p-6 hover:shadow-md transition-all duration-200 border-border/50">
                        <div className="space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                                    <Building2 className="w-6 h-6 text-emerald-600" />
                                </div>
                                <Badge variant={getStatusColor(service.status)}>
                                    {service.status}
                                </Badge>
                            </div>

                            <div>
                                <h3 className="font-bold text-lg mb-2">{service.name}</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Users className="w-4 h-4" />
                                        <span>{service.staff} agents</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="w-4 h-4" />
                                        <span>{service.tasks} tâches en cours</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Summary */}
            <Card className="p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
                <div className="grid md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Total Services</p>
                        <p className="text-2xl font-bold text-emerald-600">8</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Personnel</p>
                        <p className="text-2xl font-bold text-teal-600">111 agents</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Tâches Actives</p>
                        <p className="text-2xl font-bold text-blue-600">127</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Services Opérationnels</p>
                        <p className="text-2xl font-bold text-amber-600">7/8</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AdministrativeServices;
