import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronUp, UserCircle, Shield, Briefcase, Users, Crown, FileText } from "lucide-react";
import { useUser, UserRole } from "@/contexts/UserContext";
import { cn } from "@/lib/utils";

const RoleSwitcher = () => {
    const { user, currentRole, switchRole } = useUser();

    // Filter out 'citizen' as it's a separate public space, not a professional role
    const professionalRoles = user?.roles.filter(role => role !== 'citizen') || [];

    if (!user || professionalRoles.length <= 1) return null;

    const getRoleLabel = (role: UserRole) => {
        // For Bureau roles, use the dynamic bureauLabel from user session if available
        if ((role === 'vp' || role === 'vp_senate') && user?.bureauLabel?.includes('Vice-Président')) {
            return user.bureauLabel;
        }
        if (role === 'president_senate' && user?.bureauLabel) {
            return user.bureauLabel;
        }
        if ((role === 'questeur' || role === 'questeur_senate' || role === 'questeur_budget' || role === 'questeur_resources' || role === 'questeur_services') && user?.bureauLabel?.includes('Questeur')) {
            return user.bureauLabel;
        }
        if ((role === 'secretary' || role === 'secretary_senate') && user?.bureauLabel?.includes('Secrétaire')) {
            return user.bureauLabel;
        }

            case 'president': return "Président AN";
            case 'president_senate': return "Président Sénat";
            case 'president_congress': return "Président du Congrès";
            case 'vp': return "Vice-Président";
            case 'vp_senate': return "Vice-Président Sénat";
            case 'deputy': return "Député";
            case 'deputy_congress': return "Député (Congrès)";
            case 'senator': return "Sénateur";
            case 'senator_congress': return "Sénateur (Congrès)";
            case 'substitute': return "Suppléant";
            case 'questeur': return "Questeur";
            case 'questeur_senate': return "Questeur Sénat";
            case 'questeur_budget': return "Questeur (Budget)";
            case 'questeur_resources': return "Questeur (Ressources)";
            case 'questeur_services': return "Questeur (Services)";
            case 'secretary': return "Secrétaire";
            case 'secretary_senate': return "Secrétaire Sénat";
            case 'secretary_session': return "Secrétaire de Séance";
            case 'cmp_member': return "Membre CMP";
            case 'citizen': return "Citoyen";
            default: return role;
        }
    };

const getRoleIcon = (role: UserRole) => {
    switch (role) {
        case 'president': return Crown;
        case 'president_senate': return Crown;
        case 'president_congress': return Crown;
        case 'vp': return Briefcase;
        case 'vp_senate': return Briefcase;
        case 'deputy': return Shield;
        case 'deputy_congress': return Shield;
        case 'senator': return Shield;
        case 'senator_congress': return Shield;
        case 'substitute': return Users;
        case 'questeur': return Briefcase;
        case 'questeur_senate': return Briefcase;
        case 'questeur_budget': return Briefcase;
        case 'questeur_resources': return Briefcase;
        case 'questeur_services': return Briefcase;
        case 'secretary': return FileText;
        case 'secretary_senate': return FileText;
        case 'secretary_session': return FileText;
        case 'cmp_member': return Users;
        case 'citizen': return UserCircle;
        default: return UserCircle;
    }
};

// Display the current professional role, not 'citizen'
const displayRole = currentRole === 'citizen' ? professionalRoles[0] : currentRole;
const CurrentIcon = displayRole ? getRoleIcon(displayRole) : UserCircle;

return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between mt-2 border-dashed border-primary/30 hover:bg-primary/5">
                <div className="flex items-center gap-2">
                    <CurrentIcon className="w-4 h-4" />
                    <span className="truncate max-w-[120px]">{displayRole ? getRoleLabel(displayRole) : "Changer de rôle"}</span>
                </div>
                <ChevronUp className="w-4 h-4 opacity-50" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Changer d'espace</p>
                    <p className="text-xs leading-none text-muted-foreground">
                        Connecté en tant que {user.name}
                    </p>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {professionalRoles.map((role) => {
                const Icon = getRoleIcon(role);
                return (
                    <DropdownMenuItem
                        key={role}
                        onClick={() => switchRole(role)}
                        className={cn(
                            "cursor-pointer",
                            currentRole === role && "bg-accent text-accent-foreground"
                        )}
                    >
                        <Icon className="mr-2 h-4 w-4" />
                        <span>{getRoleLabel(role)}</span>
                        {currentRole === role && (
                            <span className="ml-auto text-xs text-muted-foreground">Actif</span>
                        )}
                    </DropdownMenuItem>
                );
            })}
        </DropdownMenuContent>
    </DropdownMenu>
);
};

export default RoleSwitcher;
