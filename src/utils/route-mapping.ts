/**
 * Route Mapping for iAsted Navigation Intelligence - Parlement Gabonais
 * Maps natural language queries to actual application routes
 * Comprehensive mapping for all parliamentary roles and spaces
 */

export interface RouteInfo {
    path: string;
    aliases: string[];
    role?: string; // Optional role restriction
    description: string;
}

export const ROUTE_MAP: RouteInfo[] = [
    // ========== PUBLIC ROUTES ==========
    {
        path: '/',
        aliases: ['accueil', 'home', 'page d\'accueil', 'démarrage', 'start', 'sortir', 'quitter'],
        description: 'Page d\'accueil'
    },
    {
        path: '/login',
        aliases: ['connexion', 'login', 'authentification', 'auth', 'se connecter', 'log in', 'identifier'],
        description: 'Page de connexion'
    },
    {
        path: '/actualites',
        aliases: ['actualités', 'news', 'informations', 'actu', 'nouvelles', 'infos', 'informations parlementaires'],
        description: 'Actualités parlementaires'
    },
    {
        path: '/statistiques',
        aliases: ['statistiques', 'stats', 'chiffres', 'données', 'analytics', 'métriques'],
        description: 'Statistiques de l\'Assemblée'
    },
    {
        path: '/sensibilisation',
        aliases: ['sensibilisation', 'éducation civique', 'fonctionnement', 'comprendre le parlement'],
        description: 'Sensibilisation citoyenne'
    },
    {
        path: '/tutoriels',
        aliases: ['tutoriels', 'aide', 'guide', 'formation', 'comment faire', 'tutorials'],
        description: 'Tutoriels et guides'
    },

    // ========== PRESIDENT SPACE ==========
    {
        path: '/espace-president',
        aliases: ['espace président', 'président', 'cockpit président', 'bureau président', 'dashboard président'],
        role: 'president',
        description: 'Espace du Président de l\'Assemblée Nationale'
    },
    {
        path: '/espace-president/pleniere',
        aliases: ['plénière président', 'séance plénière', 'hémicycle président', 'présider séance'],
        role: 'president',
        description: 'Gestion des séances plénières'
    },
    {
        path: '/espace-president/conference',
        aliases: ['conférence des présidents', 'conférence', 'ordre du jour', 'organisation travaux'],
        role: 'president',
        description: 'Conférence des Présidents'
    },
    {
        path: '/espace-president/bureau',
        aliases: ['bureau assemblée', 'membres bureau', 'composition bureau'],
        role: 'president',
        description: 'Bureau de l\'Assemblée'
    },
    {
        path: '/espace-president/commissions',
        aliases: ['commissions président', 'toutes commissions', 'gestion commissions'],
        role: 'president',
        description: 'Vue des commissions'
    },
    {
        path: '/espace-president/agenda',
        aliases: ['agenda président', 'calendrier président', 'planning président'],
        role: 'president',
        description: 'Agenda du Président'
    },
    {
        path: '/espace-president/documents',
        aliases: ['documents président', 'dossiers président', 'fichiers président'],
        role: 'president',
        description: 'Documents du Président'
    },

    // ========== VICE-PRESIDENT SPACE ==========
    {
        path: '/espace-vice-president',
        aliases: ['espace vice-président', 'vice-président', 'vp', 'dashboard vp'],
        role: 'vice_president',
        description: 'Espace Vice-Président'
    },
    {
        path: '/espace-vice-president/interim',
        aliases: ['intérim', 'mode intérim', 'remplacer président', 'présidence intérimaire'],
        role: 'vice_president',
        description: 'Mode Intérim'
    },
    {
        path: '/espace-vice-president/delegations',
        aliases: ['délégations', 'gestion délégations', 'délégation vp'],
        role: 'vice_president',
        description: 'Gestion des Délégations'
    },
    {
        path: '/espace-vice-president/agenda',
        aliases: ['agenda vp', 'calendrier vp', 'planning vp'],
        role: 'vice_president',
        description: 'Agenda Vice-Président'
    },

    // ========== QUESTEUR SPACE ==========
    {
        path: '/espace-questeur',
        aliases: ['espace questeur', 'questeur', 'questure', 'dashboard questeur'],
        role: 'questeur',
        description: 'Espace Questeur'
    },
    {
        path: '/espace-questeur/budget',
        aliases: ['budget', 'finances', 'gestion budgétaire', 'comptabilité', 'budget questeur'],
        role: 'questeur',
        description: 'Gestion Budgétaire'
    },
    {
        path: '/espace-questeur/ressources',
        aliases: ['ressources matérielles', 'logistique', 'matériel', 'équipements'],
        role: 'questeur',
        description: 'Ressources Matérielles'
    },
    {
        path: '/espace-questeur/administration',
        aliases: ['services administratifs', 'administration questeur', 'gestion rh', 'personnel'],
        role: 'questeur',
        description: 'Services Administratifs'
    },

    // ========== SECRETARY SPACE ==========
    {
        path: '/espace-secretaire',
        aliases: ['espace secrétaire', 'secrétaire', 'secrétariat', 'dashboard secrétaire'],
        role: 'secretary',
        description: 'Espace Secrétaire du Bureau'
    },
    {
        path: '/espace-secretaire/proces-verbaux',
        aliases: ['procès-verbaux', 'pv', 'comptes-rendus', 'minutes', 'rédaction pv'],
        role: 'secretary',
        description: 'Procès-verbaux des séances'
    },
    {
        path: '/espace-secretaire/documents',
        aliases: ['documents secrétaire', 'archives', 'documentation', 'fichiers secrétaire'],
        role: 'secretary',
        description: 'Gestion documentaire'
    },
    {
        path: '/espace-secretaire/agenda',
        aliases: ['agenda secrétaire', 'calendrier secrétaire', 'planning secrétaire'],
        role: 'secretary',
        description: 'Agenda Secrétaire'
    },

    // ========== DEPUTY SPACE ==========
    {
        path: '/espace-depute',
        aliases: ['espace député', 'mon espace', 'tableau de bord député', 'dashboard député', 'deputy dashboard', 'accueil député'],
        role: 'deputy',
        description: 'Tableau de bord Député'
    },
    {
        path: '/espace-depute/hemicycle',
        aliases: ['hémicycle', 'séances', 'séances plénières', 'votes', 'scrutins'],
        role: 'deputy',
        description: 'Hémicycle et votes'
    },
    {
        path: '/espace-depute/commissions',
        aliases: ['mes commissions', 'commission', 'travail commission', 'réunions commission'],
        role: 'deputy',
        description: 'Mes commissions'
    },
    {
        path: '/espace-depute/questions',
        aliases: ['questions', 'questions gouvernement', 'interpellation', 'questions écrites', 'questions orales'],
        role: 'deputy',
        description: 'Questions au gouvernement'
    },
    {
        path: '/espace-depute/amendements',
        aliases: ['amendements', 'mes amendements', 'proposer amendement', 'modifier loi'],
        role: 'deputy',
        description: 'Mes amendements'
    },
    {
        path: '/espace-depute/propositions',
        aliases: ['propositions', 'propositions de loi', 'mes propositions', 'déposer proposition'],
        role: 'deputy',
        description: 'Propositions de loi'
    },
    {
        path: '/espace-depute/agenda',
        aliases: ['agenda député', 'mon agenda', 'calendrier député', 'planning', 'mes rendez-vous'],
        role: 'deputy',
        description: 'Agenda parlementaire'
    },
    {
        path: '/espace-depute/messagerie',
        aliases: ['messagerie', 'mails', 'courrier', 'messages', 'boîte de réception', 'iboite député'],
        role: 'deputy',
        description: 'Messagerie'
    },
    {
        path: '/espace-depute/documents',
        aliases: ['mes documents', 'documents député', 'fichiers', 'dossiers'],
        role: 'deputy',
        description: 'Mes documents'
    },
    {
        path: '/espace-depute/circonscription',
        aliases: ['circonscription', 'terrain', 'citoyens', 'électeurs', 'ma circonscription'],
        role: 'deputy',
        description: 'Gestion de circonscription'
    },
    {
        path: '/espace-depute/parametres',
        aliases: ['paramètres député', 'réglages', 'configuration', 'mon compte'],
        role: 'deputy',
        description: 'Paramètres'
    },

    // ========== SUBSTITUTE SPACE ==========
    {
        path: '/espace-suppleant',
        aliases: ['espace suppléant', 'suppléant', 'tableau de bord suppléant', 'dashboard suppléant'],
        role: 'substitute',
        description: 'Espace Suppléant'
    },
    {
        path: '/espace-suppleant/suivi',
        aliases: ['suivi législatif', 'suivre travaux', 'travaux parlementaires', 'actualité législative'],
        role: 'substitute',
        description: 'Suivi Législatif'
    },
    {
        path: '/espace-suppleant/formation',
        aliases: ['formation', 'ressources formation', 'tutoriels suppléant', 'apprendre'],
        role: 'substitute',
        description: 'Ressources de Formation'
    },
    {
        path: '/espace-suppleant/agenda-titulaire',
        aliases: ['agenda titulaire', 'calendrier titulaire', 'planning député titulaire'],
        role: 'substitute',
        description: 'Agenda du Titulaire'
    },

    // ========== ADMIN SPACE ==========
    {
        path: '/admin',
        aliases: ['admin', 'administration', 'espace admin', 'dashboard admin', 'back office'],
        role: 'admin',
        description: 'Espace administration'
    },
    {
        path: '/admin/utilisateurs',
        aliases: ['utilisateurs', 'users', 'gestion utilisateurs', 'comptes', 'tous les utilisateurs'],
        role: 'admin',
        description: 'Gestion des utilisateurs'
    },
    {
        path: '/admin/roles',
        aliases: ['rôles', 'gestion rôles', 'permissions', 'droits'],
        role: 'admin',
        description: 'Gestion des rôles'
    },
    {
        path: '/admin/parametres',
        aliases: ['paramètres admin', 'configuration système', 'settings admin'],
        role: 'admin',
        description: 'Paramètres système'
    },

    // ========== HUB SPACE ==========
    {
        path: '/mes-espaces',
        aliases: ['mes espaces', 'hub', 'choisir espace', 'tous mes espaces', 'sélection espace'],
        description: 'Hub des espaces utilisateur'
    },

    // ========== SHARED ROUTES ==========
    {
        path: '/documents',
        aliases: ['documents partagés', 'bibliothèque', 'tous documents', 'archives'],
        description: 'Documents partagés'
    },
    {
        path: '/messagerie',
        aliases: ['messagerie générale', 'courrier interne', 'communications'],
        description: 'Messagerie interne'
    },
    {
        path: '/agenda',
        aliases: ['agenda général', 'calendrier assemblée', 'séances prévues', 'planning général'],
        description: 'Agenda de l\'Assemblée'
    },
    {
        path: '/commissions',
        aliases: ['toutes commissions', 'commissions parlementaires', 'liste commissions'],
        description: 'Commissions parlementaires'
    },
    {
        path: '/plenieres',
        aliases: ['plénières', 'séances plénières', 'historique séances', 'archives séances'],
        description: 'Séances plénières'
    },

    // ========== SETTINGS ==========
    {
        path: '/parametres',
        aliases: ['paramètres', 'settings', 'configuration', 'réglages', 'préférences'],
        description: 'Paramètres généraux'
    },
];

/**
 * Resolve a natural language query to an actual route
 * Uses fuzzy matching on aliases with priority scoring
 */
export function resolveRoute(query: string): string | null {
    if (!query) return null;

    const normalizedQuery = query.toLowerCase().trim();
    console.log(`🔍 [resolveRoute] Searching for: "${normalizedQuery}"`);

    // Exact path match first (if user says the exact path)
    const exactPathMatch = ROUTE_MAP.find(route => route.path.toLowerCase() === normalizedQuery);
    if (exactPathMatch) {
        console.log(`✅ [resolveRoute] Exact path match: ${exactPathMatch.path}`);
        return exactPathMatch.path;
    }

    // Build a scoring system for better matches
    let bestMatch: { route: RouteInfo; score: number } | null = null;

    for (const route of ROUTE_MAP) {
        let score = 0;

        // Exact alias match (highest priority)
        for (const alias of route.aliases) {
            if (normalizedQuery === alias) {
                score = 100;
                break;
            }
            // Query contains the alias
            if (normalizedQuery.includes(alias)) {
                score = Math.max(score, 50 + alias.length);
            }
            // Alias contains the query
            if (alias.includes(normalizedQuery)) {
                score = Math.max(score, 40 + normalizedQuery.length);
            }
        }

        // Description matching (lower priority)
        if (route.description.toLowerCase().includes(normalizedQuery)) {
            score = Math.max(score, 30);
        }
        if (normalizedQuery.includes(route.description.toLowerCase())) {
            score = Math.max(score, 25);
        }

        // Update best match
        if (score > 0 && (!bestMatch || score > bestMatch.score)) {
            bestMatch = { route, score };
        }
    }

    if (bestMatch) {
        console.log(`✅ [resolveRoute] Best match: ${bestMatch.route.path} (score: ${bestMatch.score})`);
        return bestMatch.route.path;
    }

    console.log(`❌ [resolveRoute] No match found for: "${normalizedQuery}"`);
    return null;
}

/**
 * Get route information for system prompt
 */
export function getRouteKnowledgePrompt(): string {
    const routeList = ROUTE_MAP.map(route =>
        `- **${route.path}** : ${route.description}\n  Aliases: ${route.aliases.slice(0, 5).join(', ')}${route.aliases.length > 5 ? '...' : ''}`
    ).join('\n');

    return `# CARTOGRAPHIE DES ROUTES DISPONIBLES\n${routeList}\n\nIMPORTANT: Utilise TOUJOURS ces chemins exacts. Si l'utilisateur demande "page d'accueil" ou "home", utilise "/" et NON "/home".`;
}

/**
 * Get all routes for a specific role
 */
export function getRoutesForRole(role: string): RouteInfo[] {
    return ROUTE_MAP.filter(route => !route.role || route.role === role);
}

/**
 * Get role-specific routes
 */
export function getRoleDefaultRoute(role: string): string {
    const roleRoutes: Record<string, string> = {
        'president': '/espace-president',
        'vice_president': '/espace-vice-president',
        'questeur': '/espace-questeur',
        'secretary': '/espace-secretaire',
        'deputy': '/espace-depute',
        'substitute': '/espace-suppleant',
        'admin': '/admin',
        'staff': '/mes-espaces'
    };
    return roleRoutes[role] || '/';
}
