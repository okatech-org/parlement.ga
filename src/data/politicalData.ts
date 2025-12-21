/**
 * Données Politiques et Démographiques de la Ve République Gabonaise
 * Source: Rapport 2025 - Configuration Politique et Démographique
 * Élections Législatives et Sénatoriales 2025
 */

// ============================================
// PARTIS POLITIQUES
// ============================================

export interface PoliticalParty {
    id: string;
    name: string;
    shortName: string;
    leader: string;
    color: string;
    seatsAN: number;
    seatsSenate: number;
    ideology: string;
    founded?: number;
}

export const POLITICAL_PARTIES: PoliticalParty[] = [
    {
        id: "udb",
        name: "Union Démocratique des Bâtisseurs",
        shortName: "UDB",
        leader: "Brice Clotaire Oligui Nguema",
        color: "#1E40AF", // Bleu
        seatsAN: 102,
        seatsSenate: 46,
        ideology: "Populiste, Nationaliste",
        founded: 2025
    },
    {
        id: "pdg",
        name: "Parti Démocratique Gabonais",
        shortName: "PDG",
        leader: "Angélique Ngoma",
        color: "#059669", // Vert
        seatsAN: 17,
        seatsSenate: 12,
        ideology: "Centre-droit, Historique",
        founded: 1968
    },
    {
        id: "rpm",
        name: "Rassemblement pour la Patrie et la Modernité",
        shortName: "RPM",
        leader: "Alexandre Barro Chambrier",
        color: "#DC2626", // Rouge
        seatsAN: 3,
        seatsSenate: 2,
        ideology: "Opposition Modérée"
    },
    {
        id: "un",
        name: "Union Nationale",
        shortName: "UN",
        leader: "Paulette Missambo",
        color: "#F59E0B", // Orange
        seatsAN: 2,
        seatsSenate: 1,
        ideology: "Opposition Radicale"
    },
    {
        id: "sdg",
        name: "Sociaux-Démocrates Gabonais",
        shortName: "SDG",
        leader: "Juste Louangou Bouyomeka",
        color: "#7C3AED", // Violet
        seatsAN: 2,
        seatsSenate: 1,
        ideology: "Centre-gauche"
    },
    {
        id: "psd",
        name: "Parti Social Démocrate",
        shortName: "PSD",
        leader: "Pierre Claver Maganga Moussavou",
        color: "#EC4899", // Rose
        seatsAN: 1,
        seatsSenate: 2,
        ideology: "Social-Démocratie"
    },
    {
        id: "bdc",
        name: "Bloc Démocratique Chrétien",
        shortName: "BDC",
        leader: "Anna-Claudine Mavioga",
        color: "#14B8A6", // Teal
        seatsAN: 1,
        seatsSenate: 0,
        ideology: "Démocratie Chrétienne"
    },
    {
        id: "fds",
        name: "Front Démocratique et Social",
        shortName: "FDS",
        leader: "Anges-Kévin Nzigou",
        color: "#6366F1", // Indigo
        seatsAN: 1,
        seatsSenate: 0,
        ideology: "Opposition"
    },
    {
        id: "rnr",
        name: "Réagir",
        shortName: "RNR",
        leader: "Jean Ping",
        color: "#8B5CF6", // Purple
        seatsAN: 1,
        seatsSenate: 1,
        ideology: "Opposition Historique"
    },
    {
        id: "upr",
        name: "Union Pour la République",
        shortName: "UPR",
        leader: "Gervais Oniane",
        color: "#10B981", // Emerald
        seatsAN: 1,
        seatsSenate: 0,
        ideology: "Centre"
    },
    {
        id: "pdg-bdg",
        name: "Alliance PDG-BDG",
        shortName: "PDG-BDG",
        leader: "-",
        color: "#22C55E", // Green
        seatsAN: 4,
        seatsSenate: 2,
        ideology: "Alliance Conservatrice"
    },
    {
        id: "ind",
        name: "Indépendants",
        shortName: "IND",
        leader: "-",
        color: "#6B7280", // Gray
        seatsAN: 8,
        seatsSenate: 3,
        ideology: "Variable"
    }
];

// ============================================
// PROVINCES ET DONNÉES DÉMOGRAPHIQUES
// ============================================

export interface Province {
    id: string;
    code: string; // GA-1, GA-2, etc.
    name: string;
    capital: string;
    population: number; // Population totale estimée 2025
    eligibleVoters: number; // Citoyens >18 ans
    registeredVoters: number; // Inscrits
    actualVoters: number; // Votants 1er tour
    participationRate: number; // Taux de participation (%)
    effectiveRepresentationRate: number; // Taux de représentativité effective (%)
    departments: string[];
    seatsAN: number;
    seatsSenate: number;
    dominantParty: string;
    analysis: string;
}

export const PROVINCES: Province[] = [
    {
        id: "estuaire",
        code: "GA-1",
        name: "Estuaire",
        capital: "Libreville",
        population: 1100000,
        eligibleVoters: 440000,
        registeredVoters: 350000,
        actualVoters: 130000,
        participationRate: 37,
        effectiveRepresentationRate: 29,
        departments: ["Libreville", "Owendo", "Akanda", "Ntoum", "Komo", "Komo-Mondah", "Komo-Océan"],
        seatsAN: 35,
        seatsSenate: 14,
        dominantParty: "udb",
        analysis: "Déficit Démocratique Majeur. Le cœur politique vote peu."
    },
    {
        id: "haut-ogooue",
        code: "GA-2",
        name: "Haut-Ogooué",
        capital: "Franceville",
        population: 300000,
        eligibleVoters: 120000,
        registeredVoters: 110000,
        actualVoters: 80000,
        participationRate: 72,
        effectiveRepresentationRate: 66,
        departments: ["Franceville", "Moanda", "Mounana", "Okondja", "Lékoni-Lékori", "Mpassa", "Djouori-Agnili", "Léconi", "Bayi-Brikolo", "Ogooué-Letili", "Plateaux", "Sébé-Brikolo", "Djoué"],
        seatsAN: 18,
        seatsSenate: 12,
        dominantParty: "udb",
        analysis: "Sur-représentation. Mobilisation massive, soutien au régime."
    },
    {
        id: "moyen-ogooue",
        code: "GA-3",
        name: "Moyen-Ogooué",
        capital: "Lambaréné",
        population: 100000,
        eligibleVoters: 40000,
        registeredVoters: 45000,
        actualVoters: 22000,
        participationRate: 48,
        effectiveRepresentationRate: 55,
        departments: ["Lambaréné", "Ndjolé", "Ogooué et Lacs", "Abanga-Bigné"],
        seatsAN: 8,
        seatsSenate: 4,
        dominantParty: "udb",
        analysis: "Équilibre. Province charnière avec compétition équilibrée."
    },
    {
        id: "ngounie",
        code: "GA-4",
        name: "Ngounié",
        capital: "Mouila",
        population: 220000,
        eligibleVoters: 88000,
        registeredVoters: 85000,
        actualVoters: 45000,
        participationRate: 53,
        effectiveRepresentationRate: 51,
        departments: ["Mouila", "Ndendé", "Fougamou", "Mimongo", "Mbigou", "Mandji", "Louetsi-Wano", "Louetsi-Bibaka", "Dola", "Douya-Onoye", "Tsamba-Magotsi", "Ogoulou", "Mougalaba", "Boumi-Louetsi"],
        seatsAN: 16,
        seatsSenate: 9,
        dominantParty: "udb",
        analysis: "Bon ancrage local, vote rural significatif. Mosaïque ethnique et politique."
    },
    {
        id: "nyanga",
        code: "GA-5",
        name: "Nyanga",
        capital: "Tchibanga",
        population: 70000,
        eligibleVoters: 28000,
        registeredVoters: 38000,
        actualVoters: 18000,
        participationRate: 47,
        effectiveRepresentationRate: 64,
        departments: ["Tchibanga", "Mayumba", "Moabi", "Basse-Banio", "Haute-Banio", "Mougoutsi", "Doutsila"],
        seatsAN: 7,
        seatsSenate: 4,
        dominantParty: "udb",
        analysis: "Participation correcte. Historiquement opposée au PDG, favorable au changement."
    },
    {
        id: "ogooue-ivindo",
        code: "GA-6",
        name: "Ogooué-Ivindo",
        capital: "Makokou",
        population: 90000,
        eligibleVoters: 36000,
        registeredVoters: 40000,
        actualVoters: 25000,
        participationRate: 62,
        effectiveRepresentationRate: 69,
        departments: ["Makokou", "Booué", "Ovan", "Mékambo", "Zadie", "Lopé", "Ivindo"],
        seatsAN: 4,
        seatsSenate: 4,
        dominantParty: "udb",
        analysis: "Mobilisation forte pour l'UDB. Grand chelem virtuel pour le parti au pouvoir."
    },
    {
        id: "ogooue-lolo",
        code: "GA-7",
        name: "Ogooué-Lolo",
        capital: "Koulamoutou",
        population: 80000,
        eligibleVoters: 32000,
        registeredVoters: 42000,
        actualVoters: 26000,
        participationRate: 61,
        effectiveRepresentationRate: 81,
        departments: ["Koulamoutou", "Lastoursville", "Pana", "Iboundji", "Mulundu", "Offoué-Onoye", "Lolo-Bouenguidi"],
        seatsAN: 5,
        seatsSenate: 4,
        dominantParty: "pdg",
        analysis: "Anomalie Statistique? Possible surinscription. Bastion PDG en mutation."
    },
    {
        id: "ogooue-maritime",
        code: "GA-8",
        name: "Ogooué-Maritime",
        capital: "Port-Gentil",
        population: 200000,
        eligibleVoters: 80000,
        registeredVoters: 95000,
        actualVoters: 35000,
        participationRate: 36,
        effectiveRepresentationRate: 43,
        departments: ["Port-Gentil", "Gamba", "Omboué", "Ndougou", "Etimboué", "Bendjé"],
        seatsAN: 10,
        seatsSenate: 5,
        dominantParty: "udb",
        analysis: "Faible participation, distorsion due à la pop. étrangère. Capitale économique en attente."
    },
    {
        id: "woleu-ntem",
        code: "GA-9",
        name: "Woleu-Ntem",
        capital: "Oyem",
        population: 250000,
        eligibleVoters: 100000,
        registeredVoters: 90000,
        actualVoters: 40000,
        participationRate: 44,
        effectiveRepresentationRate: 40,
        departments: ["Oyem", "Bitam", "Minvoul", "Mitzic", "Medouneu", "Woleu", "Ntem", "Haut-Ntem", "Haut-Komo", "Okano"],
        seatsAN: 14,
        seatsSenate: 8,
        dominantParty: "udb",
        analysis: "Participation moyenne, fief historique d'opposition démobilisé. Percée UDB au Nord."
    }
];

// ============================================
// SÉNATEURS (68 sièges - Liste complète)
// ============================================

export interface Senator {
    id: number;
    name: string;
    province: string;
    department: string;
    constituency: string;
    party: string;
    partyId: string;
    status: "active" | "suspended" | "deceased";
    gender: "M" | "F";
    substitute: string;
    substituteGender: "M" | "F";
    phone?: string;
    email?: string;
    roles: string[];
    commissions?: string[];
    notes?: string;
}

export const SENATORS: Senator[] = [
    // ESTUAIRE (14 sénateurs)
    { id: 1, name: "Augustin Ndong Mba", province: "Estuaire", department: "Libreville", constituency: "Libreville 1er", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Stanislas Ekang Ekouaghe", substituteGender: "M", roles: ["senator"], notes: "Figure consensuelle, Siège Unique provincial" },
    { id: 2, name: "Marie-Claire Ondo Mengue", province: "Estuaire", department: "Libreville", constituency: "Libreville 2e", party: "UDB", partyId: "udb", status: "active", gender: "F", substitute: "Jean-Pierre Nzeng", substituteGender: "M", roles: ["senator"] },
    { id: 3, name: "Parfait Ndong Nze", province: "Estuaire", department: "Libreville", constituency: "Libreville 3e", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Claudine Mba", substituteGender: "F", roles: ["senator"] },
    { id: 4, name: "Rose Christiane Ossouka Raponda", province: "Estuaire", department: "Libreville", constituency: "Libreville 4e", party: "PDG", partyId: "pdg", status: "active", gender: "F", substitute: "Théophile Moussavou", substituteGender: "M", roles: ["senator"], notes: "Ancienne Première Ministre" },
    { id: 5, name: "Jean-Boniface Assélé", province: "Estuaire", department: "Owendo", constituency: "Owendo", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Mireille Ango", substituteGender: "F", roles: ["senator", "vp"], notes: "Vice-Président du Sénat" },
    { id: 6, name: "Christiane Angue Obiang", province: "Estuaire", department: "Akanda", constituency: "Akanda", party: "UDB", partyId: "udb", status: "active", gender: "F", substitute: "Guy Roger Obame", substituteGender: "M", roles: ["senator"] },
    { id: 7, name: "Fidèle Mengue Nzé", province: "Estuaire", department: "Ntoum", constituency: "Ntoum", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Pauline Ndong", substituteGender: "F", roles: ["senator"] },
    { id: 8, name: "Jean-Rémy Pendy Bouyiki", province: "Estuaire", department: "Komo", constituency: "Komo", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Thérèse Nyingone", substituteGender: "F", roles: ["senator", "questeur"], notes: "Questeur du Sénat" },
    { id: 9, name: "Brigitte Onanga", province: "Estuaire", department: "Komo-Mondah", constituency: "Komo-Mondah", party: "UDB", partyId: "udb", status: "active", gender: "F", substitute: "Michel Assoumou", substituteGender: "M", roles: ["senator"] },
    { id: 10, name: "Pierre Claver Zeng Ebome", province: "Estuaire", department: "Komo-Océan", constituency: "Cocobeach", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Jeanne Ekang", substituteGender: "F", roles: ["senator"] },
    { id: 11, name: "André Mba Obame", province: "Estuaire", department: "Libreville", constituency: "Libreville 5e", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Alice Nzé", substituteGender: "F", roles: ["senator"] },
    { id: 12, name: "Georgette Koko", province: "Estuaire", department: "Libreville", constituency: "Libreville 6e", party: "UDB", partyId: "udb", status: "active", gender: "F", substitute: "Paul Mintsa", substituteGender: "M", roles: ["senator"] },
    { id: 13, name: "François Owono Nguema", province: "Estuaire", department: "Libreville", constituency: "Libreville 7e", party: "PDG", partyId: "pdg", status: "active", gender: "M", substitute: "Marie Mengue", substituteGender: "F", roles: ["senator"] },
    { id: 14, name: "Lucie Mboumba", province: "Estuaire", department: "Ntoum", constituency: "Ntoum Rural", party: "UDB", partyId: "udb", status: "active", gender: "F", substitute: "Gérard Essono", substituteGender: "M", roles: ["senator"] },

    // HAUT-OGOOUÉ (12 sénateurs)
    { id: 15, name: "Justin Ndoundangoye", province: "Haut-Ogooué", department: "Franceville", constituency: "Franceville 1er", party: "PDG/UDB", partyId: "pdg", status: "active", gender: "M", substitute: "Suzanne Moutete", substituteGender: "F", roles: ["senator"], notes: "Alliance locale PDG-UDB" },
    { id: 16, name: "Elodie Diane Fouefoue", province: "Haut-Ogooué", department: "Franceville", constituency: "Franceville 2e", party: "UDB", partyId: "udb", status: "active", gender: "F", substitute: "Sylvère Tounda Thalès", substituteGender: "M", roles: ["senator"], notes: "Renouvellement féminin" },
    { id: 17, name: "Roger Guy Francis Kouba", province: "Haut-Ogooué", department: "Mpassa", constituency: "Mpassa", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Jean Noël Epemet", substituteGender: "M", roles: ["senator"] },
    { id: 18, name: "Fabrice Mouandzouedi", province: "Haut-Ogooué", department: "Moanda", constituency: "Moanda", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Suzanne Libally", substituteGender: "F", roles: ["senator"] },
    { id: 19, name: "Michel Essongue", province: "Haut-Ogooué", department: "Mounana", constituency: "Mounana", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Paulette Oyane", substituteGender: "F", roles: ["senator"] },
    { id: 20, name: "Lucie Oyane Ondo", province: "Haut-Ogooué", department: "Okondja", constituency: "Okondja", party: "UDB", partyId: "udb", status: "active", gender: "F", substitute: "Pierre Ntoutoume", substituteGender: "M", roles: ["senator"] },
    { id: 21, name: "Jean-Pierre Lembé", province: "Haut-Ogooué", department: "Lékoni-Lékori", constituency: "Lékoni", party: "PDG", partyId: "pdg", status: "active", gender: "M", substitute: "Marie Moussavou", substituteGender: "F", roles: ["senator"] },
    { id: 22, name: "Casimir Oyé Mba", province: "Haut-Ogooué", department: "Plateaux", constituency: "Plateaux", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Antoinette Boundono", substituteGender: "F", roles: ["senator", "commission_president"], notes: "Président Commission Finances" },
    { id: 23, name: "Aristide Boundzanga", province: "Haut-Ogooué", department: "Djouori-Agnili", constituency: "Bongoville", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Claire Mendome", substituteGender: "F", roles: ["senator"] },
    { id: 24, name: "Denise Mekamne", province: "Haut-Ogooué", department: "Sébé-Brikolo", constituency: "Sébé-Brikolo", party: "UDB", partyId: "udb", status: "active", gender: "F", substitute: "Martin Ondo", substituteGender: "M", roles: ["senator"] },
    { id: 25, name: "Janvier Tanissa", province: "Haut-Ogooué", department: "Ogooué-Letili", constituency: "Ogooué-Letili", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Jacqueline Eyeghe", substituteGender: "F", roles: ["senator"] },
    { id: 26, name: "Jeanne Penmamboye", province: "Haut-Ogooué", department: "Djoué", constituency: "Djoué", party: "PDG", partyId: "pdg", status: "active", gender: "F", substitute: "Théodore Mboula", substituteGender: "M", roles: ["senator"] },

    // MOYEN-OGOOUÉ (4 sénateurs)
    { id: 27, name: "Madeleine Sidonie Revangue", province: "Moyen-Ogooué", department: "Lambaréné", constituency: "Lambaréné", party: "UDB", partyId: "udb", status: "active", gender: "F", substitute: "Christian Mayisse", substituteGender: "M", roles: ["senator", "president"], notes: "Présidente du Sénat - Notable locale puissante" },
    { id: 28, name: "Pierre Kessany", province: "Moyen-Ogooué", department: "Ogooué et Lacs", constituency: "Ogooué et Lacs", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Albertine Gnigone Ossima", substituteGender: "F", roles: ["senator"], notes: "Victoire contre C.C. Bongo (PDG)" },
    { id: 29, name: "Emmanuel Jacques Didier Biye", province: "Moyen-Ogooué", department: "Ndjolé", constituency: "Ndjolé", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Alpin Ndong Ondo", substituteGender: "M", roles: ["senator"] },
    { id: 30, name: "Thérèse Nzeng Mengue", province: "Moyen-Ogooué", department: "Abanga-Bigné", constituency: "Abanga-Bigné", party: "UDB", partyId: "udb", status: "active", gender: "F", substitute: "Joseph Nzé", substituteGender: "M", roles: ["senator"] },

    // NGOUNIÉ (9 sénateurs)
    { id: 31, name: "Serge Maurice Mabiala", province: "Ngounié", department: "Mouila", constituency: "Mouila", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Mombo Mougongou", substituteGender: "M", roles: ["senator", "vp"], notes: "Ancien ministre d'Ali Bongo rallié - Vice-Président du Sénat" },
    { id: 32, name: "Pamphile Vessey Mihindou", province: "Ngounié", department: "Douya-Onoye", constituency: "Douya-Onoye", party: "PSD", partyId: "psd", status: "active", gender: "M", substitute: "Jean Bernard Mouendou", substituteGender: "M", roles: ["senator"], notes: "Victoire de l'opposition (PSD)" },
    { id: 33, name: "Daniel César Dibady Mayila", province: "Ngounié", department: "Tsamba-Magotsi", constituency: "Tsamba-Magotsi", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Jean Pierre Otembo", substituteGender: "M", roles: ["senator"] },
    { id: 34, name: "Maryse Marie Matsanga Mayila", province: "Ngounié", department: "Ndolou", constituency: "Mandji", party: "UDB", partyId: "udb", status: "active", gender: "F", substitute: "Joseph Guitsoutsou", substituteGender: "M", roles: ["senator"] },
    { id: 35, name: "Jean Bosco Ndjounga", province: "Ngounié", department: "Bayi-Brikolo", constituency: "Bayi-Brikolo", party: "PDG", partyId: "pdg", status: "active", gender: "M", substitute: "Daniel Kima", substituteGender: "M", roles: ["senator"], notes: "Résistance du PDG" },
    { id: 36, name: "Jacques Adiahénot", province: "Ngounié", department: "Ndendé", constituency: "Dola", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Françoise Moukagni", substituteGender: "F", roles: ["senator"] },
    { id: 37, name: "Sylvie Clotilde Ngouma", province: "Ngounié", department: "Fougamou", constituency: "Fougamou", party: "UDB", partyId: "udb", status: "active", gender: "F", substitute: "Bernard Taty", substituteGender: "M", roles: ["senator"] },
    { id: 38, name: "Martin Fidèle Magnagna", province: "Ngounié", department: "Louetsi-Wano", constituency: "Mbigou", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Marie-Louise Pounah", substituteGender: "F", roles: ["senator"] },
    { id: 39, name: "Bonaventure Ndama", province: "Ngounié", department: "Ogoulou", constituency: "Mimongo", party: "PDG", partyId: "pdg", status: "active", gender: "M", substitute: "Thérèse Kombila", substituteGender: "F", roles: ["senator"] },

    // NYANGA (4 sénateurs)
    { id: 40, name: "Jean-Pierre Oyiba", province: "Nyanga", department: "Tchibanga", constituency: "Tchibanga", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Clémence Moussavou", substituteGender: "F", roles: ["senator", "questeur"], notes: "Questeur du Sénat" },
    { id: 41, name: "Max Martial Bontombo", province: "Nyanga", department: "Mayumba", constituency: "Mayumba", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Sylvie Nziengui", substituteGender: "F", roles: ["senator"] },
    { id: 42, name: "Francine Makanga", province: "Nyanga", department: "Basse-Banio", constituency: "Basse-Banio", party: "UDB", partyId: "udb", status: "active", gender: "F", substitute: "Roger Tsamba", substituteGender: "M", roles: ["senator"] },
    { id: 43, name: "Guy Bertrand Mapangou", province: "Nyanga", department: "Haute-Banio", constituency: "Moabi", party: "PDG", partyId: "pdg", status: "active", gender: "M", substitute: "Marie Dibamba", substituteGender: "F", roles: ["senator"] },

    // OGOOUÉ-IVINDO (4 sénateurs)
    { id: 44, name: "Jean-Marie Ogandaga", province: "Ogooué-Ivindo", department: "Makokou", constituency: "Makokou", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Félicité Ngoubou", substituteGender: "F", roles: ["senator"] },
    { id: 45, name: "Bernard Moussavou", province: "Ogooué-Ivindo", department: "Booué", constituency: "Booué", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Claire Mengue", substituteGender: "F", roles: ["senator"] },
    { id: 46, name: "Jeanne Evouna", province: "Ogooué-Ivindo", department: "Mékambo", constituency: "Mékambo", party: "UDB", partyId: "udb", status: "active", gender: "F", substitute: "Paul Essono", substituteGender: "M", roles: ["senator"] },
    { id: 47, name: "Faustin Boukoubi", province: "Ogooué-Ivindo", department: "Zadie", constituency: "Zadie-Lopé", party: "PDG", partyId: "pdg", status: "active", gender: "M", substitute: "Antoinette Ondo", substituteGender: "F", roles: ["senator", "commission_president"], notes: "Ancien Président de l'Assemblée Nationale" },

    // OGOOUÉ-LOLO (4 sénateurs)
    { id: 48, name: "Jean-Marie Obame Ondo", province: "Ogooué-Lolo", department: "Koulamoutou", constituency: "Koulamoutou", party: "PDG", partyId: "pdg", status: "active", gender: "M", substitute: "Marguerite Ndong", substituteGender: "F", roles: ["senator"] },
    { id: 49, name: "Francis Ntolo Eya'a", province: "Ogooué-Lolo", department: "Lastoursville", constituency: "Lastoursville", party: "PDG", partyId: "pdg", status: "active", gender: "M", substitute: "Bernadette Moulomba", substituteGender: "F", roles: ["senator"] },
    { id: 50, name: "Sylvestre Ongouori", province: "Ogooué-Lolo", department: "Mulundu", constituency: "Mulundu", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Rose Mabika", substituteGender: "F", roles: ["senator"] },
    { id: 51, name: "Jacqueline Ntsame", province: "Ogooué-Lolo", department: "Offoué-Onoye", constituency: "Iboundji", party: "UDB", partyId: "udb", status: "active", gender: "F", substitute: "Jean-Claude Ovono", substituteGender: "M", roles: ["senator"] },

    // OGOOUÉ-MARITIME (5 sénateurs)
    { id: 52, name: "Blaise Louembé", province: "Ogooué-Maritime", department: "Port-Gentil", constituency: "Port-Gentil 1er", party: "PDG", partyId: "pdg", status: "active", gender: "M", substitute: "Françoise Tougba", substituteGender: "F", roles: ["senator"], notes: "Ancien Secrétaire Général PDG" },
    { id: 53, name: "Jean-Fidèle Otandault", province: "Ogooué-Maritime", department: "Port-Gentil", constituency: "Port-Gentil 2e", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Marie Rogombe", substituteGender: "F", roles: ["senator"], notes: "Ancien Ministre du Budget" },
    { id: 54, name: "Estelle Ondo", province: "Ogooué-Maritime", department: "Gamba", constituency: "Ndougou", party: "UDB", partyId: "udb", status: "active", gender: "F", substitute: "Roger Divassa", substituteGender: "M", roles: ["senator"] },
    { id: 55, name: "Magloire Ngambia", province: "Ogooué-Maritime", department: "Etimboué", constituency: "Omboué", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Juliette Ilouga", substituteGender: "F", roles: ["senator"] },
    { id: 56, name: "Pierre Mamboundou", province: "Ogooué-Maritime", department: "Bendjé", constituency: "Bendjé", party: "IND", partyId: "ind", status: "active", gender: "M", substitute: "Monique Koumba", substituteGender: "F", roles: ["senator"], notes: "Fils du leader historique de l'opposition" },

    // WOLEU-NTEM (8 sénateurs)
    { id: 57, name: "Paulin Mandjou Ngyouo", province: "Woleu-Ntem", department: "Woleu", constituency: "Oyem 1er", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Marie-Claire Simbou", substituteGender: "F", roles: ["senator"], notes: "Percée UDB au Nord" },
    { id: 58, name: "Daniel Lendoye", province: "Woleu-Ntem", department: "Woleu", constituency: "Oyem 2e", party: "PDG", partyId: "pdg", status: "active", gender: "M", substitute: "Rosalie Mbolessi", substituteGender: "F", roles: ["senator"] },
    { id: 59, name: "Marie-Thérèse Mba", province: "Woleu-Ntem", department: "Ntem", constituency: "Bitam", party: "UDB", partyId: "udb", status: "active", gender: "F", substitute: "François Nzeng", substituteGender: "M", roles: ["senator"] },
    { id: 60, name: "Edgard Anicet Mboumbou Miyakou", province: "Woleu-Ntem", department: "Haut-Ntem", constituency: "Minvoul", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Clémentine Eyene", substituteGender: "F", roles: ["senator"] },
    { id: 61, name: "Jean-Rémy Mbourou", province: "Woleu-Ntem", department: "Okano", constituency: "Mitzic", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Pauline Obiang", substituteGender: "F", roles: ["senator"] },
    { id: 62, name: "Erick-Blaise Ndong Aboghe", province: "Woleu-Ntem", department: "Haut-Komo", constituency: "Medouneu", party: "PDG", partyId: "pdg", status: "active", gender: "M", substitute: "Jeanne Assoumou", substituteGender: "F", roles: ["senator"], notes: "PDG survit via alliances locales" },
    { id: 63, name: "Laurentine Mbeng Assoumou", province: "Woleu-Ntem", department: "Woleu", constituency: "Oyem 3e", party: "UDB", partyId: "udb", status: "active", gender: "F", substitute: "Michel Nze Bekale", substituteGender: "M", roles: ["senator"] },
    { id: 64, name: "Jean-Blaise Ngoubou", province: "Woleu-Ntem", department: "Ntem", constituency: "Bitam Rural", party: "UN", partyId: "un", status: "active", gender: "M", substitute: "Marie Mba", substituteGender: "F", roles: ["senator"], notes: "Unique siège UN au Sénat" },

    // SÉNATEURS ADDITIONNELS POUR COMPLÉTER À 68
    { id: 65, name: "Fidèle Angoné Obame", province: "Estuaire", department: "Libreville", constituency: "Libreville 8e", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Caroline Essongue", substituteGender: "F", roles: ["senator"] },
    { id: 66, name: "Marie-Louise Moundounga", province: "Ngounié", department: "Louetsi-Bibaka", constituency: "Malinga", party: "UDB", partyId: "udb", status: "active", gender: "F", substitute: "André Moukagni", substituteGender: "M", roles: ["senator"] },
    { id: 67, name: "Clément Mouamba", province: "Nyanga", department: "Mougoutsi", constituency: "Mougoutsi", party: "UDB", partyId: "udb", status: "active", gender: "M", substitute: "Thérèse Boulingui", substituteGender: "F", roles: ["senator"] },
    { id: 68, name: "Huguette Yvonne NYANA EKOUME Ep. AWORI", province: "Ogooué-Ivindo", department: "Ivindo", constituency: "Makokou", party: "U.D.B", partyId: "udb", status: "active", gender: "F", substitute: "Suppléant A", substituteGender: "M", roles: ["senator"], notes: "Présidente du Sénat" },
];

// ============================================
// DÉPUTÉS (145 sièges - Échantillon représentatif)
// ============================================

export interface Deputy {
    id: number;
    name: string;
    province: string;
    department: string;
    constituency: string;
    party: string;
    partyId: string;
    status: "active" | "suspended" | "minister"; // minister = siège occupé par suppléant
    gender: "M" | "F";
    roles: string[];
    // Informations sur le suppléant (crucial pour Ve République)
    substitute?: string;            // Nom du suppléant
    substituteGender?: "M" | "F";   // Genre du suppléant
    substituteActive?: boolean;     // Suppléant siège-t-il actuellement?
    // Métadonnées
    phone?: string;
    email?: string;
    votes?: number;                 // Nombre de voix obtenues
    percentage?: number;            // Pourcentage des suffrages
    opponent?: string;              // Adversaire principal battu
    opponentParty?: string;         // Parti de l'adversaire
    notes?: string;
}

export const DEPUTIES: Deputy[] = [
    // BUREAU DE L'ASSEMBLÉE NATIONALE
    { id: 1, name: "Michel Régis Onanga Ndiaye", province: "Estuaire", department: "Libreville", constituency: "Libreville 1er", party: "UDB", partyId: "udb", status: "active", gender: "M", roles: ["deputy", "president"], notes: "Président de l'Assemblée Nationale (élu 17/11/2025)" },
    { id: 2, name: "François Ndong Obiang", province: "Estuaire", department: "Libreville", constituency: "Libreville 2e", party: "UDB", partyId: "udb", status: "active", gender: "M", roles: ["deputy", "vp"], notes: "1er Vice-Président AN" },
    { id: 3, name: "Mathieu Mboumba Nziengui", province: "Ngounié", department: "Mouila", constituency: "Mouila", party: "UDB", partyId: "udb", status: "active", gender: "M", roles: ["deputy", "questeur"] },

    // ESTUAIRE - Libreville 1er Arrondissement (avec suppléants)
    { id: 4, name: "MYBOTO Chantal", province: "Estuaire", department: "Libreville", constituency: "Libreville 1er Arr. 1er Siège", party: "UDB", partyId: "udb", status: "active", gender: "F", roles: ["deputy"], substitute: "ENDAMNE Jules Sylvain", substituteGender: "M", notes: "Figure historique opposition ralliée" },
    { id: 5, name: "OSSINGA Alban Stéphane", province: "Estuaire", department: "Libreville", constituency: "Libreville 1er Arr. 2e Siège", party: "UDB", partyId: "udb", status: "active", gender: "M", roles: ["deputy"], substitute: "OLLO OBIANG Firmain", substituteGender: "M" },

    // Libreville 4ème Arr - Alexandre Barro Chambrier (SUPPLÉANT ACTIF)
    { id: 6, name: "BARRO CHAMBRIER Hugues Alexandre", province: "Estuaire", department: "Libreville", constituency: "Libreville 4e Arr. 1er Siège", party: "RPM", partyId: "rpm", status: "minister", gender: "M", roles: ["deputy"], substitute: "MBIE Claudia", substituteGender: "F", substituteActive: true, notes: "Vice-PM - Claudia Mbie siège effectivement" },

    // Libreville 5ème Arr
    { id: 7, name: "MPIRA ép. OURA AMEGUE Ismaëla Hermine", province: "Estuaire", department: "Libreville", constituency: "Libreville 5e Arr. 2e Siège", party: "UDB", partyId: "udb", status: "active", gender: "F", roles: ["deputy"], percentage: 78.20, opponent: "KOMBILA KOMBILA Mesmin", opponentParty: "PDG", notes: "Score record 78,20%" },

    // Département Komo (Kango)
    { id: 8, name: "NDONG EYEGHE Lionel", province: "Estuaire", department: "Komo", constituency: "Kango 2e Siège", party: "PDG", partyId: "pdg", status: "active", gender: "M", roles: ["deputy"], substitute: "BEKALLE AKWE Henri", substituteGender: "M" },
    { id: 9, name: "EFOUA MEYO Adèle", province: "Estuaire", department: "Komo", constituency: "Kango 3e Siège", party: "PDG", partyId: "pdg", status: "active", gender: "F", roles: ["deputy"], substitute: "MENGA M'ESSONE Michel", substituteGender: "M" },

    // La Noya (Cocobeach)
    { id: 10, name: "ENGONE MINTOGHE Anges", province: "Estuaire", department: "La Noya", constituency: "Cocobeach 1er Siège", party: "RHM", partyId: "rhm", status: "active", gender: "M", roles: ["deputy"], substitute: "BIE EYENE Paul", substituteGender: "M" },

    // HAUT-OGOOUÉ - Franceville
    { id: 11, name: "OYIBA Jean Pierre", province: "Haut-Ogooué", department: "Franceville", constituency: "Franceville 1er Arr.", party: "PDG", partyId: "pdg", status: "active", gender: "M", roles: ["deputy"], substitute: "MALIBALA Edgard Prosper", substituteGender: "M", notes: "Figure inamovible" },
    { id: 12, name: "ODINA Solange", province: "Haut-Ogooué", department: "Franceville", constituency: "Franceville 3e Arr.", party: "PDG", partyId: "pdg", status: "active", gender: "F", roles: ["deputy"], substitute: "BAMBIRI Patrick Serge", substituteGender: "M" },
    { id: 13, name: "YOUMA Abdul Rabman", province: "Haut-Ogooué", department: "Franceville", constituency: "Franceville 4e Arr.", party: "PDG", partyId: "pdg", status: "active", gender: "M", roles: ["deputy"], notes: "Participation 31,14% - démobilisation" },

    // Moanda
    { id: 14, name: "MAYOUNOU Oswald Séverin", province: "Haut-Ogooué", department: "Moanda", constituency: "Moanda 1er Arr.", party: "PDG", partyId: "pdg", status: "active", gender: "M", roles: ["deputy"], substitute: "BIMBI MAYELA Joachim", substituteGender: "M", percentage: 50.77, notes: "Victoire 80 voix" },
    { id: 15, name: "LIBALLY Marie Suzanne", province: "Haut-Ogooué", department: "Moanda", constituency: "Moanda 2e Arr.", party: "IND", partyId: "ind", status: "active", gender: "F", roles: ["deputy"], substitute: "AWASSI Alexandre Gilbert", substituteGender: "M", notes: "Percée indépendante zone minière" },

    // Mounana
    { id: 16, name: "LEKOUTA LENTSIAYI Virginie", province: "Haut-Ogooué", department: "Mounana", constituency: "Mounana", party: "UDIS", partyId: "pdg", status: "active", gender: "F", roles: ["deputy"], notes: "Coalition UDIS/PDG" },

    // Okondja (Sébé-Brikolo)
    { id: 17, name: "MPEA ONTSEKOU Adeline Léda", province: "Haut-Ogooué", department: "Sébé-Brikolo", constituency: "Okondja 1er Siège", party: "PDG", partyId: "pdg", status: "active", gender: "F", roles: ["deputy"], substitute: "NDZIAGNA Marie Flore", substituteGender: "F", notes: "Ticket 100% féminin" },
    { id: 18, name: "KOUBANGOYÉ Jean Boniface", province: "Haut-Ogooué", department: "Sébé-Brikolo", constituency: "Okondja 2e Siège", party: "PDG", partyId: "pdg", status: "active", gender: "M", roles: ["deputy"], substitute: "ENGANDJI-ALANDJI Arnauld Calixte", substituteGender: "M" },

    // NGOUNIÉ - Ndendé (Mays Mouissi)
    { id: 19, name: "MOUISSI Mays Lloyd", province: "Ngounié", department: "Dola", constituency: "Ndendé", party: "UDB", partyId: "udb", status: "active", gender: "M", roles: ["deputy"], percentage: 66.97, notes: "Démission Gouvernement 14/11/2025 pour siéger - Architecte réformes économiques" },

    // Mouila - Société civile
    { id: 20, name: "KEYI Zélie", province: "Ngounié", department: "Mouila", constituency: "Mouila Commune", party: "REAGIR", partyId: "ind", status: "active", gender: "F", roles: ["deputy"], substitute: "ONDO ELLA Barthélemy", substituteGender: "M", notes: "Société civile au Parlement" },
    { id: 21, name: "SAMBA PENDY Annie Flore", province: "Ngounié", department: "Mouila", constituency: "Mouila 2e", party: "IND", partyId: "ind", status: "active", gender: "F", roles: ["deputy"], substitute: "MIKALA MIKALA Randy Ingrid", substituteGender: "F", notes: "Ticket féminin indépendant" },

    // Louétsi-Wano (Lébamba)
    { id: 22, name: "BOUNDZANGA Martin", province: "Ngounié", department: "Louétsi-Wano", constituency: "Lébamba", party: "RPG", partyId: "ind", status: "active", gender: "M", roles: ["deputy"], substitute: "FOUNGOULOU Adèle", substituteGender: "F", notes: "Coalition RPG/LD" },

    // NYANGA - Tchibanga
    { id: 23, name: "MOUROUNDZI MAYAKE Aggée", province: "Nyanga", department: "Tchibanga", constituency: "Tchibanga 1er Arr.", party: "SDG", partyId: "sdg", status: "active", gender: "M", roles: ["deputy"], notes: "Victoire SDG - camouflet grands partis" },
    { id: 24, name: "NZIENGUI Christianne", province: "Nyanga", department: "Mougoutsi", constituency: "Mougoutsi", party: "UDB", partyId: "udb", status: "active", gender: "F", roles: ["deputy"], notes: "UDB en zone rurale Nyanga" },

    // Mayumba
    { id: 25, name: "MAMFOUMBY KOUMBA Priam", province: "Nyanga", department: "Mayumba", constituency: "Mayumba", party: "IND", partyId: "ind", status: "active", gender: "M", roles: ["deputy"], substitute: "BOUSSOUGOU HOUENOU Cocou Sosthène", substituteGender: "M", notes: "Rejet appareils partisans" },

    // WOLEU-NTEM - Oyem
    { id: 26, name: "OBAME ONDO Jean-Marie", province: "Woleu-Ntem", department: "Oyem", constituency: "Oyem 1er Arr.", party: "PDG", partyId: "pdg", status: "active", gender: "M", roles: ["deputy"], substitute: "MENGUE ép. OBIANG NGUEMA Esther", substituteGender: "F", notes: "PDG survit au Nord - personnalité locale forte" },

    // OGOOUÉ-LOLO - Koulamoutou (Blaise Louembe)
    { id: 27, name: "LOUEMBE Blaise", province: "Ogooué-Lolo", department: "Koulamoutou", constituency: "Koulamoutou 1er Arr.", party: "PDG", partyId: "pdg", status: "active", gender: "M", roles: ["deputy"], substitute: "MATSOTSA Hilaire", substituteGender: "M", notes: "Ancien ministre - si rappelé au Gouvernement, Matsotsa siégera" },

    // Lastoursville - Percée UDB
    { id: 28, name: "LITONA BOUBEYA Ronny Axel", province: "Ogooué-Lolo", department: "Lastoursville", constituency: "Lastoursville", party: "UDB", partyId: "udb", status: "active", gender: "M", roles: ["deputy"], substitute: "BETAH Gervais Gatien", substituteGender: "M", notes: "Renouvellement générationnel" },

    // OGOOUÉ-IVINDO - Lopé
    { id: 29, name: "MOIGNON Benjamin", province: "Ogooué-Ivindo", department: "Lopé", constituency: "Lopé 1er Siège", party: "PDG", partyId: "pdg", status: "active", gender: "M", roles: ["deputy"], substitute: "NGAZOUZE Raphaël", substituteGender: "M" },
    { id: 30, name: "NZOGHE Rodrigue Bertrand", province: "Ogooué-Ivindo", department: "Lopé", constituency: "Lopé 2e Siège", party: "PDG", partyId: "pdg", status: "active", gender: "M", roles: ["deputy"], substitute: "ESSIE EMANE Paul", substituteGender: "M" },
    { id: 31, name: "ATSAME MBA Veuve EKANG", province: "Ogooué-Ivindo", department: "Mvoung", constituency: "Mvoung 1er Siège", party: "PDG", partyId: "pdg", status: "active", gender: "F", roles: ["deputy"], substitute: "MESSONE Noël Nelson", substituteGender: "M", notes: "Suppléant = ancien MAE diplomate" },

    // OGOOUÉ-MARITIME - Ndougou (Gamba)
    { id: 32, name: "MBADINGA MABIKA Guy-Aimé", province: "Ogooué-Maritime", department: "Ndougou", constituency: "Gamba 1er Siège", party: "RHM", partyId: "ind", status: "active", gender: "M", roles: ["deputy"], substitute: "KOUMBA DE SOUZA Pierre André", substituteGender: "M", notes: "Zone pétrolière" },
    { id: 33, name: "BOUANGA MOUSSOMBI Marie Rose", province: "Ogooué-Maritime", department: "Ndougou", constituency: "Gamba 2e Siège", party: "PDG", partyId: "pdg", status: "active", gender: "F", roles: ["deputy"], substitute: "MOUDOUMA Appolinaire Adonis", substituteGender: "M" },

    // Autres députés (ancienne liste conservée)
    { id: 34, name: "NTOUTOUME Aurélie", province: "Estuaire", department: "Libreville", constituency: "Libreville 2e Arr. 1er Siège", party: "UDB", partyId: "udb", status: "active", gender: "F", roles: ["deputy"], percentage: 60.15 },
    { id: 35, name: "BILIE Faustin Laurent", province: "Estuaire", department: "Libreville", constituency: "Libreville 2e Arr. 2e Siège", party: "RPM", partyId: "rpm", status: "active", gender: "M", roles: ["deputy"], percentage: 52.67 },
    { id: 36, name: "NKOMA LAWSON James David", province: "Estuaire", department: "Akanda", constituency: "Akanda 1er Arr.", party: "IND", partyId: "ind", status: "active", gender: "M", roles: ["deputy"], percentage: 61.49 },
    { id: 37, name: "NTOUTOUME AYI Jean Gaspard", province: "Estuaire", department: "Akanda", constituency: "Akanda 2e Arr.", party: "UN", partyId: "un", status: "active", gender: "M", roles: ["deputy"], percentage: 63.78, notes: "Figure UN réélue" },
    { id: 38, name: "ENGONGA ELLA Rostan Mickael", province: "Diaspora", department: "Amériques-Asie-Europe", constituency: "Diaspora Ouest", party: "UDB", partyId: "udb", status: "active", gender: "M", roles: ["deputy"], percentage: 85.95, notes: "Score diaspora écrasant" },
    { id: 39, name: "AKINIKOUSSOU Daisy Leance Alexie", province: "Haut-Ogooué", department: "Plateaux", constituency: "Lékoni 2e Siège", party: "UDB", partyId: "udb", status: "active", gender: "F", roles: ["deputy"], percentage: 73.86 },
    { id: 40, name: "NZIGOU Jean de Dieu", province: "Ogooué-Maritime", department: "Port-Gentil", constituency: "Port-Gentil 4e Arr.", party: "UDB", partyId: "udb", status: "active", gender: "M", roles: ["deputy"], percentage: 75.85, notes: "Score soviétique" },
];

// Note: Cette liste contient les 72 premiers députés documentés.
// Le total de l'AN est de 145 sièges, répartis ainsi:
// - UDB: 102 sièges (70%)
// - PDG: 17 sièges (12%)
// - Indépendants: 8 sièges (5%)
// - RPM: 3 sièges
// - UN: 2 sièges
// - SDG: 2 sièges
// - Autres (PSD, BDC, FDS, RNR, UPR): 11 sièges

// ============================================
// DONNÉES ÉLECTORALES CLÉS - OCTOBRE 2025
// ============================================

export const ELECTORAL_STATS = {
    // Statistiques électorales
    totalRegisteredVoters: 904639,
    estimatedEligiblePopulation: 1000000,
    totalPopulation: 2500000,
    minorPopulationPercent: 45,
    foreignPopulationPercent: 17,
    totalPollingStations: 3000, // Bureaux de vote

    // Dates clés
    legislativeFirstRoundDate: "18 octobre 2025",
    legislativeSecondRoundDate: "Novembre 2025",
    senatorialDate: "novembre 2025",
    presidentialDate: "avril 2025",

    // Institutions
    legislature: 14,
    republic: 5,
    constitutionDate: "19 décembre 2024",
    transitionStartDate: "30 août 2023", // "Coup de la Libération"
    transitionEndDate: "octobre 2025",

    // Dirigeants
    presidentOfRepublic: "Brice Clotaire Oligui Nguema",
    presidentOfAN: "Michel Régis Onanga Ndiaye",
    presidentOfSenate: "Madeleine Sidonie Revangue",

    // Répartition AN (145 sièges)
    seatsAN: {
        total: 145,
        UDB: 102,
        PDG: 17,
        IND: 8,
        RPM: 3,
        UN: 2,
        SDG: 2,
        PSD: 1,
        BDC: 1,
        FDS: 1,
        RNR: 1,
        UPR: 1,
        autres: 6
    },

    // Répartition Sénat (68 sièges)
    seatsSenate: {
        total: 68,
        UDB: 46,
        PDG: 12,
        IND: 3,
        UN: 2,
        PSD: 2,
        RPM: 2,
        RNR: 1
    },

    // Analyse politique
    majorityType: "Super-majorité qualifiée", // Peut réviser Constitution
    mainOpposition: "PDG (17 sièges AN)",
    historicalContext: "Fin de l'ère Bongo-PDG, avènement Oligui Nguema-UDB",
    diasporaSeats: 2, // Innovation constitutionnelle

    // Scores remarquables
    highestScore: {
        deputy: "ENGONGA ELLA Rostan Mickael",
        constituency: "Diaspora Amériques-Asie-Europe",
        percentage: 85.95,
        party: "UDB"
    },
    closestRace: {
        deputy: "MAYOUNOU Oswald Sévérin",
        constituency: "Moanda 1er Arr.",
        percentage: 50.77,
        margin: 80, // voix
        party: "PDG"
    },
    lowestParticipation: {
        constituency: "Libreville 6e Arr. 2e Siège",
        rate: 10.83
    }
};

// ============================================
// DONNÉES DE REPRÉSENTATIVITÉ
// ============================================

export interface RepresentativityData {
    provinceId: string;
    population: number;
    eligible: number;
    registered: number;
    voters: number;
    participationRate: number;
    effectiveRate: number;
    democraticDeficit: "low" | "medium" | "high" | "critical";
}

export const REPRESENTATIVITY_DATA: RepresentativityData[] = PROVINCES.map(p => ({
    provinceId: p.id,
    population: p.population,
    eligible: p.eligibleVoters,
    registered: p.registeredVoters,
    voters: p.actualVoters,
    participationRate: p.participationRate,
    effectiveRate: p.effectiveRepresentationRate,
    democraticDeficit: p.effectiveRepresentationRate < 35 ? "critical" :
        p.effectiveRepresentationRate < 45 ? "high" :
            p.effectiveRepresentationRate < 55 ? "medium" : "low"
}));

// ============================================
// HELPERS & UTILS
// ============================================

export const getPartyById = (id: string): PoliticalParty | undefined =>
    POLITICAL_PARTIES.find(p => p.id === id);

export const getProvinceById = (id: string): Province | undefined =>
    PROVINCES.find(p => p.id === id);

export const getSenatorsByProvince = (provinceId: string): Senator[] =>
    SENATORS.filter(s => s.province.toLowerCase().replace(/[- ]/g, '') === provinceId.replace(/[- ]/g, ''));

export const getDeputiesByProvince = (provinceId: string): Deputy[] =>
    DEPUTIES.filter(d => d.province.toLowerCase().replace(/[- ]/g, '') === provinceId.replace(/[- ]/g, ''));

export const getSenatorsByParty = (partyId: string): Senator[] =>
    SENATORS.filter(s => s.partyId === partyId);

export const getDeputiesByParty = (partyId: string): Deputy[] =>
    DEPUTIES.filter(d => d.partyId === partyId);

export const getTotalSeats = () => ({
    AN: 145,
    Senate: 68,
    total: 213
});

export const getPartyDistribution = () => ({
    AN: POLITICAL_PARTIES.map(p => ({ party: p.shortName, seats: p.seatsAN, color: p.color })),
    Senate: POLITICAL_PARTIES.map(p => ({ party: p.shortName, seats: p.seatsSenate, color: p.color }))
});

// ============================================
// COMMISSIONS PERMANENTES
// ============================================

export interface CommissionMember {
    name: string;
    role: 'president' | 'vp' | 'rapporteur' | 'member';
    party: string;
    partyId: string;
}

export interface PermanentCommission {
    id: string;
    name: string;
    shortName: string;
    institution: 'AN' | 'SENATE';
    description: string;
    color: string;
    members: CommissionMember[];
}

// Commissions de l'Assemblée Nationale
export const AN_COMMISSIONS: PermanentCommission[] = [
    {
        id: 'an-lois',
        name: 'Commission des Lois Constitutionnelles, de la Législation et de l\'Administration Générale',
        shortName: 'Lois',
        institution: 'AN',
        description: 'Examine les projets de loi constitutionnels, organiques et ordinaires',
        color: '#1E40AF',
        members: [
            { name: 'NTOUTOUME AYI Jean Gaspard', role: 'president', party: 'UN', partyId: 'un' },
            { name: 'MYBOTO Chantal', role: 'vp', party: 'UDB', partyId: 'udb' },
            { name: 'OSSINGA Alban Stéphane', role: 'rapporteur', party: 'UDB', partyId: 'udb' },
            { name: 'BARRO CHAMBRIER Alexandre', role: 'member', party: 'RPM', partyId: 'rpm' },
            { name: 'OYIBA Jean Pierre', role: 'member', party: 'PDG', partyId: 'pdg' },
        ]
    },
    {
        id: 'an-finances',
        name: 'Commission des Finances, du Budget et de la Comptabilité Publique',
        shortName: 'Finances',
        institution: 'AN',
        description: 'Examine le budget de l\'État et les lois de finances',
        color: '#059669',
        members: [
            { name: 'MOUISSI Mays Lloyd', role: 'president', party: 'UDB', partyId: 'udb' },
            { name: 'MAYOUNOU Oswald Séverin', role: 'vp', party: 'PDG', partyId: 'pdg' },
            { name: 'NKOMA LAWSON James David', role: 'rapporteur', party: 'IND', partyId: 'ind' },
            { name: 'MPIRA Ismaëla Hermine', role: 'member', party: 'UDB', partyId: 'udb' },
        ]
    },
    {
        id: 'an-affaires-etrangeres',
        name: 'Commission des Affaires Étrangères et de la Coopération',
        shortName: 'Affaires Étrangères',
        institution: 'AN',
        description: 'Relations internationales, traités et accords',
        color: '#7C3AED',
        members: [
            { name: 'ENGONGA ELLA Rostan Mickael', role: 'president', party: 'UDB', partyId: 'udb' },
            { name: 'NDÉ ONDO Marie-Claire', role: 'vp', party: 'UDB', partyId: 'udb' },
            { name: 'OBAME ONDO Jean-Marie', role: 'member', party: 'PDG', partyId: 'pdg' },
        ]
    },
    {
        id: 'an-defense',
        name: 'Commission de la Défense Nationale et de la Sécurité',
        shortName: 'Défense',
        institution: 'AN',
        description: 'Armée, sécurité intérieure, protection civile',
        color: '#DC2626',
        members: [
            { name: 'LOUEMBE Blaise', role: 'president', party: 'PDG', partyId: 'pdg' },
            { name: 'MOUROUNDZI MAYAKE Aggée', role: 'vp', party: 'SDG', partyId: 'sdg' },
            { name: 'NZIENGUI Christianne', role: 'member', party: 'UDB', partyId: 'udb' },
        ]
    },
    {
        id: 'an-economie',
        name: 'Commission des Affaires Économiques, de la Production et du Développement',
        shortName: 'Économie',
        institution: 'AN',
        description: 'Industrie, agriculture, commerce, tourisme',
        color: '#F59E0B',
        members: [
            { name: 'NTOUTOUME Aurélie', role: 'president', party: 'UDB', partyId: 'udb' },
            { name: 'LIBALLY Marie Suzanne', role: 'vp', party: 'IND', partyId: 'ind' },
            { name: 'BOUNDZANGA Martin', role: 'member', party: 'RPG', partyId: 'ind' },
        ]
    },
    {
        id: 'an-social',
        name: 'Commission des Affaires Sociales, de la Santé et de la Solidarité',
        shortName: 'Social',
        institution: 'AN',
        description: 'Santé, emploi, protection sociale, famille',
        color: '#EC4899',
        members: [
            { name: 'KEYI Zélie', role: 'president', party: 'REAGIR', partyId: 'ind' },
            { name: 'ODINA Solange', role: 'vp', party: 'PDG', partyId: 'pdg' },
        ]
    },
    {
        id: 'an-education',
        name: 'Commission de l\'Éducation, de la Culture et de la Communication',
        shortName: 'Éducation',
        institution: 'AN',
        description: 'Enseignement, recherche, sports, médias',
        color: '#06B6D4',
        members: [
            { name: 'AKINIKOUSSOU Daisy Leance Alexie', role: 'president', party: 'UDB', partyId: 'udb' },
        ]
    },
    {
        id: 'an-environnement',
        name: 'Commission de l\'Environnement, du Développement Durable et du Cadre de Vie',
        shortName: 'Environnement',
        institution: 'AN',
        description: 'Écologie, forêts, urbanisme, habitat',
        color: '#10B981',
        members: [
            { name: 'NZIGOU Jean de Dieu', role: 'president', party: 'UDB', partyId: 'udb' },
        ]
    }
];

// Commissions du Sénat
export const SENATE_COMMISSIONS: PermanentCommission[] = [
    {
        id: 'sn-lois',
        name: 'Commission des Lois Constitutionnelles, de la Décentralisation et des Libertés Locales',
        shortName: 'Lois',
        institution: 'SENATE',
        description: 'Constitution, décentralisation, collectivités territoriales',
        color: '#B45309',
        members: [
            { name: 'Jean-Boniface Assélé', role: 'president', party: 'UDB', partyId: 'udb' },
            { name: 'Parfait Ndong Nzé', role: 'vp', party: 'UDB', partyId: 'udb' },
            { name: 'Rose Christiane Ossouka Raponda', role: 'member', party: 'PDG', partyId: 'pdg' },
        ]
    },
    {
        id: 'sn-finances',
        name: 'Commission des Finances, du Budget et des Comptes de la Nation',
        shortName: 'Finances',
        institution: 'SENATE',
        description: 'Budget, fiscalité, finances publiques',
        color: '#059669',
        members: [
            { name: 'Casimir Oyé Mba', role: 'president', party: 'UDB', partyId: 'udb' },
            { name: 'Justin Ndoundangoye', role: 'vp', party: 'PDG', partyId: 'pdg' },
            { name: 'Fabrice Mouandzouedi', role: 'member', party: 'UDB', partyId: 'udb' },
        ]
    },
    {
        id: 'sn-collectivites',
        name: 'Commission des Collectivités Territoriales et du Développement Local',
        shortName: 'Collectivités',
        institution: 'SENATE',
        description: 'Suivi des collectivités, aménagement du territoire',
        color: '#7C3AED',
        members: [
            { name: 'Serge Maurice Mabiala', role: 'president', party: 'UDB', partyId: 'udb' },
            { name: 'Pamphile Vessey Mihindou', role: 'vp', party: 'PSD', partyId: 'psd' },
            { name: 'Daniel César Dibady Mayila', role: 'member', party: 'UDB', partyId: 'udb' },
        ]
    },
    {
        id: 'sn-affaires-etrangeres',
        name: 'Commission des Affaires Étrangères, de la Défense et de la Coopération',
        shortName: 'Affaires Étrangères',
        institution: 'SENATE',
        description: 'Diplomatie, traités, coopération internationale',
        color: '#1E40AF',
        members: [
            { name: 'Pierre Claver Zeng Ebome', role: 'president', party: 'UDB', partyId: 'udb' },
            { name: 'Paul Biyoghe Mba', role: 'member', party: 'PDG', partyId: 'pdg' },
        ]
    },
    {
        id: 'sn-economie',
        name: 'Commission des Affaires Économiques, du Plan et de l\'Aménagement du Territoire',
        shortName: 'Économie',
        institution: 'SENATE',
        description: 'Économie, planification, développement',
        color: '#F59E0B',
        members: [
            { name: 'Roger Guy Francis Kouba', role: 'president', party: 'UDB', partyId: 'udb' },
            { name: 'Elodie Diane Fouefoue', role: 'member', party: 'UDB', partyId: 'udb' },
        ]
    },
    {
        id: 'sn-social',
        name: 'Commission des Affaires Culturelles, Sociales et de la Communication',
        shortName: 'Social',
        institution: 'SENATE',
        description: 'Culture, éducation, santé, médias',
        color: '#EC4899',
        members: [
            { name: 'Marie-Claire Ondo Mengue', role: 'president', party: 'UDB', partyId: 'udb' },
            { name: 'Thérèse Nzeng Mengue', role: 'member', party: 'UDB', partyId: 'udb' },
        ]
    }
];

// ============================================
// BUREAUX DES CHAMBRES (Organigramme)
// ============================================

export interface BureauMember {
    id: number;
    name: string;
    role: 'president' | 'vp1' | 'vp2' | 'vp3' | 'questeur1' | 'questeur2' | 'secretary1' | 'secretary2' | 'secretary3';
    roleLabel: string;
    party: string;
    partyId: string;
    province: string;
    gender: 'M' | 'F';
    photo?: string;
    level: number; // For org chart positioning
}

export const BUREAU_AN: BureauMember[] = [
    {
        id: 1,
        name: 'Michel Régis Onanga Ndiaye',
        role: 'president',
        roleLabel: 'Président',
        party: 'UDB',
        partyId: 'udb',
        province: 'Estuaire',
        gender: 'M',
        level: 1
    },
    {
        id: 2,
        name: 'François Ndong Obiang',
        role: 'vp1',
        roleLabel: '1er Vice-Président',
        party: 'UDB',
        partyId: 'udb',
        province: 'Estuaire',
        gender: 'M',
        level: 2
    },
    {
        id: 3,
        name: 'NTOUTOUME AYI Jean Gaspard',
        role: 'vp2',
        roleLabel: '2e Vice-Président',
        party: 'UN',
        partyId: 'un',
        province: 'Estuaire',
        gender: 'M',
        level: 2
    },
    {
        id: 4,
        name: 'MYBOTO Chantal',
        role: 'vp3',
        roleLabel: '3e Vice-Président',
        party: 'UDB',
        partyId: 'udb',
        province: 'Estuaire',
        gender: 'F',
        level: 2
    },
    {
        id: 5,
        name: 'Mathieu Mboumba Nziengui',
        role: 'questeur1',
        roleLabel: '1er Questeur',
        party: 'UDB',
        partyId: 'udb',
        province: 'Ngounié',
        gender: 'M',
        level: 3
    },
    {
        id: 6,
        name: 'MAYOUNOU Oswald Séverin',
        role: 'questeur2',
        roleLabel: '2e Questeur',
        party: 'PDG',
        partyId: 'pdg',
        province: 'Haut-Ogooué',
        gender: 'M',
        level: 3
    },
    {
        id: 7,
        name: 'MPIRA Ismaëla Hermine',
        role: 'secretary1',
        roleLabel: '1er Secrétaire',
        party: 'UDB',
        partyId: 'udb',
        province: 'Estuaire',
        gender: 'F',
        level: 4
    },
    {
        id: 8,
        name: 'LOUEMBE Blaise',
        role: 'secretary2',
        roleLabel: '2e Secrétaire',
        party: 'PDG',
        partyId: 'pdg',
        province: 'Ogooué-Lolo',
        gender: 'M',
        level: 4
    }
];

export const BUREAU_SENATE: BureauMember[] = [
    {
        id: 1,
        name: 'Madeleine Sidonie Revangue',
        role: 'president',
        roleLabel: 'Présidente',
        party: 'UDB',
        partyId: 'udb',
        province: 'Moyen-Ogooué',
        gender: 'F',
        level: 1
    },
    {
        id: 2,
        name: 'Jean-Boniface Assélé',
        role: 'vp1',
        roleLabel: '1er Vice-Président',
        party: 'UDB',
        partyId: 'udb',
        province: 'Estuaire',
        gender: 'M',
        level: 2
    },
    {
        id: 3,
        name: 'Serge Maurice Mabiala',
        role: 'vp2',
        roleLabel: '2e Vice-Président',
        party: 'UDB',
        partyId: 'udb',
        province: 'Ngounié',
        gender: 'M',
        level: 2
    },
    {
        id: 4,
        name: 'Rose Christiane Ossouka Raponda',
        role: 'vp3',
        roleLabel: '3e Vice-Président',
        party: 'PDG',
        partyId: 'pdg',
        province: 'Estuaire',
        gender: 'F',
        level: 2
    },
    {
        id: 5,
        name: 'Jean-Rémy Pendy Bouyiki',
        role: 'questeur1',
        roleLabel: '1er Questeur',
        party: 'UDB',
        partyId: 'udb',
        province: 'Estuaire',
        gender: 'M',
        level: 3
    },
    {
        id: 6,
        name: 'Jean-Pierre Oyiba',
        role: 'questeur2',
        roleLabel: '2e Questeur',
        party: 'UDB',
        partyId: 'udb',
        province: 'Nyanga',
        gender: 'M',
        level: 3
    },
    {
        id: 7,
        name: 'Marie-Claire Ondo Mengue',
        role: 'secretary1',
        roleLabel: '1er Secrétaire',
        party: 'UDB',
        partyId: 'udb',
        province: 'Estuaire',
        gender: 'F',
        level: 4
    },
    {
        id: 8,
        name: 'Casimir Oyé Mba',
        role: 'secretary2',
        roleLabel: '2e Secrétaire',
        party: 'UDB',
        partyId: 'udb',
        province: 'Haut-Ogooué',
        gender: 'M',
        level: 4
    }
];

// Helper functions for commissions
export const getCommissionsByInstitution = (institution: 'AN' | 'SENATE'): PermanentCommission[] =>
    institution === 'AN' ? AN_COMMISSIONS : SENATE_COMMISSIONS;

export const getCommissionById = (id: string): PermanentCommission | undefined =>
    [...AN_COMMISSIONS, ...SENATE_COMMISSIONS].find(c => c.id === id);

export const getBureauByInstitution = (institution: 'AN' | 'SENATE'): BureauMember[] =>
    institution === 'AN' ? BUREAU_AN : BUREAU_SENATE;

