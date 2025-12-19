/**
 * Données des Sénateurs du Gabon - 6ème Législature (2025)
 * Source: Résultats officiels des élections sénatoriales 2025
 * 
 * Structure: 67 sièges totaux (64 pourvus + 3 seconds tours en attente)
 * - 15 femmes (23,4%) / 49 hommes (76,6%)
 * Mode d'élection: Suffrage universel indirect (grands électeurs)
 */

export interface SenatorData {
    id: string;
    name: string;
    gender: 'M' | 'F';
    province: string;
    circonscription: string;
    parti: string;
    substitute: {
        name: string;
        gender: 'M' | 'F' | '?';
    };
}

// Province codes for ID generation
const PROVINCE_CODES: Record<string, string> = {
    'Estuaire': 'EST',
    'Haut-Ogooué': 'HOG',
    'Moyen-Ogooué': 'MOG',
    'Ngounié': 'NGO',
    'Nyanga': 'NYA',
    'Ogooué-Ivindo': 'OIV',
    'Ogooué-Lolo': 'OLO',
    'Ogooué-Maritime': 'OMA',
    'Woleu-Ntem': 'WNT',
};

let idCounters: Record<string, number> = {};

function generateId(province: string): string {
    const code = PROVINCE_CODES[province] || 'UNK';
    if (!idCounters[code]) idCounters[code] = 0;
    idCounters[code]++;
    return `${code}${String(idCounters[code]).padStart(3, '0')}`;
}

/**
 * Liste complète des sénateurs par province
 */
export const SENATORS_DATA: SenatorData[] = [
    // ============================================
    // ESTUAIRE (13 sièges)
    // ============================================
    {
        id: generateId('Estuaire'),
        name: 'NGOUEPAZA Odette Jeanine Ep. TATY-KOUMBA',
        gender: 'F',
        province: 'Estuaire',
        circonscription: 'Libreville 1er Arr.',
        parti: 'U.N',
        substitute: { name: 'MOUKOUAKI Adolphe', gender: 'M' }
    },
    {
        id: generateId('Estuaire'),
        name: 'NTOUTOUME MEBIAME Aurélien',
        gender: 'M',
        province: 'Estuaire',
        circonscription: 'Libreville 2ème Arr.',
        parti: 'U.D.B',
        substitute: { name: 'MIMBOUI MVE Gisele', gender: 'F' }
    },
    {
        id: generateId('Estuaire'),
        name: 'MENGUE Marie Josée Ep. MINDZIBA',
        gender: 'F',
        province: 'Estuaire',
        circonscription: 'Libreville 3ème Arr.',
        parti: 'U.D.B',
        substitute: { name: 'OKOUMBA Ursele', gender: 'F' }
    },
    {
        id: generateId('Estuaire'),
        name: 'NGOUYA Florentine',
        gender: 'F',
        province: 'Estuaire',
        circonscription: 'Libreville 4ème Arr.',
        parti: 'U.D.B',
        substitute: { name: 'NGABONI ANDIE Chancia', gender: 'F' }
    },
    {
        id: generateId('Estuaire'),
        name: 'NZIENGUI NZIENGUI Edouard',
        gender: 'M',
        province: 'Estuaire',
        circonscription: 'Libreville 5ème Arr.',
        parti: 'U.D.B',
        substitute: { name: 'NZE Bernadette Ep. EKEKANG', gender: 'F' }
    },
    {
        id: generateId('Estuaire'),
        name: 'SIMA ALEXANDRE',
        gender: 'M',
        province: 'Estuaire',
        circonscription: 'Libreville 6ème Arr.',
        parti: 'U.D.B',
        substitute: { name: 'KOUMBA AGAYA Christelle', gender: 'F' }
    },
    {
        id: generateId('Estuaire'),
        name: 'OGOWE SIFFON Simon Pascal',
        gender: 'M',
        province: 'Estuaire',
        circonscription: 'Akanda',
        parti: 'U.D.B',
        substitute: { name: 'IMOUNGA OREZANS Charles', gender: 'M' }
    },
    {
        id: generateId('Estuaire'),
        name: 'OKOUONI AGNOSSI Samuel',
        gender: 'M',
        province: 'Estuaire',
        circonscription: 'Owendo',
        parti: 'U.D.B',
        substitute: { name: 'MOUBAMBA J. Bruno Prince', gender: 'M' }
    },
    {
        id: generateId('Estuaire'),
        name: 'NDONG ENZEIGNE JOSEPH',
        gender: 'M',
        province: 'Estuaire',
        circonscription: 'Komo-Mondah + Ntoum 1er',
        parti: 'U.D.B',
        substitute: { name: 'NAMBIMBOKO Clarette', gender: 'F' }
    },
    {
        id: generateId('Estuaire'),
        name: 'BIYOGHE MBA PAUL',
        gender: 'M',
        province: 'Estuaire',
        circonscription: 'Ntoum 2ème/3ème Arr.',
        parti: 'U.D.B',
        substitute: { name: 'NTOUTOUME NGUEMA CALIXTE', gender: 'M' }
    },
    {
        id: generateId('Estuaire'),
        name: 'EYENE BEKALE JEAN',
        gender: 'M',
        province: 'Estuaire',
        circonscription: 'Komo-Kango',
        parti: 'U.D.B',
        substitute: { name: 'MOUBOUASSI Hortense', gender: 'F' }
    },
    {
        id: generateId('Estuaire'),
        name: 'KOFFI ATTISSO Claude',
        gender: 'M',
        province: 'Estuaire',
        circonscription: 'Komo-Océan',
        parti: 'R.P.M/B.D.C',
        substitute: { name: 'NTOUTOUM BISSIEMOU Thierry Brice Emmanuel', gender: 'M' }
    },
    {
        id: generateId('Estuaire'),
        name: 'NDONG MBA Augustin',
        gender: 'M',
        province: 'Estuaire',
        circonscription: 'La Noya',
        parti: 'U.D.B',
        substitute: { name: 'EKANG EKOUAGHE Stanislas', gender: 'M' }
    },

    // ============================================
    // HAUT-OGOOUÉ (11 sièges confirmés + 1 second tour)
    // ============================================
    {
        id: generateId('Haut-Ogooué'),
        name: 'NDOUNDANGOYE Justin',
        gender: 'M',
        province: 'Haut-Ogooué',
        circonscription: 'Franceville 1er/2ème',
        parti: 'U.D.B/P.D.G',
        substitute: { name: 'MOUTETE Suzanne', gender: 'F' }
    },
    {
        id: generateId('Haut-Ogooué'),
        name: 'FOUEFOUE Elodie Diane Ep. SANDJOH',
        gender: 'F',
        province: 'Haut-Ogooué',
        circonscription: 'Franceville 3ème/4ème',
        parti: 'U.D.B',
        substitute: { name: 'TOUNDA THALES Sylvere', gender: 'M' }
    },
    {
        id: generateId('Haut-Ogooué'),
        name: 'KOUBA Roger Guy Francis',
        gender: 'M',
        province: 'Haut-Ogooué',
        circonscription: 'La Mpassa',
        parti: 'U.D.B/P.D.G',
        substitute: { name: 'EPEMET Jean Noel', gender: 'M' }
    },
    {
        id: generateId('Haut-Ogooué'),
        name: 'MOUANDZOUDI Fabrice',
        gender: 'M',
        province: 'Haut-Ogooué',
        circonscription: 'Lébombi-Léyou',
        parti: 'U.D.B',
        substitute: { name: 'LIBALLY Suzanne', gender: 'F' }
    },
    {
        id: generateId('Haut-Ogooué'),
        name: 'LONGHO Chrisos',
        gender: 'M',
        province: 'Haut-Ogooué',
        circonscription: 'Lékoko',
        parti: 'U.D.B',
        substitute: { name: 'MOUGHOHA MOUGHOHA Jacques', gender: 'M' }
    },
    {
        id: generateId('Haut-Ogooué'),
        name: 'ASSINA Jean',
        gender: 'M',
        province: 'Haut-Ogooué',
        circonscription: 'Plateaux',
        parti: 'U.D.B',
        substitute: { name: 'EKOU ONFIA Idriss', gender: 'M' }
    },
    {
        id: generateId('Haut-Ogooué'),
        name: 'LILLA-OLENDE Augustine Ep. EBINGA',
        gender: 'F',
        province: 'Haut-Ogooué',
        circonscription: 'Sébé-Brikolo',
        parti: 'U.D.B',
        substitute: { name: 'ONTSIRIGA Nancy Jacq Igor', gender: 'M' }
    },
    {
        id: generateId('Haut-Ogooué'),
        name: 'MBONDO NTSIGUI MBAGA Nelly',
        gender: 'F',
        province: 'Haut-Ogooué',
        circonscription: 'Djouori-Agnili',
        parti: 'IND',
        substitute: { name: 'ENTOUNGA BOUNGOU Yannick Sloon', gender: 'M' }
    },
    {
        id: generateId('Haut-Ogooué'),
        name: "M'VOUO ROBERSON OUMAR",
        gender: 'M',
        province: 'Haut-Ogooué',
        circonscription: 'La Djoué',
        parti: 'U.D.B/P.D.G',
        substitute: { name: 'AYESSE NGANGADI Camille', gender: 'M' }
    },
    {
        id: generateId('Haut-Ogooué'),
        name: 'LEWAMOUHO OBISSA Dieudonne',
        gender: 'M',
        province: 'Haut-Ogooué',
        circonscription: 'Lékabi-Léwolo',
        parti: 'U.D.B',
        substitute: { name: 'AGNOUGA Sosthene', gender: 'M' }
    },
    {
        id: generateId('Haut-Ogooué'),
        name: 'NDJOUNGA Jean Bosco',
        gender: 'M',
        province: 'Haut-Ogooué',
        circonscription: 'Bayi-Brikolo',
        parti: 'U.D.B',
        substitute: { name: 'KIMA Daniel', gender: 'M' }
    },

    // ============================================
    // MOYEN-OGOOUÉ (3 sièges)
    // ============================================
    {
        id: generateId('Moyen-Ogooué'),
        name: 'REVANGUE Madeleine Sidonie',
        gender: 'F',
        province: 'Moyen-Ogooué',
        circonscription: 'Lambaréné',
        parti: 'U.D.B',
        substitute: { name: 'MAYISSE Christian', gender: 'M' }
    },
    {
        id: generateId('Moyen-Ogooué'),
        name: 'BONGO ONDIMBA Claude Christian',
        gender: 'M',
        province: 'Moyen-Ogooué',
        circonscription: 'Ogooué et Lacs',
        parti: 'P.D.G',
        substitute: { name: 'EKOURE Sylvain', gender: 'M' }
    },
    {
        id: generateId('Moyen-Ogooué'),
        name: 'BIYE Emmanuel Jean Didier',
        gender: 'M',
        province: 'Moyen-Ogooué',
        circonscription: 'Abanga-Bigné',
        parti: 'U.D.B',
        substitute: { name: 'NDONG ONDO Alpin', gender: 'M' }
    },

    // ============================================
    // NGOUNIÉ (9 sièges confirmés + 1 second tour)
    // ============================================
    {
        id: generateId('Ngounié'),
        name: 'MABIALA Serge Maurice',
        gender: 'M',
        province: 'Ngounié',
        circonscription: 'Mouila',
        parti: 'U.D.B',
        substitute: { name: 'MOMBO MOUGONGOU', gender: 'M' }
    },
    {
        id: generateId('Ngounié'),
        name: 'MIHINDOU Pamphile Vessey',
        gender: 'M',
        province: 'Ngounié',
        circonscription: 'Douya-Onoye',
        parti: 'P.S.D',
        substitute: { name: 'MOUENDOU Jean Bernard', gender: 'M' }
    },
    {
        id: generateId('Ngounié'),
        name: 'DIBADY MAYILA Dieudonne Claude',
        gender: 'M',
        province: 'Ngounié',
        circonscription: 'Tsamba-Magotsi',
        parti: 'U.D.B',
        substitute: { name: 'OTEMBO Jean Pierre', gender: 'M' }
    },
    {
        id: generateId('Ngounié'),
        name: 'MOUSSAVOU Aubierge Ep. IGOUWE ABDOULAYE',
        gender: 'F',
        province: 'Ngounié',
        circonscription: 'Mougalaba',
        parti: 'U.D.B',
        substitute: { name: 'BINZOULI Victor', gender: 'M' }
    },
    {
        id: generateId('Ngounié'),
        name: 'BIGOUAGOU BIGOUAGOU MOURELA',
        gender: 'M',
        province: 'Ngounié',
        circonscription: 'Dola',
        parti: 'U.D.B',
        substitute: { name: 'PAMA', gender: 'M' }
    },
    {
        id: generateId('Ngounié'),
        name: 'BOUNDJANGA Celestin',
        gender: 'M',
        province: 'Ngounié',
        circonscription: 'Louétsi-Wano',
        parti: 'R.P.M',
        substitute: { name: 'MALANDOU Emilienne VEUVE NGOMA', gender: 'F' }
    },
    {
        id: generateId('Ngounié'),
        name: 'NZENGUE MAYILA Philippe',
        gender: 'M',
        province: 'Ngounié',
        circonscription: 'Louétsi-Bibaka',
        parti: 'L.D',
        substitute: { name: 'MANGONGO Emmanuel', gender: 'M' }
    },
    {
        id: generateId('Ngounié'),
        name: 'GNEMBOU MOUTSONA Therence',
        gender: 'M',
        province: 'Ngounié',
        circonscription: 'Boumi-Louétsi',
        parti: 'U.D.B/P.R.C',
        substitute: { name: 'NYANGUI Yolande Pulcherie Ep. LITCHANGOU', gender: 'F' }
    },
    {
        id: generateId('Ngounié'),
        name: 'MOBEA Augustin',
        gender: 'M',
        province: 'Ngounié',
        circonscription: 'Ogoulou',
        parti: 'R.P.M',
        substitute: { name: 'MBOUISSOU Dominique', gender: 'M' }
    },

    // ============================================
    // NYANGA (6 sièges confirmés + 1 second tour)
    // ============================================
    {
        id: generateId('Nyanga'),
        name: 'MAGHOUMBOU Ep. NDJAMI Liliane Anette',
        gender: 'F',
        province: 'Nyanga',
        circonscription: 'Tchibanga',
        parti: 'U.D.B',
        substitute: { name: 'KOUMBA Jean Francois', gender: 'M' }
    },
    {
        id: generateId('Nyanga'),
        name: 'KOUMBA Jean Fidele',
        gender: 'M',
        province: 'Nyanga',
        circonscription: 'Mougoutsi',
        parti: 'U.D.B',
        substitute: { name: 'KOUMBA MOUSSAVOU Etienne', gender: 'M' }
    },
    {
        id: generateId('Nyanga'),
        name: 'NGOUBOU Etienne Dieudonne',
        gender: 'M',
        province: 'Nyanga',
        circonscription: 'Basse-Banio',
        parti: 'U.D.B',
        substitute: { name: 'AKANGOUANE Glwandys Andrea', gender: 'M' }
    },
    {
        id: generateId('Nyanga'),
        name: 'MADJINOU MBADINGA',
        gender: 'M',
        province: 'Nyanga',
        circonscription: 'Douigny',
        parti: 'U.D.B',
        substitute: { name: 'MBADINGA Michelle', gender: 'F' }
    },
    {
        id: generateId('Nyanga'),
        name: 'TATY MAVOUNGOU Jean H',
        gender: 'M',
        province: 'Nyanga',
        circonscription: 'Haute-Banio',
        parti: 'P.D.G',
        substitute: { name: 'SOKOU Léa', gender: 'F' }
    },
    {
        id: generateId('Nyanga'),
        name: 'KINGA Jean Baptiste',
        gender: 'M',
        province: 'Nyanga',
        circonscription: 'Mongo',
        parti: 'U.S.G/P.D.G',
        substitute: { name: 'IGNANGA Edwige Lydie', gender: 'F' }
    },

    // ============================================
    // OGOOUÉ-IVINDO (5 sièges)
    // ============================================
    {
        id: generateId('Ogooué-Ivindo'),
        name: 'NYANA EKOUME Ep. AWORI Huguette Yvonne',
        gender: 'F',
        province: 'Ogooué-Ivindo',
        circonscription: 'Makokou',
        parti: 'U.D.B',
        substitute: { name: 'BOUPEZE ANDANG Davy Landry', gender: 'M' }
    },
    {
        id: generateId('Ogooué-Ivindo'),
        name: 'MAMADOU BOUENI Oumar',
        gender: 'M',
        province: 'Ogooué-Ivindo',
        circonscription: 'Ivindo',
        parti: 'U.D.B',
        substitute: { name: 'EPONG KONGO Jef Edgard', gender: 'M' }
    },
    {
        id: generateId('Ogooué-Ivindo'),
        name: 'NDONG Patrick',
        gender: 'M',
        province: 'Ogooué-Ivindo',
        circonscription: 'Lopé',
        parti: 'U.D.B',
        substitute: { name: 'NDOMBIBADI Richard', gender: 'M' }
    },
    {
        id: generateId('Ogooué-Ivindo'),
        name: 'BILONG ATSAME Alain Jacques',
        gender: 'M',
        province: 'Ogooué-Ivindo',
        circonscription: 'Mvoung',
        parti: 'U.D.B',
        substitute: { name: 'NZET ENGOUANG Guy De Paul', gender: 'M' }
    },
    {
        id: generateId('Ogooué-Ivindo'),
        name: 'OWONO MBOUENGOU Jean Placide',
        gender: 'M',
        province: 'Ogooué-Ivindo',
        circonscription: 'Zadié',
        parti: 'U.D.B',
        substitute: { name: 'NDJELET Alexis Didace', gender: 'M' }
    },

    // ============================================
    // OGOOUÉ-LOLO (6 sièges)
    // ============================================
    {
        id: generateId('Ogooué-Lolo'),
        name: 'YOGHA Eric',
        gender: 'M',
        province: 'Ogooué-Lolo',
        circonscription: 'Koulamoutou',
        parti: 'U.D.B',
        substitute: { name: 'NDOUNGOU Gustave', gender: 'M' }
    },
    {
        id: generateId('Ogooué-Lolo'),
        name: 'MISSAMBO Paulette',
        gender: 'F',
        province: 'Ogooué-Lolo',
        circonscription: 'Lastoursville',
        parti: 'U.N',
        substitute: { name: 'IKISSOULOU Gustave', gender: 'M' }
    },
    {
        id: generateId('Ogooué-Lolo'),
        name: 'KOLLO MBONGO Basile',
        gender: 'M',
        province: 'Ogooué-Lolo',
        circonscription: 'Lolo-Bouénguidi',
        parti: 'L.D',
        substitute: { name: 'MOUTINDI ALFIERY Edrise', gender: 'M' }
    },
    {
        id: generateId('Ogooué-Lolo'),
        name: 'KOYE NADIA Christelle',
        gender: 'F',
        province: 'Ogooué-Lolo',
        circonscription: 'Mulundu',
        parti: 'U.D.B',
        substitute: { name: 'BALOUANGOYE James .P', gender: 'M' }
    },
    {
        id: generateId('Ogooué-Lolo'),
        name: 'NANA Ep. GHOGHO Raissa',
        gender: 'F',
        province: 'Ogooué-Lolo',
        circonscription: 'Lombo-Bouénguidi',
        parti: 'U.D.B',
        substitute: { name: 'MOUGHOGHA Anatole', gender: 'M' }
    },
    {
        id: generateId('Ogooué-Lolo'),
        name: 'MOUKAMBY Bruno',
        gender: 'M',
        province: 'Ogooué-Lolo',
        circonscription: 'Offoué-Onoye',
        parti: 'P.D.G',
        substitute: { name: 'DEFAYE Georges', gender: 'M' }
    },

    // ============================================
    // OGOOUÉ-MARITIME (5 sièges)
    // ============================================
    {
        id: generateId('Ogooué-Maritime'),
        name: 'NZE ABABE Leon',
        gender: 'M',
        province: 'Ogooué-Maritime',
        circonscription: 'Port-Gentil 1er/2ème',
        parti: 'U.D.B',
        substitute: { name: 'MBOUMBA ARONDO Michelle Paula Ep. NZAMBA', gender: 'F' }
    },
    {
        id: generateId('Ogooué-Maritime'),
        name: 'RIZOGO Pierre Rousselot',
        gender: 'M',
        province: 'Ogooué-Maritime',
        circonscription: 'Port-Gentil 3ème/4ème',
        parti: 'U.D.B',
        substitute: { name: 'NTCHOUWA Francine', gender: 'F' }
    },
    {
        id: generateId('Ogooué-Maritime'),
        name: 'NAKI Honorine',
        gender: 'F',
        province: 'Ogooué-Maritime',
        circonscription: 'Bendjé',
        parti: 'R.N.R',
        substitute: { name: 'ADEMBA YENO Philippe', gender: 'M' }
    },
    {
        id: generateId('Ogooué-Maritime'),
        name: 'MPAGA Georges',
        gender: 'M',
        province: 'Ogooué-Maritime',
        circonscription: 'Etimboué',
        parti: 'U.D.B',
        substitute: { name: 'MBURUNU MACKANDO Jean Desire', gender: 'M' }
    },
    {
        id: generateId('Ogooué-Maritime'),
        name: 'MBOUMBA Valentin',
        gender: 'M',
        province: 'Ogooué-Maritime',
        circonscription: 'Ndougou',
        parti: 'U.P.R',
        substitute: { name: 'MABIKA Nicaise', gender: 'M' }
    },

    // ============================================
    // WOLEU-NTEM (8 sièges)
    // ============================================
    {
        id: generateId('Woleu-Ntem'),
        name: 'OWONO NGUEMA Jean Christophe',
        gender: 'M',
        province: 'Woleu-Ntem',
        circonscription: 'Oyem',
        parti: 'U.D.B',
        substitute: { name: 'EVOUNA MINKO Gervais', gender: 'M' }
    },
    {
        id: generateId('Woleu-Ntem'),
        name: 'EYOGO EDZANG Patrick Karim',
        gender: 'M',
        province: 'Woleu-Ntem',
        circonscription: 'Bitam',
        parti: 'U.D.B',
        substitute: { name: 'MONEZIP BEYEME Martine', gender: 'F' }
    },
    {
        id: generateId('Woleu-Ntem'),
        name: 'BEFAME Pierre Honore',
        gender: 'M',
        province: 'Woleu-Ntem',
        circonscription: 'Mitzic',
        parti: 'U.D.B',
        substitute: { name: 'NGUEMA MBA Louis Roger', gender: 'M' }
    },
    {
        id: generateId('Woleu-Ntem'),
        name: 'ONA ESSANGUI Marc',
        gender: 'M',
        province: 'Woleu-Ntem',
        circonscription: 'Woleu',
        parti: 'U.D.B',
        substitute: { name: 'NSENGBENE Claire-Marie', gender: 'F' }
    },
    {
        id: generateId('Woleu-Ntem'),
        name: 'ZOMO YEBE Gabriel',
        gender: 'M',
        province: 'Woleu-Ntem',
        circonscription: 'Ntem',
        parti: 'U.D.B',
        substitute: { name: 'OKOUE METOGO Fabien', gender: 'M' }
    },
    {
        id: generateId('Woleu-Ntem'),
        name: 'NZE NGUEMA Jean',
        gender: 'M',
        province: 'Woleu-Ntem',
        circonscription: 'Okano',
        parti: 'U.D.B',
        substitute: { name: 'NKOUELE NANG Gaston', gender: 'M' }
    },
    {
        id: generateId('Woleu-Ntem'),
        name: 'MINDZE MI ESSONE Marie-Flora',
        gender: 'F',
        province: 'Woleu-Ntem',
        circonscription: 'Haut-Ntem',
        parti: 'U.D.B',
        substitute: { name: 'BITEGHE ASSEKO Justin', gender: 'M' }
    },
    {
        id: generateId('Woleu-Ntem'),
        name: 'NZUE EDZANG Frederic',
        gender: 'M',
        province: 'Woleu-Ntem',
        circonscription: 'Haut-Como',
        parti: 'P.D.G',
        substitute: { name: 'BIBANG BI ESSONE Robert', gender: 'M' }
    },
];

/**
 * Statistics for display
 */
export const SENATORS_STATS = {
    total: SENATORS_DATA.length,
    byGender: {
        women: SENATORS_DATA.filter(s => s.gender === 'F').length,
        men: SENATORS_DATA.filter(s => s.gender === 'M').length,
    },
    byProvince: Object.entries(
        SENATORS_DATA.reduce((acc, s) => {
            acc[s.province] = (acc[s.province] || 0) + 1;
            return acc;
        }, {} as Record<string, number>)
    ).sort((a, b) => b[1] - a[1]),
    byParty: Object.entries(
        SENATORS_DATA.reduce((acc, s) => {
            acc[s.parti] = (acc[s.parti] || 0) + 1;
            return acc;
        }, {} as Record<string, number>)
    ).sort((a, b) => b[1] - a[1]),
};

/**
 * Generate phone numbers for senators and substitutes
 * Senators: 09XXXXXX (9 prefix for senate)
 * Substitutes: 10XXXXXX (10 prefix for senate substitutes)
 */
function generateSenatorPhone(index: number): string {
    return `09${String(index + 1).padStart(6, '0')}`;
}

function generateSubstitutePhone(index: number): string {
    return `10${String(index + 1).padStart(6, '0')}`;
}

/**
 * Generate mock users from senators data
 */
export function generateSenatorMockUsers(): Record<string, {
    name: string;
    roles: string[];
    province?: string;
    circonscription?: string;
    bureauLabel?: string;
    parti?: string;
}> {
    const mockUsers: Record<string, any> = {};

    SENATORS_DATA.forEach((senator, index) => {
        // Senator
        const senatorPhone = generateSenatorPhone(index);
        mockUsers[senatorPhone] = {
            name: senator.name,
            roles: ['senator', 'citizen'],
            province: senator.province,
            circonscription: senator.circonscription,
            bureauLabel: 'Sénateur',
            parti: senator.parti,
        };

        // Substitute
        const substitutePhone = generateSubstitutePhone(index);
        mockUsers[substitutePhone] = {
            name: senator.substitute.name,
            roles: ['substitute_senator', 'citizen'],
            province: senator.province,
            circonscription: senator.circonscription,
            bureauLabel: 'Suppléant Sénateur',
            parti: senator.parti,
        };
    });

    return mockUsers;
}

// Export pre-generated mock users for direct use
export const SENATOR_MOCK_USERS = generateSenatorMockUsers();
