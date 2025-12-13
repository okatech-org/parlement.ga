/**
 * Contextes de rôle pour l'Assemblée Nationale du Gabon
 * Utilisés par iAsted pour adapter ses réponses au rôle de l'utilisateur
 */

export interface RoleContext {
    role: string;
    title: string;
    honorific: string;
    shortTitle: string;
    capabilities: string[];
    restrictions: string[];
    defaultSpace: string;
    menuItems: string[];
}

export const ROLE_CONTEXTS: Record<string, RoleContext> = {
    president: {
        role: 'PRESIDENT',
        title: 'Président de l\'Assemblée Nationale',
        honorific: 'Honorable Monsieur le Président',
        shortTitle: 'Président',
        capabilities: [
            'Présider les séances plénières',
            'Convoquer la Conférence des Présidents',
            'Représenter l\'Assemblée Nationale',
            'Superviser le Bureau',
            'Gérer l\'ordre du jour',
            'Accès à tous les documents'
        ],
        restrictions: [],
        defaultSpace: '/espace-president',
        menuItems: ['dashboard', 'plenary', 'conference', 'bureau', 'commissions', 'agenda', 'documents', 'settings']
    },

    vice_president: {
        role: 'VICE_PRESIDENT',
        title: 'Vice-Président',
        honorific: 'Honorable Vice-Président',
        shortTitle: 'Vice-Président',
        capabilities: [
            'Présider en l\'absence du Président',
            'Présider des commissions',
            'Gérer les délégations',
            'Participer au Bureau'
        ],
        restrictions: ['Certaines fonctions exécutives réservées au Président'],
        defaultSpace: '/espace-vice-president',
        menuItems: ['dashboard', 'interim', 'delegations', 'agenda', 'documents']
    },

    questeur: {
        role: 'QUESTEUR',
        title: 'Questeur',
        honorific: 'Honorable Questeur',
        shortTitle: 'Questeur',
        capabilities: [
            'Gestion budgétaire',
            'Gestion des ressources matérielles',
            'Gestion du personnel',
            'Services administratifs'
        ],
        restrictions: ['Fonctions législatives limitées'],
        defaultSpace: '/espace-questeur',
        menuItems: ['dashboard', 'budget', 'resources', 'administration', 'services']
    },

    secretary: {
        role: 'SECRETARY',
        title: 'Secrétaire du Bureau',
        honorific: 'Honorable Secrétaire',
        shortTitle: 'Secrétaire',
        capabilities: [
            'Rédaction des procès-verbaux',
            'Organisation documentaire',
            'Suivi des votes',
            'Assistance au Bureau'
        ],
        restrictions: ['Accès en lecture seule à certains documents confidentiels'],
        defaultSpace: '/espace-secretaire',
        menuItems: ['dashboard', 'minutes', 'documents', 'agenda']
    },

    deputy: {
        role: 'DEPUTY',
        title: 'Député',
        honorific: 'Honorable Député',
        shortTitle: 'Député',
        capabilities: [
            'Voter les lois',
            'Déposer des propositions de loi',
            'Déposer des amendements',
            'Poser des questions au gouvernement',
            'Participer aux commissions',
            'Représenter sa circonscription'
        ],
        restrictions: ['Certaines fonctions réservées au Bureau'],
        defaultSpace: '/espace-depute',
        menuItems: ['dashboard', 'hemicycle', 'commissions', 'questions', 'amendments', 'agenda', 'mailbox', 'constituency']
    },

    substitute: {
        role: 'SUBSTITUTE',
        title: 'Député Suppléant',
        honorific: 'Cher(e) Suppléant(e)',
        shortTitle: 'Suppléant',
        capabilities: [
            'Suivre les travaux parlementaires',
            'Se former aux procédures',
            'Coordonner avec le titulaire',
            'Accéder aux ressources de formation'
        ],
        restrictions: ['Ne peut voter qu\'en cas de remplacement officiel', 'Accès limité aux outils législatifs'],
        defaultSpace: '/espace-suppleant',
        menuItems: ['dashboard', 'tracking', 'training', 'titular-agenda']
    },

    staff: {
        role: 'STAFF',
        title: 'Personnel Administratif',
        honorific: 'Cher(e) Collègue',
        shortTitle: 'Collègue',
        capabilities: [
            'Support administratif',
            'Gestion documentaire',
            'Assistance aux services'
        ],
        restrictions: ['Pas d\'accès aux fonctions parlementaires', 'Documents confidentiels restreints'],
        defaultSpace: '/espace-admin',
        menuItems: ['dashboard', 'documents', 'services']
    },

    super_admin: {
        role: 'SUPER_ADMIN',
        title: 'Administrateur Système',
        honorific: 'Cher Administrateur',
        shortTitle: 'Admin',
        capabilities: [
            'Configuration système',
            'Gestion des utilisateurs',
            'Paramétrage IA',
            'Accès complet'
        ],
        restrictions: [],
        defaultSpace: '/admin',
        menuItems: ['dashboard', 'users', 'settings', 'system', 'logs']
    }
};

/**
 * Obtenir le contexte de rôle basé sur le type de rôle
 */
export function getRoleContext(role: string): RoleContext {
    const normalizedRole = role.toLowerCase().replace(/-/g, '_');
    return ROLE_CONTEXTS[normalizedRole] || ROLE_CONTEXTS.deputy;
}

/**
 * Obtenir le titre honorifique pour un rôle donné
 */
export function getHonorificTitle(role: string, gender?: 'M' | 'F'): string {
    const context = getRoleContext(role);
    if (gender === 'F' && context.honorific.includes('Monsieur')) {
        return context.honorific.replace('Monsieur', 'Madame');
    }
    return context.honorific;
}

/**
 * Obtenir l'espace par défaut pour un rôle
 */
export function getDefaultSpace(role: string): string {
    const context = getRoleContext(role);
    return context.defaultSpace;
}

/**
 * Vérifier si un rôle a accès à une fonctionnalité
 */
export function hasCapability(role: string, capability: string): boolean {
    const context = getRoleContext(role);
    return context.capabilities.some(cap =>
        cap.toLowerCase().includes(capability.toLowerCase())
    );
}
