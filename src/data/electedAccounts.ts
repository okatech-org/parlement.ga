/**
 * Comptes des Élus Parlementaires - Ve République Gabonaise
 * Génération automatique des comptes utilisateurs avec leurs suppléants
 * 
 * Basé sur les élections législatives et sénatoriales de 2025
 */

import { DEPUTIES, SENATORS, Deputy, Senator } from './politicalData';

// Type pour un compte utilisateur d'élu
export interface ElectedUserAccount {
    id: string;
    email: string;
    fullName: string;
    institution: 'NATIONAL_ASSEMBLY' | 'SENATE' | 'PARLIAMENT';
    role: string;
    party: string;
    province: string;
    constituency: string;
    gender: 'M' | 'F';
    isSubstitute: boolean;
    substituteActive?: boolean;
    titularEmail?: string;
    createdAt: string;
}

// Fonction pour générer un email standardisé
const generateEmail = (name: string, institution: 'an' | 'senat'): string => {
    let cleanName = name.toLowerCase();
    cleanName = cleanName.replace(/\s+/g, '.');
    cleanName = cleanName.replace(/[éèêë]/g, 'e');
    cleanName = cleanName.replace(/[àâ]/g, 'a');
    cleanName = cleanName.replace(/[îï]/g, 'i');
    cleanName = cleanName.replace(/[ôö]/g, 'o');
    cleanName = cleanName.replace(/[ûü]/g, 'u');
    cleanName = cleanName.replace(/ç/g, 'c');
    cleanName = cleanName.replace(/['']/g, '');
    cleanName = cleanName.replace(/-/g, '.');
    cleanName = cleanName.replace(/\./g, '.');
    // Garder seulement les caractères alphanumériques et points
    cleanName = cleanName.replace(/[^a-z0-9.]/g, '');
    // Supprimer les points multiples
    cleanName = cleanName.replace(/\.+/g, '.');
    // Supprimer les points en début/fin
    cleanName = cleanName.replace(/^\.+|\.+$/g, '');

    return `${cleanName}@${institution}.parlement.ga`;
};

// Fonction pour déterminer le rôle parlementaire
const getParliamentaryRole = (person: Deputy | Senator, isSubstitute = false): string => {
    if (isSubstitute) return 'SUBSTITUTE';

    const roles = person.roles || [];

    if (roles.includes('president')) {
        return person.hasOwnProperty('substitute') &&
            (person as Deputy).constituency?.includes('Libreville')
            ? 'AN_PRESIDENT'
            : 'SN_PRESIDENT';
    }
    if (roles.includes('vp')) return roles.includes('senator') ? 'SN_VP' : 'AN_VP';
    if (roles.includes('questeur')) return roles.includes('senator') ? 'SN_QUESTEUR' : 'AN_QUESTEUR';
    if (roles.includes('commission_president')) return 'SN_COMMISSION_PRESIDENT';
    if (roles.includes('senator')) return 'SENATOR';
    if (roles.includes('deputy')) return 'DEPUTY';

    return 'DEPUTY';
};

// Générer les comptes des députés
export const generateDeputyAccounts = (): ElectedUserAccount[] => {
    const accounts: ElectedUserAccount[] = [];
    const now = new Date().toISOString();

    DEPUTIES.forEach((deputy) => {
        // Compte du titulaire
        const titularEmail = generateEmail(deputy.name, 'an');

        accounts.push({
            id: `deputy-${deputy.id}`,
            email: titularEmail,
            fullName: deputy.name,
            institution: 'NATIONAL_ASSEMBLY',
            role: getParliamentaryRole(deputy),
            party: deputy.party,
            province: deputy.province,
            constituency: deputy.constituency,
            gender: deputy.gender,
            isSubstitute: false,
            substituteActive: deputy.substituteActive,
            createdAt: now
        });

        // Compte du suppléant si existant
        if (deputy.substitute) {
            accounts.push({
                id: `substitute-deputy-${deputy.id}`,
                email: generateEmail(deputy.substitute, 'an'),
                fullName: deputy.substitute,
                institution: 'NATIONAL_ASSEMBLY',
                role: 'SUBSTITUTE',
                party: deputy.party,
                province: deputy.province,
                constituency: deputy.constituency,
                gender: deputy.substituteGender || 'M',
                isSubstitute: true,
                substituteActive: deputy.substituteActive || false,
                titularEmail: titularEmail,
                createdAt: now
            });
        }
    });

    return accounts;
};

// Générer les comptes des sénateurs
export const generateSenatorAccounts = (): ElectedUserAccount[] => {
    const accounts: ElectedUserAccount[] = [];
    const now = new Date().toISOString();

    SENATORS.forEach((senator) => {
        // Compte du titulaire
        const titularEmail = generateEmail(senator.name, 'senat');

        accounts.push({
            id: `senator-${senator.id}`,
            email: titularEmail,
            fullName: senator.name,
            institution: 'SENATE',
            role: getParliamentaryRole(senator),
            party: senator.party,
            province: senator.province,
            constituency: senator.constituency,
            gender: senator.gender,
            isSubstitute: false,
            createdAt: now
        });

        // Compte du suppléant si existant
        if (senator.substitute) {
            accounts.push({
                id: `substitute-senator-${senator.id}`,
                email: generateEmail(senator.substitute, 'senat'),
                fullName: senator.substitute,
                institution: 'SENATE',
                role: 'SUBSTITUTE',
                party: senator.party,
                province: senator.province,
                constituency: senator.constituency,
                gender: senator.substituteGender || 'M',
                isSubstitute: true,
                titularEmail: titularEmail,
                createdAt: now
            });
        }
    });

    return accounts;
};

// Tous les comptes d'élus
export const getAllElectedAccounts = (): ElectedUserAccount[] => {
    return [
        ...generateDeputyAccounts(),
        ...generateSenatorAccounts()
    ];
};

// Statistiques des comptes
export const getAccountStats = () => {
    const allAccounts = getAllElectedAccounts();

    const deputies = allAccounts.filter(a => a.institution === 'NATIONAL_ASSEMBLY' && !a.isSubstitute);
    const senators = allAccounts.filter(a => a.institution === 'SENATE' && !a.isSubstitute);
    const substitutes = allAccounts.filter(a => a.isSubstitute);
    const activeSubstitutes = allAccounts.filter(a => a.isSubstitute && a.substituteActive);

    const womenDeputies = deputies.filter(a => a.gender === 'F').length;
    const womenSenators = senators.filter(a => a.gender === 'F').length;

    const partiesAN = new Set(deputies.map(a => a.party));
    const partiesSenate = new Set(senators.map(a => a.party));

    return {
        total: allAccounts.length,
        deputies: deputies.length,
        senators: senators.length,
        substitutes: substitutes.length,
        activeSubstitutes: activeSubstitutes.length,
        womenDeputies,
        womenSenators,
        womenDeputiesPercent: deputies.length > 0 ? ((womenDeputies / deputies.length) * 100).toFixed(1) : '0',
        womenSenatorsPercent: senators.length > 0 ? ((womenSenators / senators.length) * 100).toFixed(1) : '0',
        partiesAN: partiesAN.size,
        partiesSenate: partiesSenate.size
    };
};

// Rechercher un compte par email
export const findAccountByEmail = (email: string): ElectedUserAccount | undefined => {
    return getAllElectedAccounts().find(a => a.email.toLowerCase() === email.toLowerCase());
};

// Rechercher les comptes par province
export const findAccountsByProvince = (province: string): ElectedUserAccount[] => {
    return getAllElectedAccounts().filter(a => a.province.toLowerCase() === province.toLowerCase());
};

// Rechercher les comptes par parti
export const findAccountsByParty = (party: string): ElectedUserAccount[] => {
    return getAllElectedAccounts().filter(a => a.party.toLowerCase() === party.toLowerCase());
};

// Obtenir le suppléant d'un titulaire
export const getSubstituteFor = (titularEmail: string): ElectedUserAccount | undefined => {
    return getAllElectedAccounts().find(a => a.titularEmail === titularEmail);
};

// Obtenir le titulaire d'un suppléant
export const getTitularFor = (substituteEmail: string): ElectedUserAccount | undefined => {
    const substitute = findAccountByEmail(substituteEmail);
    if (substitute?.titularEmail) {
        return findAccountByEmail(substitute.titularEmail);
    }
    return undefined;
};

// Export des comptes pour affichage dans l'UI
export const ELECTED_ACCOUNTS = getAllElectedAccounts();
export const ACCOUNT_STATS = getAccountStats();

// Log pour debug
console.log('Comptes élus générés:', ACCOUNT_STATS);
