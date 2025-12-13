/**
 * CORTEX - Entity: ParliamentaryRole
 * 
 * Définitions des rôles parlementaires gabonais.
 * SCOPE : Assemblée Nationale et Sénat uniquement.
 * EXCLUSION : Aucune logique municipale.
 */

// ============================================================
// ENUMS - Rôles Parlementaires
// ============================================================

/**
 * Rôles au sein du Parlement Gabonais
 */
export enum ParliamentaryRole {
  // === PRÉSIDENCE ===
  PRESIDENT = 'PRESIDENT',           // Président de l'Assemblée ou du Sénat
  VICE_PRESIDENT = 'VICE_PRESIDENT', // Vice-Président
  
  // === BUREAU ===
  QUESTEUR = 'QUESTEUR',             // Questeur (gestion financière/administrative)
  SECRETARY = 'SECRETARY',           // Secrétaire parlementaire
  
  // === ÉLUS ===
  DEPUTY = 'DEPUTY',                 // Député (Assemblée Nationale)
  SENATOR = 'SENATOR',               // Sénateur (Sénat)
  SUBSTITUTE = 'SUBSTITUTE',         // Suppléant
  
  // === STAFF ===
  STAFF = 'STAFF',                   // Personnel parlementaire
  ADMIN = 'ADMIN',                   // Administrateur système
  
  // === EXTERNES ===
  CITIZEN = 'CITIZEN',               // Citoyen / Électeur
  ANONYMOUS = 'ANONYMOUS'            // Visiteur non identifié
}

/**
 * Chambre parlementaire
 */
export enum ParliamentaryChamber {
  ASSEMBLEE_NATIONALE = 'ASSEMBLEE_NATIONALE',
  SENAT = 'SENAT'
}

/**
 * Groupes parlementaires
 */
export enum ParliamentaryGroup {
  MAJORITE = 'MAJORITE',
  OPPOSITION = 'OPPOSITION',
  NON_INSCRITS = 'NON_INSCRITS'
}

/**
 * Commissions parlementaires permanentes
 */
export enum ParliamentaryCommission {
  LOIS = 'LOIS',                               // Commission des Lois
  FINANCES = 'FINANCES',                       // Commission des Finances
  AFFAIRES_ETRANGERES = 'AFFAIRES_ETRANGERES', // Affaires Étrangères
  DEFENSE = 'DEFENSE',                         // Défense Nationale
  AFFAIRES_SOCIALES = 'AFFAIRES_SOCIALES',     // Affaires Sociales
  ECONOMIE = 'ECONOMIE',                       // Économie et Développement
  ENVIRONNEMENT = 'ENVIRONNEMENT',             // Environnement
  EDUCATION = 'EDUCATION'                      // Éducation et Culture
}

// ============================================================
// INTERFACES - Structures de données
// ============================================================

/**
 * Définition complète d'un rôle parlementaire
 */
export interface ParliamentaryRoleDefinition {
  readonly role: ParliamentaryRole;
  readonly label: string;
  readonly labelFeminin: string;
  readonly honorificMasculin: string;
  readonly honorificFeminin: string;
  readonly hierarchyLevel: number;        // 1 = plus haut
  readonly chamber?: ParliamentaryChamber;
  readonly permissions: ParliamentaryPermission[];
  readonly canVote: boolean;
  readonly canSubmitAmendments: boolean;
  readonly canAccessConfidential: boolean;
}

/**
 * Permissions parlementaires
 */
export enum ParliamentaryPermission {
  // === TRAVAIL LÉGISLATIF ===
  VIEW_LAWS = 'VIEW_LAWS',
  SUBMIT_AMENDMENT = 'SUBMIT_AMENDMENT',
  VOTE_LAW = 'VOTE_LAW',
  COSIGN_PROPOSITION = 'COSIGN_PROPOSITION',
  
  // === CONTRÔLE GOUVERNEMENT ===
  ASK_ORAL_QUESTION = 'ASK_ORAL_QUESTION',
  ASK_WRITTEN_QUESTION = 'ASK_WRITTEN_QUESTION',
  REQUEST_HEARING = 'REQUEST_HEARING',
  
  // === COMMISSIONS ===
  ATTEND_COMMISSION = 'ATTEND_COMMISSION',
  PRESIDE_COMMISSION = 'PRESIDE_COMMISSION',
  REPORT_COMMISSION = 'REPORT_COMMISSION',
  
  // === SÉANCES ===
  SPEAK_PLENARY = 'SPEAK_PLENARY',
  PRESIDE_PLENARY = 'PRESIDE_PLENARY',
  VIEW_PV = 'VIEW_PV',
  SIGN_PV = 'SIGN_PV',
  
  // === ADMINISTRATION ===
  MANAGE_BUDGET = 'MANAGE_BUDGET',
  MANAGE_STAFF = 'MANAGE_STAFF',
  MANAGE_LOGISTICS = 'MANAGE_LOGISTICS',
  
  // === COMMUNICATION ===
  SEND_OFFICIAL_CORRESPONDENCE = 'SEND_OFFICIAL_CORRESPONDENCE',
  PUBLISH_COMMUNIQUE = 'PUBLISH_COMMUNIQUE',
  
  // === ADMINISTRATION SYSTÈME ===
  ADMIN_FULL = 'ADMIN_FULL'
}

// ============================================================
// CONFIGURATION DES RÔLES
// ============================================================

export const PARLIAMENTARY_ROLE_DEFINITIONS: Record<ParliamentaryRole, ParliamentaryRoleDefinition> = {
  [ParliamentaryRole.PRESIDENT]: {
    role: ParliamentaryRole.PRESIDENT,
    label: 'Président',
    labelFeminin: 'Présidente',
    honorificMasculin: 'Monsieur le Président',
    honorificFeminin: 'Madame la Présidente',
    hierarchyLevel: 1,
    permissions: [
      ParliamentaryPermission.VIEW_LAWS,
      ParliamentaryPermission.PRESIDE_PLENARY,
      ParliamentaryPermission.SIGN_PV,
      ParliamentaryPermission.SEND_OFFICIAL_CORRESPONDENCE,
      ParliamentaryPermission.PUBLISH_COMMUNIQUE,
      ParliamentaryPermission.MANAGE_BUDGET,
      ParliamentaryPermission.MANAGE_STAFF
    ],
    canVote: true,
    canSubmitAmendments: false, // Le président est neutre
    canAccessConfidential: true
  },

  [ParliamentaryRole.VICE_PRESIDENT]: {
    role: ParliamentaryRole.VICE_PRESIDENT,
    label: 'Vice-Président',
    labelFeminin: 'Vice-Présidente',
    honorificMasculin: 'Monsieur le Vice-Président',
    honorificFeminin: 'Madame la Vice-Présidente',
    hierarchyLevel: 2,
    permissions: [
      ParliamentaryPermission.VIEW_LAWS,
      ParliamentaryPermission.PRESIDE_PLENARY,
      ParliamentaryPermission.PRESIDE_COMMISSION,
      ParliamentaryPermission.SIGN_PV,
      ParliamentaryPermission.SEND_OFFICIAL_CORRESPONDENCE
    ],
    canVote: true,
    canSubmitAmendments: false,
    canAccessConfidential: true
  },

  [ParliamentaryRole.QUESTEUR]: {
    role: ParliamentaryRole.QUESTEUR,
    label: 'Questeur',
    labelFeminin: 'Questeure',
    honorificMasculin: 'Honorable Questeur',
    honorificFeminin: 'Honorable Questeure',
    hierarchyLevel: 3,
    permissions: [
      ParliamentaryPermission.VIEW_LAWS,
      ParliamentaryPermission.MANAGE_BUDGET,
      ParliamentaryPermission.MANAGE_STAFF,
      ParliamentaryPermission.MANAGE_LOGISTICS,
      ParliamentaryPermission.VIEW_PV
    ],
    canVote: true,
    canSubmitAmendments: true,
    canAccessConfidential: true
  },

  [ParliamentaryRole.SECRETARY]: {
    role: ParliamentaryRole.SECRETARY,
    label: 'Secrétaire',
    labelFeminin: 'Secrétaire',
    honorificMasculin: 'Monsieur le Secrétaire',
    honorificFeminin: 'Madame la Secrétaire',
    hierarchyLevel: 4,
    permissions: [
      ParliamentaryPermission.VIEW_LAWS,
      ParliamentaryPermission.VIEW_PV,
      ParliamentaryPermission.SIGN_PV,
      ParliamentaryPermission.ATTEND_COMMISSION
    ],
    canVote: true,
    canSubmitAmendments: true,
    canAccessConfidential: true
  },

  [ParliamentaryRole.DEPUTY]: {
    role: ParliamentaryRole.DEPUTY,
    label: 'Député',
    labelFeminin: 'Députée',
    honorificMasculin: 'Honorable Député',
    honorificFeminin: 'Honorable Députée',
    hierarchyLevel: 5,
    chamber: ParliamentaryChamber.ASSEMBLEE_NATIONALE,
    permissions: [
      ParliamentaryPermission.VIEW_LAWS,
      ParliamentaryPermission.SUBMIT_AMENDMENT,
      ParliamentaryPermission.VOTE_LAW,
      ParliamentaryPermission.COSIGN_PROPOSITION,
      ParliamentaryPermission.ASK_ORAL_QUESTION,
      ParliamentaryPermission.ASK_WRITTEN_QUESTION,
      ParliamentaryPermission.ATTEND_COMMISSION,
      ParliamentaryPermission.REPORT_COMMISSION,
      ParliamentaryPermission.SPEAK_PLENARY,
      ParliamentaryPermission.VIEW_PV
    ],
    canVote: true,
    canSubmitAmendments: true,
    canAccessConfidential: false
  },

  [ParliamentaryRole.SENATOR]: {
    role: ParliamentaryRole.SENATOR,
    label: 'Sénateur',
    labelFeminin: 'Sénatrice',
    honorificMasculin: 'Vénérable Sénateur',
    honorificFeminin: 'Vénérable Sénatrice',
    hierarchyLevel: 5,
    chamber: ParliamentaryChamber.SENAT,
    permissions: [
      ParliamentaryPermission.VIEW_LAWS,
      ParliamentaryPermission.SUBMIT_AMENDMENT,
      ParliamentaryPermission.VOTE_LAW,
      ParliamentaryPermission.COSIGN_PROPOSITION,
      ParliamentaryPermission.ASK_ORAL_QUESTION,
      ParliamentaryPermission.ASK_WRITTEN_QUESTION,
      ParliamentaryPermission.ATTEND_COMMISSION,
      ParliamentaryPermission.REPORT_COMMISSION,
      ParliamentaryPermission.SPEAK_PLENARY,
      ParliamentaryPermission.VIEW_PV
    ],
    canVote: true,
    canSubmitAmendments: true,
    canAccessConfidential: false
  },

  [ParliamentaryRole.SUBSTITUTE]: {
    role: ParliamentaryRole.SUBSTITUTE,
    label: 'Suppléant',
    labelFeminin: 'Suppléante',
    honorificMasculin: 'Cher Suppléant',
    honorificFeminin: 'Chère Suppléante',
    hierarchyLevel: 6,
    permissions: [
      ParliamentaryPermission.VIEW_LAWS,
      ParliamentaryPermission.ATTEND_COMMISSION,
      ParliamentaryPermission.VIEW_PV
    ],
    canVote: false, // Sauf si le titulaire est absent
    canSubmitAmendments: false,
    canAccessConfidential: false
  },

  [ParliamentaryRole.STAFF]: {
    role: ParliamentaryRole.STAFF,
    label: 'Agent Parlementaire',
    labelFeminin: 'Agente Parlementaire',
    honorificMasculin: 'Cher Collègue',
    honorificFeminin: 'Chère Collègue',
    hierarchyLevel: 7,
    permissions: [
      ParliamentaryPermission.VIEW_LAWS,
      ParliamentaryPermission.VIEW_PV
    ],
    canVote: false,
    canSubmitAmendments: false,
    canAccessConfidential: false
  },

  [ParliamentaryRole.ADMIN]: {
    role: ParliamentaryRole.ADMIN,
    label: 'Administrateur',
    labelFeminin: 'Administratrice',
    honorificMasculin: 'Administrateur',
    honorificFeminin: 'Administratrice',
    hierarchyLevel: 0, // Accès technique
    permissions: [ParliamentaryPermission.ADMIN_FULL],
    canVote: false,
    canSubmitAmendments: false,
    canAccessConfidential: true
  },

  [ParliamentaryRole.CITIZEN]: {
    role: ParliamentaryRole.CITIZEN,
    label: 'Citoyen',
    labelFeminin: 'Citoyenne',
    honorificMasculin: 'Cher Citoyen',
    honorificFeminin: 'Chère Citoyenne',
    hierarchyLevel: 10,
    permissions: [ParliamentaryPermission.VIEW_LAWS],
    canVote: false,
    canSubmitAmendments: false,
    canAccessConfidential: false
  },

  [ParliamentaryRole.ANONYMOUS]: {
    role: ParliamentaryRole.ANONYMOUS,
    label: 'Visiteur',
    labelFeminin: 'Visiteuse',
    honorificMasculin: 'Cher Visiteur',
    honorificFeminin: 'Chère Visiteuse',
    hierarchyLevel: 11,
    permissions: [],
    canVote: false,
    canSubmitAmendments: false,
    canAccessConfidential: false
  }
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Vérifie si un rôle est un parlementaire (élu)
 */
export function isParliamentarian(role: ParliamentaryRole): boolean {
  return [
    ParliamentaryRole.PRESIDENT,
    ParliamentaryRole.VICE_PRESIDENT,
    ParliamentaryRole.QUESTEUR,
    ParliamentaryRole.SECRETARY,
    ParliamentaryRole.DEPUTY,
    ParliamentaryRole.SENATOR
  ].includes(role);
}

/**
 * Vérifie si un rôle appartient au Bureau
 */
export function isBureauMember(role: ParliamentaryRole): boolean {
  return [
    ParliamentaryRole.PRESIDENT,
    ParliamentaryRole.VICE_PRESIDENT,
    ParliamentaryRole.QUESTEUR,
    ParliamentaryRole.SECRETARY
  ].includes(role);
}

/**
 * Vérifie si un rôle peut voter
 */
export function canVote(role: ParliamentaryRole): boolean {
  return PARLIAMENTARY_ROLE_DEFINITIONS[role]?.canVote ?? false;
}

/**
 * Vérifie si un rôle peut soumettre des amendements
 */
export function canSubmitAmendment(role: ParliamentaryRole): boolean {
  return PARLIAMENTARY_ROLE_DEFINITIONS[role]?.canSubmitAmendments ?? false;
}

/**
 * Vérifie si un rôle a une permission spécifique
 */
export function hasPermission(role: ParliamentaryRole, permission: ParliamentaryPermission): boolean {
  const definition = PARLIAMENTARY_ROLE_DEFINITIONS[role];
  if (!definition) return false;
  
  // Admin a toutes les permissions
  if (definition.permissions.includes(ParliamentaryPermission.ADMIN_FULL)) return true;
  
  return definition.permissions.includes(permission);
}

/**
 * Retourne le titre honorifique approprié
 */
export function getHonorific(role: ParliamentaryRole, isFemale: boolean = false): string {
  const definition = PARLIAMENTARY_ROLE_DEFINITIONS[role];
  if (!definition) return 'Cher Visiteur';
  return isFemale ? definition.honorificFeminin : definition.honorificMasculin;
}

/**
 * Retourne le niveau hiérarchique d'un rôle
 */
export function getHierarchyLevel(role: ParliamentaryRole): number {
  return PARLIAMENTARY_ROLE_DEFINITIONS[role]?.hierarchyLevel ?? 99;
}

/**
 * Vérifie si un rôle peut gérer un autre rôle
 */
export function canManageRole(managerRole: ParliamentaryRole, targetRole: ParliamentaryRole): boolean {
  const managerLevel = getHierarchyLevel(managerRole);
  const targetLevel = getHierarchyLevel(targetRole);
  
  // Admin peut tout gérer
  if (managerRole === ParliamentaryRole.ADMIN) return true;
  
  // Un rôle ne peut gérer que les rôles de niveau inférieur
  return managerLevel < targetLevel;
}
