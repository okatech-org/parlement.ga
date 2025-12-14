import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbNavProps {
    items?: BreadcrumbItem[];
    className?: string;
}

/**
 * Génère automatiquement le breadcrumb basé sur l'URL ou accepte des items personnalisés
 */
const BreadcrumbNav = ({ items, className }: BreadcrumbNavProps) => {
    const location = useLocation();

    // Mapping des segments URL vers des labels lisibles
    const segmentLabels: Record<string, string> = {
        "an": "Assemblée Nationale",
        "senat": "Sénat",
        "parlement": "Parlement",
        "congres": "Congrès",
        "espace": "Espace",
        "president": "Président",
        "questeur": "Questeur",
        "vp": "Vice-Président",
        "senator": "Sénateur",
        "dashboard": "Tableau de bord",
        "territoires": "Territoires",
        "navette": "Navette",
        "legislation": "Législation",
        "cmp": "Commission Mixte",
        "vote": "Vote",
        "archives": "Archives",
        "demo": "Démonstration",
        "sessions": "Sessions",
        "agenda": "Agenda",
        "documents": "Documents",
        "messagerie": "Messagerie",
        "parametres": "Paramètres",
        "commissions": "Commissions",
        "amendements": "Amendements",
        "doleances": "Doléances",
        "visites": "Visites Terrain",
    };

    // Génération automatique si pas d'items fournis
    const generateBreadcrumbs = (): BreadcrumbItem[] => {
        const pathSegments = location.pathname.split("/").filter(Boolean);
        const breadcrumbs: BreadcrumbItem[] = [
            { label: "Accueil", href: "/", icon: Home }
        ];

        let currentPath = "";
        pathSegments.forEach((segment, index) => {
            currentPath += `/${segment}`;
            const label = segmentLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

            // Le dernier élément n'a pas de lien (page courante)
            breadcrumbs.push({
                label,
                href: index === pathSegments.length - 1 ? undefined : currentPath,
            });
        });

        return breadcrumbs;
    };

    const breadcrumbItems = items || generateBreadcrumbs();

    if (breadcrumbItems.length <= 1) return null;

    return (
        <nav
            aria-label="Fil d'Ariane"
            className={cn(
                "flex items-center text-sm text-muted-foreground py-3 px-4 bg-muted/30 rounded-lg",
                className
            )}
        >
            <ol className="flex items-center flex-wrap gap-1">
                {breadcrumbItems.map((item, index) => {
                    const Icon = item.icon;
                    const isLast = index === breadcrumbItems.length - 1;

                    return (
                        <li key={index} className="flex items-center">
                            {index > 0 && (
                                <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/50" />
                            )}

                            {item.href ? (
                                <Link
                                    to={item.href}
                                    className="flex items-center gap-1 hover:text-primary transition-colors"
                                >
                                    {Icon && <Icon className="h-4 w-4" />}
                                    <span>{item.label}</span>
                                </Link>
                            ) : (
                                <span
                                    className={cn(
                                        "flex items-center gap-1",
                                        isLast && "text-foreground font-medium"
                                    )}
                                >
                                    {Icon && <Icon className="h-4 w-4" />}
                                    <span>{item.label}</span>
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default BreadcrumbNav;
