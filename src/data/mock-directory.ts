import { User, UserRole } from '@/neocortex/actors/PrefrontalActor';

export interface DirectoryContact extends User {
    institution: 'AN' | 'SENAT' | 'PARLEMENT';
    email: string; // for iBoite/iCorrespondance
    avatar?: string;
}

export const MOCK_DIRECTORY: DirectoryContact[] = [
    // --- BUREAU ASSEMBLÉE NATIONALE ---
    {
        id: 'an-01',
        name: 'Michel Régis Onanga Ndiaye',
        phoneNumber: '01010101',
        roles: ['president', 'deputy', 'president_congress'],
        bureauLabel: 'Président de l\'Assemblée Nationale',
        institution: 'AN',
        email: 'president@assemblee.ga'
    },
    {
        id: 'an-02',
        name: 'François Ndong Obiang',
        phoneNumber: '02020202',
        roles: ['vp', 'deputy'],
        bureauLabel: '1er Vice-Président AN',
        institution: 'AN',
        email: 'vp1@assemblee.ga'
    },
    {
        id: 'an-03',
        name: 'Richard Royembo',
        roles: ['vp', 'deputy'],
        phoneNumber: '00000001',
        bureauLabel: '2ème Vice-Président AN',
        institution: 'AN',
        email: 'vp2@assemblee.ga'
    },
    {
        id: 'an-q-01',
        name: 'Questeur Budget',
        roles: ['questeur_budget', 'questeur', 'deputy'],
        phoneNumber: '04040401',
        bureauLabel: 'Questeur en charge du Budget',
        institution: 'AN',
        email: 'q.budget@assemblee.ga'
    },

    // --- BUREAU SÉNAT ---
    {
        id: 'sen-01',
        name: 'Huguette AWORI',
        phoneNumber: '01010102',
        roles: ['president_senate', 'senator'],
        bureauLabel: 'Présidente du Sénat',
        institution: 'SENAT',
        email: 'president@senat.ga'
    },
    {
        id: 'sen-vp-01',
        name: 'MABIALA Serge Maurice',
        phoneNumber: '12121211',
        roles: ['vp_senate', 'senator'],
        bureauLabel: '1er Vice-Président Sénat',
        institution: 'SENAT',
        email: 'vp1@senat.ga'
    },

    // --- DÉPUTÉS (Échantillon) ---
    {
        id: 'dep-01',
        name: 'Jean-Claude Moussavou',
        phoneNumber: '90000001',
        roles: ['deputy'],
        bureauLabel: 'Député',
        institution: 'AN',
        circonscription: 'Mouila',
        email: 'jc.moussavou@deputes.ga'
    },
    {
        id: 'dep-02',
        name: 'Marie-Thérèse Abessolo',
        phoneNumber: '90000002',
        roles: ['deputy'],
        bureauLabel: 'Député',
        institution: 'AN',
        circonscription: 'Oyem',
        email: 'mt.abessolo@deputes.ga'
    },
    {
        id: 'dep-03',
        name: 'Albert Ondo Ossa',
        phoneNumber: '90000003',
        roles: ['deputy'],
        bureauLabel: 'Député',
        institution: 'AN',
        circonscription: 'Libreville',
        email: 'a.ondoossa@deputes.ga'
    },

    // --- SÉNATEURS (Échantillon) ---
    {
        id: 'sen-02',
        name: 'Luc Oyoubi',
        phoneNumber: '91000001',
        roles: ['senator'],
        bureauLabel: 'Sénateur',
        institution: 'SENAT',
        province: 'Haut-Ogooué',
        email: 'l.oyoubi@senat.ga'
    },
    {
        id: 'sen-03',
        name: 'Georgette Koko',
        phoneNumber: '91000002',
        roles: ['senator'],
        bureauLabel: 'Sénateur',
        institution: 'SENAT',
        province: 'Ogooué-Lolo',
        email: 'g.koko@senat.ga'
    },

    // --- ADMINISTRATEURS ---
    {
        id: 'adm-01',
        name: 'Secrétariat Général AN',
        phoneNumber: '88888888',
        roles: ['admin_an', 'secretary'],
        bureauLabel: 'Secrétariat Général',
        institution: 'AN',
        email: 'sg@assemblee.ga'
    }
];
