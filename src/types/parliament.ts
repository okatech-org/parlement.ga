/**
 * Types et constantes pour la structure parlementaire gabonaise
 * 5e République - Code Électoral 2025
 * 
 * Sources juridiques:
 * - Charte de la Transition
 * - Résolution 2023 portant Règlement de l'AN de la Transition (art. 6)
 * - Règlement du Sénat de la Transition (art. 9)
 * - Code Électoral Organique 2025
 * - Constitution promulguée le 19 décembre 2024
 */

// =============================================================================
// COMPOSITION DES BUREAUX
// =============================================================================

/**
 * Composition du Bureau d'une chambre parlementaire
 * Identique pour AN et Sénat sous la 5e République
 */
export interface BureauComposition {
    president: number;
    vicePresidents: number;
    questeurs: number;
    secretaires: number;
}

/**
 * Composition officielle des Bureaux (5e République)
 * Base: Résolution 2023 (AN) et Règlement Sénat (art. 9)
 */
export const BUREAU_COMPOSITION: Record<'AN' | 'SENAT', BureauComposition> = {
    AN: {
        president: 1,
        vicePresidents: 5,
        questeurs: 2,
        secretaires: 5,
    },
    SENAT: {
        president: 1,
        vicePresidents: 5,
        questeurs: 2,
        secretaires: 5,
    },
};

/**
 * Taille totale du Bureau
 */
export const getBureauSize = (chambre: 'AN' | 'SENAT'): number => {
    const b = BUREAU_COMPOSITION[chambre];
    return b.president + b.vicePresidents + b.questeurs + b.secretaires;
};

// =============================================================================
// COMPOSITION DU SÉNAT
// =============================================================================

/**
 * Composition du Sénat - 6ème Législature (2025)
 * Base: Résultats officiels des élections sénatoriales 2025
 * Mode d'élection: Suffrage universel indirect
 * 
 * Note: La composition de la Transition (37 partis + 27 société civile + 6 FDS = 70)
 * a été remplacée par des sénateurs élus au suffrage indirect.
 */
export interface SenateComposition {
    elus: number;          // Sénateurs élus
    total: number;
    mandatAnnees: number;  // Durée du mandat
}

export const SENATE_COMPOSITION: SenateComposition = {
    elus: 67,              // 67 sièges totaux
    total: 64,             // 64 sièges pourvus (3 seconds tours en attente)
    mandatAnnees: 6,       // Mandat de 6 ans (Art. Constitution)
};

// =============================================================================
// COMMISSION MIXTE PARITAIRE (CMP)
// =============================================================================

/**
 * Composition du Bureau d'une CMP
 * Parité stricte: nombre égal de députés et sénateurs
 * Base: Texte 2024 sur les organes mixtes AN/Sénat
 */
export interface CMPBureauComposition {
    president: 1; // Désigné parmi les membres (PAS réservé au Président AN)
    premierVicePresident: 1;
    vicePresidentsAN: number;
    vicePresidentsSenat: number;
    questeursAN: number;
    questeursSenat: number;
    secretairesAN: number;
    secretairesSenat: number;
}

export const CMP_BUREAU_COMPOSITION: CMPBureauComposition = {
    president: 1,
    premierVicePresident: 1,
    vicePresidentsAN: 3,
    vicePresidentsSenat: 3,
    questeursAN: 1,
    questeursSenat: 1,
    secretairesAN: 3,
    secretairesSenat: 3,
};

/**
 * Statut d'une CMP
 */
export type CMPStatus =
    | 'constitution' // En cours de constitution
    | 'deliberation' // En délibération
    | 'accord' // Accord trouvé
    | 'accord_partiel' // Accord partiel
    | 'echec'; // Échec - retour navette

/**
 * IMPORTANT: La présidence d'une CMP n'est PAS réservée au Président de l'AN
 * Elle est désignée en interne parmi les membres de la commission
 */
export const CMP_PRESIDENCY_RULE = {
    reservedToANPresident: false,
    designation: 'interne', // Élection ou décision des bureaux
    paritéStricte: true,
} as const;

// =============================================================================
// NAVETTE PARLEMENTAIRE
// =============================================================================

/**
 * Délais de promulgation (Constitution 2024)
 */
export const PROMULGATION_DELAYS = {
    normal: 25, // jours
    urgence: 10, // jours (urgence déclarée par AN, Sénat ou Gouvernement)
} as const;

/**
 * Étapes de la navette parlementaire
 */
export type NavetteStep =
    | 'depot' // Dépôt projet/proposition
    | 'premiere_lecture_an' // 1ère lecture AN
    | 'premiere_lecture_senat' // 1ère lecture Sénat
    | 'navette' // Navette entre chambres
    | 'cmp' // Commission Mixte Paritaire
    | 'nouvelle_lecture' // Nouvelle lecture après CMP
    | 'lecture_definitive' // Lecture définitive (AN dernier mot si CMP échoue)
    | 'adopte' // Texte adopté définitivement
    | 'promulgation'; // En cours de promulgation

export interface NavetteStatus {
    step: NavetteStep;
    chambreActuelle: 'AN' | 'SENAT' | 'CMP' | 'PRESIDENCE';
    lectureNumber: number;
    urgence: boolean;
    dateTransmission?: Date;
    dateLimitePromulgation?: Date;
}

// =============================================================================
// QUOTAS ÉLECTORAUX (Code Électoral 2025)
// =============================================================================

/**
 * Définition des quotas selon le Code Électoral Organique 2025
 * Base: Loi n°9/2016 actualisée par Code Électoral 2025
 */
export interface QuotaElectoral {
    pourcentage: number; // En pourcentage
    description: string;
    application: string[];
}

export const QUOTAS_ELECTORAUX = {
    femmes: {
        pourcentage: 30,
        description: 'Au moins 30% des candidats doivent être des femmes',
        application: ['AN', 'Sénat', 'Conseils locaux', 'Conseils d\'administration'],
    } as QuotaElectoral,

    jeunes: {
        pourcentage: 20,
        description: 'Au moins 20% des candidats doivent être des jeunes (≤35 ans)',
        application: ['AN', 'Conseils locaux', 'Conseils d\'administration'],
        // Note: Pour les sénatoriales, le quota de 20% concerne les femmes, pas les jeunes
    } as QuotaElectoral,
} as const;

/**
 * Définition de "jeune" selon la Charte africaine de la jeunesse
 */
export const JEUNE_AGE_MAXIMUM = 35; // ans

// =============================================================================
// ASSEMBLÉE NATIONALE
// =============================================================================

/**
 * Nombre de députés à l'AN - 6ème Législature (2025)
 * Source: Résultats officiels des élections législatives 2025
 * - 26 femmes (18,7%)
 * - 113 hommes (81,3%)
 */
export const AN_DEPUTIES_COUNT = 141;

/**
 * Rôles au sein du Bureau de l'AN
 */
export type BureauRoleAN =
    | 'president_an'
    | 'vp_an_1' | 'vp_an_2' | 'vp_an_3' | 'vp_an_4' | 'vp_an_5'
    | 'questeur_an_1' | 'questeur_an_2'
    | 'secretaire_an_1' | 'secretaire_an_2' | 'secretaire_an_3' | 'secretaire_an_4' | 'secretaire_an_5';

/**
 * Rôles au sein du Bureau du Sénat
 */
export type BureauRoleSenat =
    | 'president_senat'
    | 'vp_senat_1' | 'vp_senat_2' | 'vp_senat_3' | 'vp_senat_4' | 'vp_senat_5'
    | 'questeur_senat_1' | 'questeur_senat_2'
    | 'secretaire_senat_1' | 'secretaire_senat_2' | 'secretaire_senat_3' | 'secretaire_senat_4' | 'secretaire_senat_5';

// =============================================================================
// PARTIS POLITIQUES (2025)
// =============================================================================

/**
 * Principaux partis politiques représentés au Parlement
 * Source: Listes officielles ministère de l'Intérieur
 */
export const PARTIS_POLITIQUES = [
    { code: 'PDG', nom: 'Parti Démocratique Gabonais' },
    { code: 'UDB', nom: 'Union pour la Démocratie et le Bien-être' },
    { code: 'UPR', nom: 'Union pour le Progrès et la République' },
    { code: 'RPM', nom: 'Rassemblement pour le Progrès et la Modernité' },
    { code: 'PRC', nom: 'Parti Républicain pour le Changement' },
    { code: 'IND', nom: 'Indépendant' },
] as const;

export type PartiCode = typeof PARTIS_POLITIQUES[number]['code'];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Calcule la date limite de promulgation
 */
export const getDateLimitePromulgation = (
    dateAdoption: Date,
    urgence: boolean = false
): Date => {
    const delai = urgence ? PROMULGATION_DELAYS.urgence : PROMULGATION_DELAYS.normal;
    const dateLimite = new Date(dateAdoption);
    dateLimite.setDate(dateLimite.getDate() + delai);
    return dateLimite;
};

/**
 * Vérifie si un élu est considéré comme "jeune" selon le Code Électoral
 */
export const isJeune = (dateNaissance: Date): boolean => {
    const today = new Date();
    const age = today.getFullYear() - dateNaissance.getFullYear();
    const monthDiff = today.getMonth() - dateNaissance.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateNaissance.getDate())) {
        return age - 1 <= JEUNE_AGE_MAXIMUM;
    }
    return age <= JEUNE_AGE_MAXIMUM;
};

/**
 * Vérifie le respect du quota femmes dans une liste
 */
export const verifyQuotaFemmes = (
    totalCandidats: number,
    nombreFemmes: number
): { respecté: boolean; pourcentage: number; manquant: number } => {
    const pourcentage = (nombreFemmes / totalCandidats) * 100;
    const minimum = Math.ceil(totalCandidats * (QUOTAS_ELECTORAUX.femmes.pourcentage / 100));
    return {
        respecté: pourcentage >= QUOTAS_ELECTORAUX.femmes.pourcentage,
        pourcentage: Math.round(pourcentage * 10) / 10,
        manquant: Math.max(0, minimum - nombreFemmes),
    };
};

/**
 * Vérifie le respect du quota jeunes dans une liste
 */
export const verifyQuotaJeunes = (
    totalCandidats: number,
    nombreJeunes: number
): { respecté: boolean; pourcentage: number; manquant: number } => {
    const pourcentage = (nombreJeunes / totalCandidats) * 100;
    const minimum = Math.ceil(totalCandidats * (QUOTAS_ELECTORAUX.jeunes.pourcentage / 100));
    return {
        respecté: pourcentage >= QUOTAS_ELECTORAUX.jeunes.pourcentage,
        pourcentage: Math.round(pourcentage * 10) / 10,
        manquant: Math.max(0, minimum - nombreJeunes),
    };
};
