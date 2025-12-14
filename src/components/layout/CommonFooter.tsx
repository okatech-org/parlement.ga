import { Link } from "react-router-dom";
import { Scale, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

interface CommonFooterProps {
    variant?: "light" | "dark" | "transparent";
    showLinks?: boolean;
}

/**
 * Footer commun pour toutes les pages publiques
 * Mentions légales, contacts et liens utiles
 */
const CommonFooter = ({ variant = "dark", showLinks = true }: CommonFooterProps) => {
    const currentYear = new Date().getFullYear();

    const legalLinks = [
        { label: "Mentions légales", href: "/mentions-legales" },
        { label: "Politique de confidentialité", href: "/confidentialite" },
        { label: "Conditions d'utilisation", href: "/conditions" },
        { label: "Accessibilité", href: "/accessibilite" },
    ];

    const institutionLinks = [
        { label: "Assemblée Nationale", href: "/an" },
        { label: "Sénat", href: "/senat" },
        { label: "Archives Nationales", href: "/parlement/archives" },
        { label: "Contact", href: "/contact" },
    ];

    const bgClass = variant === "dark"
        ? "bg-slate-900 text-slate-300"
        : variant === "light"
            ? "bg-slate-100 text-slate-700"
            : "bg-transparent text-muted-foreground";

    return (
        <footer className={`${bgClass} border-t border-border/50`}>
            {showLinks && (
                <div className="container mx-auto px-4 py-12">
                    <div className="grid md:grid-cols-4 gap-8">
                        {/* Logo et Description */}
                        <div className="md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <Scale className="h-6 w-6 text-primary" />
                                <span className="font-serif font-bold text-lg text-foreground">
                                    Parlement du Gabon
                                </span>
                            </div>
                            <p className="text-sm leading-relaxed mb-4">
                                Plateforme numérique de l'institution parlementaire gabonaise.
                                Transparence, accessibilité et démocratie au service des citoyens.
                            </p>
                            <p className="text-xs italic">
                                "L'Union - Le Travail - La Justice"
                            </p>
                        </div>

                        {/* Liens Institutionnels */}
                        <div>
                            <h4 className="font-bold text-foreground mb-4">Institutions</h4>
                            <ul className="space-y-2">
                                {institutionLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            to={link.href}
                                            className="text-sm hover:text-primary transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Liens Légaux */}
                        <div>
                            <h4 className="font-bold text-foreground mb-4">Informations légales</h4>
                            <ul className="space-y-2">
                                {legalLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            to={link.href}
                                            className="text-sm hover:text-primary transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="font-bold text-foreground mb-4">Contact</h4>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span>Boulevard Triomphal, Libreville</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-primary" />
                                    <span>+241 01 72 XX XX</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-primary" />
                                    <span>contact@parlement.ga</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Barre de Copyright */}
            <div className={`py-4 ${variant === "dark" ? "bg-slate-950" : "bg-slate-200"}`}>
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                        <p>
                            © {currentYear} Parlement de la République Gabonaise. Tous droits réservés.
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://www.gouvernement.ga"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-primary transition-colors"
                            >
                                Gouvernement <ExternalLink className="h-3 w-3" />
                            </a>
                            <a
                                href="https://www.presidence.ga"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-primary transition-colors"
                            >
                                Présidence <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default CommonFooter;
