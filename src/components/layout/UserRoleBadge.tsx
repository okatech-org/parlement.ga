import { Badge } from "@/components/ui/badge";
import {
    Crown, Users, Gavel, FileText, Shield,
    User, Building, Scale, Landmark
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UserRoleBadgeProps {
    role?: string;
    institution?: string;
    showIcon?: boolean;
    size?: "sm" | "md" | "lg";
    className?: string;
}

/**
 * Badge coloré affichant le rôle de l'utilisateur connecté
 */
const UserRoleBadge = ({
    role = "visitor",
    institution,
    showIcon = true,
    size = "md",
    className
}: UserRoleBadgeProps) => {

    const roleConfig: Record<string, {
        label: string;
        color: string;
        icon: React.ComponentType<{ className?: string }>;
    }> = {
        // Assemblée Nationale
        "AN_PRESIDENT": {
            label: "Président AN",
            color: "bg-primary text-white",
            icon: Crown
        },
        "AN_VP": {
            label: "Vice-Président AN",
            color: "bg-primary/80 text-white",
            icon: Crown
        },
        "AN_DEPUTE": {
            label: "Député",
            color: "bg-primary/60 text-white",
            icon: Users
        },
        "AN_QUESTEUR": {
            label: "Questeur AN",
            color: "bg-amber-600 text-white",
            icon: Gavel
        },
        "AN_SECRETAIRE": {
            label: "Secrétaire AN",
            color: "bg-blue-600 text-white",
            icon: FileText
        },
        "AN_SUPPLEANT": {
            label: "Suppléant AN",
            color: "bg-slate-500 text-white",
            icon: User
        },

        // Sénat
        "SN_PRESIDENT": {
            label: "Président Sénat",
            color: "bg-red-700 text-white",
            icon: Crown
        },
        "SN_VP": {
            label: "Vice-Président Sénat",
            color: "bg-red-600 text-white",
            icon: Crown
        },
        "SN_SENATEUR": {
            label: "Sénateur",
            color: "bg-red-500 text-white",
            icon: Users
        },
        "SN_QUESTEUR": {
            label: "Questeur Sénat",
            color: "bg-amber-700 text-white",
            icon: Gavel
        },

        // Congrès
        "PG_PRESIDENT": {
            label: "Président Congrès",
            color: "bg-blue-900 text-white",
            icon: Scale
        },
        "CMP_MEMBER": {
            label: "Membre CMP",
            color: "bg-amber-500 text-black",
            icon: Scale
        },

        // Administration
        "SUPER_ADMIN": {
            label: "Super Admin",
            color: "bg-purple-600 text-white",
            icon: Shield
        },
        "ADMIN": {
            label: "Administrateur",
            color: "bg-purple-500 text-white",
            icon: Shield
        },

        // Citoyen
        "citizen": {
            label: "Citoyen",
            color: "bg-green-600 text-white",
            icon: User
        },
        "visitor": {
            label: "Visiteur",
            color: "bg-slate-400 text-white",
            icon: User
        },
    };

    const config = roleConfig[role] || roleConfig["visitor"];
    const Icon = config.icon;

    const sizeClasses = {
        sm: "text-[10px] py-0.5 px-1.5",
        md: "text-xs py-1 px-2",
        lg: "text-sm py-1.5 px-3",
    };

    return (
        <Badge
            className={cn(
                config.color,
                sizeClasses[size],
                "flex items-center gap-1 font-medium",
                className
            )}
        >
            {showIcon && <Icon className={cn(
                size === "sm" ? "h-3 w-3" : size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5"
            )} />}
            <span>{config.label}</span>
            {institution && (
                <span className="opacity-70 ml-1">• {institution}</span>
            )}
        </Badge>
    );
};

export default UserRoleBadge;
