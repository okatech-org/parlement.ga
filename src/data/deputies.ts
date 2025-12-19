/**
 * Données complètes des Députés élus à l'Assemblée Nationale du Gabon
 * 6ème Législature 2025
 * 
 * Résultats combinés: 1er tour + 2nd tour (11 octobre 2025)
 * Total: 141 sièges
 * 
 * Répartition politique (après 2nd tour):
 * - UDB: Majoritaire (~50%)
 * - PDG: Seconde force (~25%)
 * - Autres (IND, UN, RPM, SDG, RNR, FDS, BDC, LD): ~25%
 * 
 * Source: CONER / Élections Législatives 2025
 */

export interface DeputyData {
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

export const DEPUTIES_DATA: DeputyData[] = [
    // =============================================
    // PROVINCE DE L'ESTUAIRE (EST) - 23 sièges
    // =============================================

    // Libreville - Résultats 2nd tour
    { id: 'EST001', name: 'NTOUTOUME Aurelie', gender: 'F', province: 'Estuaire', circonscription: 'Libreville 2ème Arr. - 1er Siège', parti: 'U.D.B', substitute: { name: "MINTO'O ASSEKO Jean", gender: 'M' } },
    { id: 'EST002', name: 'BILIE Faustin Laurent', gender: 'M', province: 'Estuaire', circonscription: 'Libreville 2ème Arr. - 2ème Siège', parti: 'R.P.M', substitute: { name: 'MOUGOLA MASSALA Thérèse', gender: 'F' } },
    { id: 'EST003', name: 'MBAGANGOYE Justin Rodrigue', gender: 'M', province: 'Estuaire', circonscription: 'Libreville 3ème Arr. - 2ème Siège', parti: 'U.D.B', substitute: { name: 'MAGANGA NFOUANGA Joséphine', gender: 'F' } },
    { id: 'EST004', name: 'MBA NDUTUME Christine Ep. MIHINDOU', gender: 'F', province: 'Estuaire', circonscription: 'Libreville 4ème Arr. - 1er Siège', parti: 'P.D.G', substitute: { name: 'SAMBA NZIENGUI Fresnay', gender: 'M' } },
    { id: 'EST005', name: 'MEYEKET Lin Amable Aurélien', gender: 'M', province: 'Estuaire', circonscription: 'Libreville 4ème Arr. - 2ème Siège', parti: 'U.D.B', substitute: { name: 'GNADANG MENDOME Chantal ép. OKENGUE O.', gender: 'F' } },
    { id: 'EST006', name: 'MPIRA Ép. OURA AMEGUE Ismaëla Hermine', gender: 'F', province: 'Estuaire', circonscription: 'Libreville 5ème Arr. - 1er Siège', parti: 'U.D.B', substitute: { name: 'ADIBET NTSOUE Christian', gender: 'M' } },
    { id: 'EST007', name: 'NGOME AYONG Paul', gender: 'M', province: 'Estuaire', circonscription: 'Libreville 5ème Arr. - 2ème Siège', parti: 'U.D.B', substitute: { name: 'BOUANGA Gypsie Berith', gender: 'F' } },
    { id: 'EST008', name: 'ASSOUMOU AKUE Julien Florent', gender: 'M', province: 'Estuaire', circonscription: 'Libreville 6ème Arr. - 1er Siège', parti: 'U.D.B', substitute: { name: 'BISSOLO MBEMBO Béranger', gender: 'M' } },
    { id: 'EST009', name: 'ISSIEMBI Wilfried Ghislain', gender: 'M', province: 'Estuaire', circonscription: 'Libreville 6ème Arr. - 2ème Siège', parti: 'U.D.B', substitute: { name: 'OBIANG NKOGHE Paulin Joachim', gender: 'M' } },

    // Akanda - Résultats 2nd tour
    { id: 'EST010', name: 'NKOMA Lawson James David', gender: 'M', province: 'Estuaire', circonscription: 'Akanda 1er Arr.', parti: 'IND', substitute: { name: 'DAH Ep. DENE Stéria', gender: 'F' } },
    { id: 'EST011', name: 'NTOUTOUME AYI Jean Gaspard', gender: 'M', province: 'Estuaire', circonscription: 'Akanda 2ème Arr.', parti: 'U.N', substitute: { name: 'OLAGO MBOUMBA Andreï Laud', gender: 'M' } },

    // Owendo - Résultats 2nd tour
    { id: 'EST012', name: 'OKENGUE Christian Noël', gender: 'M', province: 'Estuaire', circonscription: 'Owendo 1er Arr.', parti: 'U.D.B', substitute: { name: 'MOUELE EVA Coralie', gender: 'F' } },
    { id: 'EST013', name: 'MBAGOU née MATSOUGOU Jeanne', gender: 'F', province: 'Estuaire', circonscription: 'Owendo 2ème Arr.', parti: 'P.D.G', substitute: { name: 'NGUIE NZE Yves Simplice', gender: 'M' } },

    // Ntoum - Mix 1er tour + 2nd tour
    { id: 'EST014', name: 'NTOUTOUME Camélia ép. LECLERCQ', gender: 'F', province: 'Estuaire', circonscription: 'Ntoum 1er Arr.', parti: 'P.D.G', substitute: { name: 'RETOMBO Perrine', gender: 'F' } },
    { id: 'EST015', name: 'MONDJO Charles Oliva', gender: 'M', province: 'Estuaire', circonscription: 'Ntoum 2ème Arr.', parti: 'IND', substitute: { name: 'MBA OBAME SEDJRO Luiga Barbara', gender: 'F' } },
    { id: 'EST016', name: 'NGUEMA OBOURE née OKOME BIYOGHE Jeannette', gender: 'F', province: 'Estuaire', circonscription: 'Ntoum 3ème Arr.', parti: 'U.D.B', substitute: { name: 'MOUTSINGA Marie Francisca', gender: 'F' } },

    // Départements Estuaire - Mix 1er tour + 2nd tour
    { id: 'EST017', name: 'OLONG NDONG Albert', gender: 'M', province: 'Estuaire', circonscription: 'Komo-Mondah', parti: 'U.D.B', substitute: { name: 'NZE AFANGABELE Thierry Joachim', gender: 'M' } },
    { id: 'EST018', name: 'NDOUTOUME Jean Emmanuel', gender: 'M', province: 'Estuaire', circonscription: 'Komo-Océan', parti: 'P.D.G', substitute: { name: 'MAVOUNGOU Salamatou', gender: 'F' } },
    { id: 'EST019', name: 'NGUEMA OWONE Fortuné', gender: 'M', province: 'Estuaire', circonscription: 'Komo-Kango - 1er Siège', parti: 'P.D.G', substitute: { name: 'PENDY Aimé', gender: 'M' } },
    { id: 'EST020', name: 'NZENGUET MOUELE Pierre', gender: 'M', province: 'Estuaire', circonscription: 'Komo-Kango - 2ème Siège', parti: 'U.D.B', substitute: { name: 'ANGUE MINTSA Mireille Ép. ALLOGO EYELE', gender: 'F' } },
    { id: 'EST021', name: "MINKO M'OBAME Benoît A.", gender: 'M', province: 'Estuaire', circonscription: 'Komo-Kango - 3ème Siège', parti: 'P.D.G', substitute: { name: 'OBAME Claude Davy', gender: 'M' } },
    { id: 'EST022', name: 'OSSONEMANE NDONG Ép. NZE Edwige', gender: 'F', province: 'Estuaire', circonscription: 'La Noya - 1er Siège', parti: 'U.D.B', substitute: { name: 'BEKALE OBAME Séraphin Crépin', gender: 'M' } },
    { id: 'EST023', name: 'GEY Charles-Henri', gender: 'M', province: 'Estuaire', circonscription: 'La Noya - 2ème Siège', parti: 'U.D.B', substitute: { name: 'EMANE MBA Sévérin', gender: 'M' } },

    // =============================================
    // PROVINCE DU HAUT-OGOOUÉ (HGO) - 22 sièges
    // =============================================

    { id: 'HGO001', name: 'MAYE Ep. MANDIKI Peggy Felexie', gender: 'F', province: 'Haut-Ogooué', circonscription: 'Franceville 2ème Arr.', parti: 'P.D.G', substitute: { name: 'ANDJOUA Saturnin', gender: 'M' } },
    { id: 'HGO002', name: 'ABOUNA ALOUBA Mavie Larosa', gender: 'F', province: 'Haut-Ogooué', circonscription: 'Franceville 3ème Arr.', parti: 'P.D.G/U.D.B', substitute: { name: 'SENDZE Max Yannick', gender: 'M' } },
    { id: 'HGO003', name: 'YOUMA Abdul Rabman', gender: 'M', province: 'Haut-Ogooué', circonscription: 'Franceville 4ème Arr.', parti: 'P.D.G', substitute: { name: 'EKAYI Pauline', gender: 'F' } },
    { id: 'HGO004', name: 'ZAMBA Humel Rodolphe', gender: 'M', province: 'Haut-Ogooué', circonscription: 'La Mpassa - 1er Siège', parti: 'IND', substitute: { name: 'YABIGHUI Philippe G.C.', gender: 'M' } },
    { id: 'HGO005', name: 'OBANDA Jean Mathieu', gender: 'M', province: 'Haut-Ogooué', circonscription: 'La Mpassa - 2ème Siège', parti: 'P.D.G', substitute: { name: 'NGOUAMBA Constan Josué', gender: 'M' } },
    { id: 'HGO006', name: 'BOKOKO Rodrigue', gender: 'M', province: 'Haut-Ogooué', circonscription: 'Lébombi-Léyou', parti: 'U.D.B', substitute: { name: 'AMPEDI Pulchérie', gender: 'F' } },
    { id: 'HGO007', name: 'MAYOUNOU Oswald Sévérin', gender: 'M', province: 'Haut-Ogooué', circonscription: 'Moanda 1er Arr.', parti: 'P.D.G', substitute: { name: 'BIMBI MAYELA Joachim', gender: 'M' } },
    { id: 'HGO008', name: 'AWASSI Alexandre Gilbert', gender: 'M', province: 'Haut-Ogooué', circonscription: 'Moanda 2ème Arr.', parti: 'U.D.B', substitute: { name: 'YOUBI Falonne Rudy', gender: 'M' } },
    { id: 'HGO009', name: 'NGABIKOUMOU WADA Mesmin Boris', gender: 'M', province: 'Haut-Ogooué', circonscription: 'Lékoko', parti: 'U.D.B', substitute: { name: 'MANGOUBOU BOUMANGA Jonas', gender: 'M' } },
    { id: 'HGO010', name: 'NGOULAKIA Léon Paul', gender: 'M', province: 'Haut-Ogooué', circonscription: 'Lékoni-Lékori - 1er Siège', parti: 'P.D.G', substitute: { name: 'BOKASSA Ep. MABA Josiane', gender: 'F' } },
    { id: 'HGO011', name: 'ONGOUORI NGOUBILI Félicité', gender: 'F', province: 'Haut-Ogooué', circonscription: 'Lékoni-Lékori - 2ème Siège', parti: 'P.D.G', substitute: { name: 'NDOUNGOU Landry Martin', gender: 'M' } },
    { id: 'HGO012', name: 'OLERI Lauerick Klaus', gender: 'M', province: 'Haut-Ogooué', circonscription: 'Lékoni-Lékori - 3ème Siège', parti: 'U.D.B', substitute: { name: 'OSSOUGU LEKOUYI Aymeri Duhamel', gender: 'M' } },
    { id: 'HGO013', name: 'ONFUYA Arsène', gender: 'M', province: 'Haut-Ogooué', circonscription: 'Plateaux - 1er Siège', parti: 'U.D.B', substitute: { name: 'NGOUMA Jeanne', gender: 'F' } },
    { id: 'HGO014', name: 'AKINIKOUSSOU Daisy Leance Alexie B.', gender: 'F', province: 'Haut-Ogooué', circonscription: 'Plateaux - 2ème Siège', parti: 'U.D.B', substitute: { name: 'AMINDZA Emery', gender: 'M' } },
    { id: 'HGO015', name: 'ONKANOWA Brigitte', gender: 'F', province: 'Haut-Ogooué', circonscription: 'Sébé-Brikolo - 1er Siège', parti: 'U.D.B/PDG', substitute: { name: 'LOUBANGOYE ONKAMOUO Marcel Germain', gender: 'M' } },
    { id: 'HGO016', name: 'OSSINDJI BINOU Elvis Stessy', gender: 'M', province: 'Haut-Ogooué', circonscription: 'Sébé-Brikolo - 2ème Siège', parti: 'P.D.G', substitute: { name: 'LOUSSOU Léandre', gender: 'M' } },
    { id: 'HGO017', name: 'LENDEME Camille', gender: 'M', province: 'Haut-Ogooué', circonscription: 'Sébé-Brikolo - 3ème Siège', parti: 'P.D.G', substitute: { name: 'FOUMBANGOYE OLELI Saturnin', gender: 'M' } },
    { id: 'HGO018', name: 'DOUMALEWA Sandria Armelle Ép. YEMBI YEMBI', gender: 'F', province: 'Haut-Ogooué', circonscription: 'Djouori-Agnili', parti: 'U.D.B', substitute: { name: 'NGUEVOUSSOUGA Jules', gender: 'M' } },
    { id: 'HGO019', name: 'LEKAMBOU Jean Martin', gender: 'M', province: 'Haut-Ogooué', circonscription: 'La Djoué', parti: 'U.D.B', substitute: { name: 'ADOUGA Danie Nancy C.', gender: 'F' } },
    { id: 'HGO020', name: 'KALIMA Jeannot', gender: 'M', province: 'Haut-Ogooué', circonscription: 'Lékabi-Lewolo', parti: 'P.D.G', substitute: { name: 'NGOUNGOULOU Alice Martiale', gender: 'F' } },
    { id: 'HGO021', name: 'LENGOUNGA Euloge Bernadin', gender: 'M', province: 'Haut-Ogooué', circonscription: 'Ogooué-Létili', parti: 'P.D.G', substitute: { name: 'BIKISSA Canelle Alda', gender: 'F' } },
    { id: 'HGO022', name: 'LETSINA OYOUMI Hervé Davy', gender: 'M', province: 'Haut-Ogooué', circonscription: 'Bayi-Brikolo', parti: 'U.D.B', substitute: { name: 'TSEMBENGOYE Aubin Gildas', gender: 'M' } },

    // =============================================
    // PROVINCE DU MOYEN-OGOOUÉ (MOG) - 10 sièges
    // =============================================

    { id: 'MOG001', name: 'ROGOMBE Ep. BERRE Madeleine', gender: 'F', province: 'Moyen-Ogooué', circonscription: 'Lambaréné 1er Arr.', parti: 'P.D.G', substitute: { name: 'NZE ELIE Janvier', gender: 'M' } },
    { id: 'MOG002', name: 'AKURE DAVAIN Seraphin', gender: 'M', province: 'Moyen-Ogooué', circonscription: 'Lambaréné 2ème Arr.', parti: 'U.D.B/P.D.G', substitute: { name: 'KOUMBA Brigitte Ép. MOUTAAB', gender: 'F' } },
    { id: 'MOG003', name: 'LOUPDY Michel', gender: 'M', province: 'Moyen-Ogooué', circonscription: 'Ogooué et Lacs - 1er Siège', parti: 'P.D.G', substitute: { name: 'OYANE Eugenie', gender: 'F' } },
    { id: 'MOG004', name: 'ROBOTY Nicole Jeanine Ép. MBOU', gender: 'F', province: 'Moyen-Ogooué', circonscription: 'Ogooué et Lacs - 2ème Siège', parti: 'P.D.G/U.D.B', substitute: { name: 'NGOUA HOGREL Albert', gender: 'M' } },
    { id: 'MOG005', name: 'OGOULA Nadine Murielle Ép. OBIANG', gender: 'F', province: 'Moyen-Ogooué', circonscription: 'Ogooué et Lacs - 3ème Siège', parti: 'U.D.B', substitute: { name: 'EMBOMBA AGUEMINYA Jean Fidèle', gender: 'M' } },
    { id: 'MOG006', name: 'MAVITSI NZIENGUI Rolf Jaures', gender: 'M', province: 'Moyen-Ogooué', circonscription: 'Ogooué et Lacs - 4ème Siège', parti: 'U.D.B', substitute: { name: 'SADIMBELAYE Roseline', gender: 'F' } },
    { id: 'MOG007', name: 'BABIKA Emile', gender: 'M', province: 'Moyen-Ogooué', circonscription: 'Ogooué et Lacs - 5ème Siège', parti: 'P.D.G', substitute: { name: 'MODIKI Daniel', gender: 'M' } },
    { id: 'MOG008', name: 'NTOUTOUME Béatrice', gender: 'F', province: 'Moyen-Ogooué', circonscription: 'Abanga-Bigné - 1er Siège', parti: 'P.D.G', substitute: { name: 'ENGONE ETSAGHE Alphonse Willy Pico', gender: 'M' } },
    { id: 'MOG009', name: 'NZAMBA MIKALA Patrick', gender: 'M', province: 'Moyen-Ogooué', circonscription: 'Abanga-Bigné - 2ème Siège', parti: 'P.D.G', substitute: { name: 'EVOUNG NZE Simon Pierre', gender: 'M' } },
    { id: 'MOG010', name: 'ETOUGHE BIYOGHE Georges Joseph C.', gender: 'M', province: 'Moyen-Ogooué', circonscription: 'Abanga-Bigné - 3ème Siège', parti: 'P.D.G', substitute: { name: 'MESSENG ANGOUE Kevin', gender: 'M' } },

    // =============================================
    // PROVINCE DE LA NGOUNIÉ (NGO) - 16 sièges
    // =============================================

    { id: 'NGO001', name: 'IBINGA Marcelle Ép. ITSITSA', gender: 'F', province: 'Ngounié', circonscription: 'Mouila 1er Arr.', parti: 'U.D.B', substitute: { name: 'BOUKA Pierre Didace', gender: 'M' } },
    { id: 'NGO002', name: 'TENDELE Jean Honoré', gender: 'M', province: 'Ngounié', circonscription: 'Mouila 2ème Arr.', parti: 'U.D.B', substitute: { name: 'MOUBOUAYI Léa', gender: 'F' } },
    { id: 'NGO003', name: 'NDINGA Yvon Patrick', gender: 'M', province: 'Ngounié', circonscription: 'Douya-Onoye - 1er Siège', parti: 'U.D.B', substitute: { name: 'DINDJOUNA Adèle', gender: 'F' } },
    { id: 'NGO004', name: 'TOGO Hortense', gender: 'F', province: 'Ngounié', circonscription: 'Douya-Onoye - 2ème Siège', parti: 'P.D.G', substitute: { name: 'MOTONGO Teddy', gender: 'M' } },
    { id: 'NGO005', name: 'MAGANGA MOUSSAVOU Muetse', gender: 'M', province: 'Ngounié', circonscription: 'Douya-Onoye - 3ème Siège', parti: 'P.D.G', substitute: { name: 'IGNANGA Lady Christiany Irma', gender: 'F' } },
    { id: 'NGO006', name: 'MATSIENDI Roland', gender: 'M', province: 'Ngounié', circonscription: 'Mougalaba', parti: 'U.D.B', substitute: { name: 'MOUSSOUNDA Elka', gender: 'F' } },
    { id: 'NGO007', name: 'BAKISSI PEMBA Virginie', gender: 'F', province: 'Ngounié', circonscription: 'Tsamba-Magotsi - 1er Siège', parti: 'U.D.B', substitute: { name: 'MAROUNDOU Nelya Sylvie', gender: 'F' } },
    { id: 'NGO008', name: 'LABAYE David', gender: 'M', province: 'Ngounié', circonscription: 'Tsamba-Magotsi - 2ème Siège', parti: 'IND', substitute: { name: 'MABIA Daniel', gender: 'M' } },
    { id: 'NGO009', name: 'MOUKOUNDZI Cyriaque', gender: 'M', province: 'Ngounié', circonscription: 'Boumi-Louétsi - 1er Siège', parti: 'U.D.B', substitute: { name: 'BANGABALEMBE Mireille A.', gender: 'F' } },
    { id: 'NGO010', name: 'MOULENGUI MABENDE Martin', gender: 'M', province: 'Ngounié', circonscription: 'Boumi-Louétsi - 2ème Siège', parti: 'L.D', substitute: { name: 'MBOYI MOULEKA Bienvenu', gender: 'M' } },
    { id: 'NGO011', name: 'PENDY Moïse', gender: 'M', province: 'Ngounié', circonscription: 'Boumi-Louétsi - 3ème Siège', parti: 'U.N', substitute: { name: 'MOMBO MICKOLO James', gender: 'M' } },
    { id: 'NGO012', name: 'IDYATHA NGUIMBI Pacôme Modeste', gender: 'M', province: 'Ngounié', circonscription: 'Ogoulou - 1er Siège', parti: 'U.D.B', substitute: { name: 'MOUBOUASSI Pamela', gender: 'F' } },
    { id: 'NGO013', name: 'MONDENDET KOGHE Fabrice Désiré', gender: 'M', province: 'Ngounié', circonscription: 'Ogoulou - 2ème Siège', parti: 'U.D.B', substitute: { name: 'NDJONDO GNOVO Rodrigue', gender: 'M' } },
    { id: 'NGO014', name: 'NDONGOU Jean François', gender: 'M', province: 'Ngounié', circonscription: 'Ndolou - 1er Siège', parti: 'P.D.G', substitute: { name: 'BILOMBI Pierre Clara Ép. MAKOMBO', gender: 'F' } },
    { id: 'NGO015', name: 'MBOUMI NZINZI Jean-Claude', gender: 'M', province: 'Ngounié', circonscription: 'Ndolou - 2ème Siège', parti: 'P.D.G', substitute: { name: 'DINY Stéphane', gender: 'M' } },
    { id: 'NGO016', name: 'MANFOUMBI Yves Fernand', gender: 'M', province: 'Ngounié', circonscription: 'Dola', parti: 'P.D.G', substitute: { name: 'MOUSSODOU Jules Alphonse', gender: 'M' } },
    { id: 'NGO017', name: 'KEBA MOUKOUMI Anasthase', gender: 'M', province: 'Ngounié', circonscription: 'Louétsi-Bibaka', parti: 'P.D.G', substitute: { name: 'BOUNAGHAN Théonance', gender: 'F' } },
    { id: 'NGO018', name: 'IDODO Jean Lambert', gender: 'M', province: 'Ngounié', circonscription: 'Louétsi-Wano', parti: 'U.D.B', substitute: { name: 'NZENGUE NDONGO Guy F.', gender: 'M' } },

    // =============================================
    // PROVINCE DE LA NYANGA (NYA) - 11 sièges
    // =============================================

    { id: 'NYA001', name: 'MOUROUNDZI MAYAKE Aggée', gender: 'M', province: 'Nyanga', circonscription: 'Tchibanga 1er Arr.', parti: 'S.D.G', substitute: { name: 'MIGOMBI Sandrine Alida', gender: 'F' } },
    { id: 'NYA002', name: 'PAMBOU MOUSSAVOU Pierre', gender: 'M', province: 'Nyanga', circonscription: 'Tchibanga 2ème Arr.', parti: 'P.D.G', substitute: { name: 'TCHIBINDA Judith Patricia', gender: 'F' } },
    { id: 'NYA003', name: 'NZIENGUI Christianne', gender: 'F', province: 'Nyanga', circonscription: 'Mougoutsi - 1er Siège', parti: 'U.D.B', substitute: { name: 'NZIENGUI NZIENGUI Djony Loris', gender: 'M' } },
    { id: 'NYA004', name: 'MICKALA MOUNDANGA Serghes', gender: 'M', province: 'Nyanga', circonscription: 'Mougoutsi - 2ème Siège', parti: 'P.D.G', substitute: { name: 'SIMBOU Eulalie', gender: 'F' } },
    { id: 'NYA005', name: 'MIHINDOU Christian', gender: 'M', province: 'Nyanga', circonscription: 'Douigny - 1er Siège', parti: 'P.D.G', substitute: { name: 'BONGO MOUYENDI Dominique', gender: 'F' } },
    { id: 'NYA006', name: 'MOULILI Sidoine', gender: 'M', province: 'Nyanga', circonscription: 'Douigny - 2ème Siège', parti: 'P.D.G', substitute: { name: 'NZIENGUI Francis', gender: 'M' } },
    { id: 'NYA007', name: 'ZINGA MOUSSIROU Jarry Clair', gender: 'M', province: 'Nyanga', circonscription: 'Basse-Banio - 1er Siège', parti: 'P.D.G', substitute: { name: 'LOUTABOU Virginie', gender: 'F' } },
    { id: 'NYA008', name: 'NGOMA Angélique', gender: 'F', province: 'Nyanga', circonscription: 'Basse-Banio - 2ème Siège', parti: 'P.D.G', substitute: { name: 'KOUMBA Alain Serge', gender: 'M' } },
    { id: 'NYA009', name: 'MBOUMBOU Edgard Anicet', gender: 'M', province: 'Nyanga', circonscription: 'Haute-Banio', parti: 'P.D.G', substitute: { name: 'TATY NZAOU Armand Noël', gender: 'M' } },
    { id: 'NYA010', name: 'MOMBO Charles Edgar', gender: 'M', province: 'Nyanga', circonscription: 'Doutsila', parti: 'U.D.B', substitute: { name: 'MAGANGA MIHINDOU Victorine', gender: 'F' } },
    { id: 'NYA011', name: 'MAKELA Amour Claudel', gender: 'M', province: 'Nyanga', circonscription: 'Mongo', parti: 'U.D.B', substitute: { name: 'BOUNDA MIHINDOU Georges', gender: 'M' } },

    // =============================================
    // PROVINCE DE L'OGOOUÉ-IVINDO (OIV) - 12 sièges
    // =============================================

    { id: 'OIV001', name: 'EKAZAMA Guy Roger', gender: 'M', province: 'Ogooué-Ivindo', circonscription: 'Makokou 1er Arr.', parti: 'U.D.B', substitute: { name: 'FOMBENA Alain', gender: 'M' } },
    { id: 'OIV002', name: 'AFATOUGHE BIE Donatien', gender: 'M', province: 'Ogooué-Ivindo', circonscription: 'Makokou 2ème Arr.', parti: 'U.D.B', substitute: { name: 'AMVENE ENGONE BILOGBIVOUE Jean Dimitri', gender: 'M' } },
    { id: 'OIV003', name: 'ETAKOBEZAKA Nicaise', gender: 'M', province: 'Ogooué-Ivindo', circonscription: 'Ivindo - 1er Siège', parti: 'F.D.S', substitute: { name: 'MAMBO Urbain Noel', gender: 'M' } },
    { id: 'OIV004', name: 'BIAHODJOW Germain', gender: 'M', province: 'Ogooué-Ivindo', circonscription: 'Ivindo - 2ème Siège', parti: 'P.D.G', substitute: { name: 'DJEMA Siane Raymond', gender: 'M' } },
    { id: 'OIV005', name: 'BECKOPA Valentine Virginie', gender: 'F', province: 'Ogooué-Ivindo', circonscription: 'Ivindo - 3ème Siège', parti: 'U.D.B', substitute: { name: 'OMBOUKA Léon', gender: 'M' } },
    { id: 'OIV006', name: 'EMBONI Joël', gender: 'M', province: 'Ogooué-Ivindo', circonscription: 'Zadié - 1er Siège', parti: 'R.P.M', substitute: { name: 'ENGONDA NTEZI Aubin Valère', gender: 'M' } },
    { id: 'OIV007', name: 'MPAKO NGOMA Fiacre', gender: 'M', province: 'Ogooué-Ivindo', circonscription: 'Zadié - 2ème Siège', parti: 'U.D.B', substitute: { name: 'MAMBILI EKOYAME S.', gender: 'M' } },
    { id: 'OIV008', name: 'BOUYA Estevil', gender: 'M', province: 'Ogooué-Ivindo', circonscription: 'Zadié - 3ème Siège', parti: 'S.D.G', substitute: { name: 'MEMBEDOCK Arthur', gender: 'M' } },
    { id: 'OIV009', name: 'MAMIAKA IKOUTANDA Guy Maixent Alban', gender: 'M', province: 'Ogooué-Ivindo', circonscription: 'Lopé - 1er Siège', parti: 'P.D.G', substitute: { name: 'MOIGNON Benjamin', gender: 'M' } },
    { id: 'OIV010', name: 'MAMIAKA Richard', gender: 'M', province: 'Ogooué-Ivindo', circonscription: 'Lopé - 2ème Siège', parti: 'U.D.B', substitute: { name: 'MINKO BENGANG Albert', gender: 'M' } },
    { id: 'OIV011', name: 'EYA NYARE Nathalie Ép. NDINGA', gender: 'F', province: 'Ogooué-Ivindo', circonscription: 'Mvoung - 1er Siège', parti: 'P.D.G', substitute: { name: 'OYOUNE ANGO Jean', gender: 'M' } },
    { id: 'OIV012', name: 'MINKO MEGUEME Epiphane', gender: 'M', province: 'Ogooué-Ivindo', circonscription: 'Mvoung - 2ème Siège', parti: 'P.D.G', substitute: { name: 'MOUANDONDO Tino Rossi', gender: 'M' } },

    // =============================================
    // PROVINCE DE L'OGOOUÉ-LOLO (OLO) - 12 sièges
    // =============================================

    { id: 'OLO001', name: 'LOUEMBE Blaise', gender: 'M', province: 'Ogooué-Lolo', circonscription: 'Koulamoutou 1er Arr.', parti: 'P.D.G', substitute: { name: 'MBAMBA SANDZA Davy', gender: 'M' } },
    { id: 'OLO002', name: 'MBADINGA MADIYA Hugues Judicaël', gender: 'M', province: 'Ogooué-Lolo', circonscription: 'Koulamoutou 2ème Arr.', parti: 'P.D.G', substitute: { name: 'KOUMA Jean Baptiste', gender: 'M' } },
    { id: 'OLO003', name: 'IVOGOMA Pierre Claver', gender: 'M', province: 'Ogooué-Lolo', circonscription: 'Lolo-Bouénguidi - 1er Siège', parti: 'P.D.G', substitute: { name: 'MBEMBO Véronique', gender: 'F' } },
    { id: 'OLO004', name: 'YEMBI Augustin Lobelle', gender: 'M', province: 'Ogooué-Lolo', circonscription: 'Lolo-Bouénguidi - 2ème Siège', parti: 'IND', substitute: { name: 'LEPOMBO Pièrre', gender: 'M' } },
    { id: 'OLO005', name: 'RIGHOU Nestor', gender: 'M', province: 'Ogooué-Lolo', circonscription: 'Lolo-Bouénguidi - 3ème Siège', parti: 'P.D.G', substitute: { name: 'SIANGHAN Gaëtan', gender: 'M' } },
    { id: 'OLO006', name: 'PAILLAT Brice Constant', gender: 'M', province: 'Ogooué-Lolo', circonscription: 'Mulundu - 1er Siège', parti: 'U.D.B', substitute: { name: 'DOUMI MOUNGOUNDOU Ghislain Clovis', gender: 'M' } },
    { id: 'OLO007', name: 'MAROMBO Fabien', gender: 'M', province: 'Ogooué-Lolo', circonscription: 'Mulundu - 2ème Siège', parti: 'U.D.B', substitute: { name: 'BALONGA Laure Léandre', gender: 'F' } },
    { id: 'OLO008', name: 'NGONGOUAYA Etienne', gender: 'M', province: 'Ogooué-Lolo', circonscription: 'Mulundu - 3ème Siège', parti: 'P.D.G', substitute: { name: 'LIPOUKOU Marguérite', gender: 'F' } },
    { id: 'OLO009', name: 'NGOUSSI MAYANGAH Fernand', gender: 'M', province: 'Ogooué-Lolo', circonscription: 'Mulundu - 4ème Siège', parti: 'P.D.G', substitute: { name: 'MAYEYI Emma Mélissa', gender: 'F' } },
    { id: 'OLO010', name: 'TSOUCKANY Robert', gender: 'M', province: 'Ogooué-Lolo', circonscription: 'Lombo-Bouénguidi - 1er Siège', parti: 'P.D.G', substitute: { name: 'MAKEBI Sandrine', gender: 'F' } },
    { id: 'OLO011', name: 'MOUKOUMI Wilfried Jimmy', gender: 'M', province: 'Ogooué-Lolo', circonscription: 'Lombo-Bouénguidi - 2ème Siège', parti: 'U.D.B', substitute: { name: 'MIYOGHO NZOMA Gabin', gender: 'M' } },
    { id: 'OLO012', name: 'NZIENGUI Blandine', gender: 'F', province: 'Ogooué-Lolo', circonscription: 'Offoué-Onoye', parti: 'P.D.G', substitute: { name: 'BOUNDAMA Ernest', gender: 'M' } },

    // =============================================
    // PROVINCE DE L'OGOOUÉ-MARITIME (OMA) - 13 sièges
    // =============================================

    { id: 'OMA001', name: 'EMANE OKE Yane Eric', gender: 'M', province: 'Ogooué-Maritime', circonscription: 'Port-Gentil 1er Arr.', parti: 'IND', substitute: { name: 'KOUMBA Camille De Loellis', gender: 'M' } },
    { id: 'OMA002', name: 'BARBERA ISAAC Patrick', gender: 'M', province: 'Ogooué-Maritime', circonscription: 'Port-Gentil 2ème Arr.', parti: 'U.D.B', substitute: { name: 'FOUTOU ZAMBA Davy', gender: 'M' } },
    { id: 'OMA003', name: 'ROYEMBO Albert Richard', gender: 'M', province: 'Ogooué-Maritime', circonscription: 'Port-Gentil 3ème Arr.', parti: 'U.D.B', substitute: { name: 'MBOUMBA MBOUMBA Noeline Ép. KOUMBA', gender: 'F' } },
    { id: 'OMA004', name: 'NZIGOU Jean de Dieu', gender: 'M', province: 'Ogooué-Maritime', circonscription: 'Port-Gentil 4ème Arr.', parti: 'U.D.B', substitute: { name: 'BEBINE ANOUCK Linda Véronique', gender: 'F' } },
    { id: 'OMA005', name: 'PEKOUE Raphaël', gender: 'M', province: 'Ogooué-Maritime', circonscription: 'Bendjé - 1er Siège', parti: 'U.D.B', substitute: { name: 'ESSONGUE NGWEVIKA Belinda', gender: 'F' } },
    { id: 'OMA006', name: 'ALIWA MBA Stéphane', gender: 'M', province: 'Ogooué-Maritime', circonscription: 'Bendjé - 2ème Siège', parti: 'U.D.B', substitute: { name: 'REBOUKA Jean-de-Dieu', gender: 'M' } },
    { id: 'OMA007', name: 'BOUSSOUGOU MAYAGUI Lucien Marius', gender: 'M', province: 'Ogooué-Maritime', circonscription: 'Bendjé - 3ème Siège', parti: 'R.N.R', substitute: { name: 'BOUVANDZA Jean-Louis', gender: 'M' } },
    { id: 'OMA008', name: "ONANGA N'GANDI Augustin", gender: 'M', province: 'Ogooué-Maritime', circonscription: 'Etimboué - 1er Siège', parti: 'P.D.G', substitute: { name: 'FITY ZUE Adelaïde', gender: 'F' } },
    { id: 'OMA009', name: 'EKOLUI MINKO Marcellin', gender: 'M', province: 'Ogooué-Maritime', circonscription: 'Etimboué - 2ème Siège', parti: 'P.D.G', substitute: { name: 'DOUKAGA OBAME Johane', gender: 'M' } },
    { id: 'OMA010', name: 'MBOUNGANA GUIBOUANGA René', gender: 'M', province: 'Ogooué-Maritime', circonscription: 'Etimboué - 3ème Siège', parti: 'IND', substitute: { name: 'SAMBONI Sosthène', gender: 'M' } },
    { id: 'OMA011', name: 'MOUDOUMA Apollinaire Adonis', gender: 'M', province: 'Ogooué-Maritime', circonscription: 'Ndougou - 1er Siège', parti: 'P.D.G', substitute: { name: 'BIGNAGNI BOUKOUMOU Ulda Laëlle', gender: 'F' } },
    { id: 'OMA012', name: 'GNOUNDOU Hugues Martial', gender: 'M', province: 'Ogooué-Maritime', circonscription: 'Ndougou - 2ème Siège', parti: 'P.D.G', substitute: { name: 'MANOMBA Denise', gender: 'F' } },
    { id: 'OMA013', name: 'MALONDA Jean Louis', gender: 'M', province: 'Ogooué-Maritime', circonscription: 'Ndougou - 3ème Siège', parti: 'P.D.G', substitute: { name: 'SOUNGOU Fatou', gender: 'F' } },

    // =============================================
    // PROVINCE DU WOLEU-NTEM (WNT) - 18 sièges
    // =============================================

    { id: 'WNT001', name: 'EBANETH Nathalie Ép. SIMA EYI', gender: 'F', province: 'Woleu-Ntem', circonscription: 'Oyem 1er Arr.', parti: 'P.D.G', substitute: { name: 'OUSMANOU BARAOU', gender: 'M' } },
    { id: 'WNT002', name: 'OBAME BIBANG Paul', gender: 'M', province: 'Woleu-Ntem', circonscription: 'Oyem 2ème Arr.', parti: 'P.D.G', substitute: { name: 'ABORE MBOUY Germie', gender: 'F' } },
    { id: 'WNT003', name: 'MEBALE OBIANG Kisito', gender: 'M', province: 'Woleu-Ntem', circonscription: 'Woleu - 1er Siège', parti: 'P.D.G', substitute: { name: 'NDOUTOUME OBAME Nadège', gender: 'F' } },
    { id: 'WNT004', name: 'NDOUTOUME NDONG Moïse', gender: 'M', province: 'Woleu-Ntem', circonscription: 'Woleu - 2ème Siège', parti: 'P.D.G', substitute: { name: 'ANDEME OYE', gender: '?' } },
    { id: 'WNT005', name: 'ABESSOLO METOGO Christel Donald', gender: 'M', province: 'Woleu-Ntem', circonscription: 'Woleu - 3ème Siège', parti: 'P.D.G', substitute: { name: 'NDONG SIMA Guy Cedric', gender: 'M' } },
    { id: 'WNT006', name: 'OBAME MENIE Albert', gender: 'M', province: 'Woleu-Ntem', circonscription: 'Woleu - 4ème Siège', parti: 'P.D.G', substitute: { name: 'TOUNG EKORE Bertrand', gender: 'M' } },
    { id: 'WNT007', name: 'NDONG OBAME Serge', gender: 'M', province: 'Woleu-Ntem', circonscription: 'Woleu - 5ème Siège', parti: 'P.D.G', substitute: { name: 'EYANG NANG Léa', gender: 'F' } },
    { id: 'WNT008', name: 'MVE MBA Romuald', gender: 'M', province: 'Woleu-Ntem', circonscription: 'Ntem - 1er Siège', parti: 'P.D.G', substitute: { name: 'ANGONO ONDO Constance', gender: 'F' } },
    { id: 'WNT009', name: 'AKOUE Elie Colin', gender: 'M', province: 'Woleu-Ntem', circonscription: 'Ntem - 2ème Siège', parti: 'U.D.B', substitute: { name: 'MFONO ASSEKO Annie', gender: 'F' } },
    { id: 'WNT010', name: 'BINDANG ONDZIGUI Adèle Sylène', gender: 'F', province: 'Woleu-Ntem', circonscription: 'Ntem - 3ème Siège', parti: 'U.D.B', substitute: { name: 'MINKO MI NDONG Rudy Nelly', gender: 'M' } },
    { id: 'WNT011', name: 'MVE ONDO Til', gender: 'M', province: 'Woleu-Ntem', circonscription: 'Ntem - 4ème Siège', parti: 'P.D.G', substitute: { name: 'BILOGO BI OVONO Alida', gender: 'F' } },
    { id: 'WNT012', name: 'EGNOLE ELLA Dieudonné', gender: 'M', province: 'Woleu-Ntem', circonscription: 'Haut-Ntem - 1er Siège', parti: 'P.D.G', substitute: { name: 'EYOGO NZE Emmanuel', gender: 'M' } },
    { id: 'WNT013', name: 'ESSONO MEZUI Eric', gender: 'M', province: 'Woleu-Ntem', circonscription: 'Haut-Ntem - 2ème Siège', parti: 'U.D.B', substitute: { name: 'NYANGONE BENGUE Genifer', gender: 'F' } },
    { id: 'WNT014', name: 'BEKALE BE NZE Constant', gender: 'M', province: 'Woleu-Ntem', circonscription: 'Okano - 1er Siège', parti: 'U.D.B', substitute: { name: 'MEGNE ME NDONG Anicet', gender: 'M' } },
    { id: 'WNT015', name: 'EVA NZE Pascal', gender: 'M', province: 'Woleu-Ntem', circonscription: 'Okano - 2ème Siège', parti: 'U.D.B', substitute: { name: 'OYE NDONG Nina Flore', gender: 'F' } },
    { id: 'WNT016', name: 'OKOME MBA Ep. OBIANG NDONG Josephine', gender: 'F', province: 'Woleu-Ntem', circonscription: 'Okano - 3ème Siège', parti: 'U.D.B', substitute: { name: 'ABESSOLO METOU Jean de la croix', gender: 'M' } },
    { id: 'WNT017', name: 'NTOUTOUME Lubin', gender: 'M', province: 'Woleu-Ntem', circonscription: 'Haut-Como - 1er Siège', parti: 'U.D.B', substitute: { name: 'MVEME MEYO Salomond', gender: 'M' } },
    { id: 'WNT018', name: 'NDONG MEYO Ulrich', gender: 'M', province: 'Woleu-Ntem', circonscription: 'Haut-Como - 2ème Siège', parti: 'B.D.C', substitute: { name: 'NZOGHE NDONG Christian', gender: 'M' } },

    // =============================================
    // DIASPORA (DIA) - 2 sièges
    // =============================================

    { id: 'DIA001', name: 'BOURAGA Patrick Omer', gender: 'M', province: 'Diaspora', circonscription: 'Zone Afrique', parti: 'P.D.G', substitute: { name: 'NYENGUI YNGUEMBA Aurore', gender: 'F' } },
    { id: 'DIA002', name: 'ENGONGA ELLA Rostan Mickael', gender: 'M', province: 'Diaspora', circonscription: 'Zone Amérique/Asie/Europe', parti: 'U.D.B', substitute: { name: 'MAPAGA Laeticia', gender: 'F' } },
];

// Statistiques calculées dynamiquement
export const DEPUTIES_STATS = {
    total: DEPUTIES_DATA.length,
    byGender: {
        male: DEPUTIES_DATA.filter(d => d.gender === 'M').length,
        female: DEPUTIES_DATA.filter(d => d.gender === 'F').length,
    },
    byProvince: Object.fromEntries(
        [...new Set(DEPUTIES_DATA.map(d => d.province))].map(province => [
            province,
            DEPUTIES_DATA.filter(d => d.province === province).length
        ])
    ),
    byParty: Object.fromEntries(
        [...new Set(DEPUTIES_DATA.map(d => d.parti))].map(parti => [
            parti,
            DEPUTIES_DATA.filter(d => d.parti === parti).length
        ])
    ),
};

/**
 * Génère les mockUsers pour AssemblyDemo à partir des données des députés
 */
export const generateDeputyMockUsers = () => {
    const mockUsers: Record<string, {
        name: string;
        roles: string[];
        circonscription: string;
        bureauLabel: string;
        province: string;
        parti: string;
        substituteId?: string;
    }> = {};

    let phoneIndex = 100;

    DEPUTIES_DATA.forEach((deputy) => {
        const deputyPhone = `07${String(phoneIndex).padStart(6, '0')}`;
        phoneIndex++;
        const substitutePhone = `08${String(phoneIndex).padStart(6, '0')}`;
        phoneIndex++;

        mockUsers[deputyPhone] = {
            name: deputy.name,
            roles: ['deputy', 'citizen'],
            circonscription: `${deputy.province} - ${deputy.circonscription}`,
            bureauLabel: 'Député',
            province: deputy.province,
            parti: deputy.parti,
            substituteId: substitutePhone,
        };

        mockUsers[substitutePhone] = {
            name: deputy.substitute.name,
            roles: ['substitute', 'citizen'],
            circonscription: `${deputy.province} - ${deputy.circonscription}`,
            bureauLabel: 'Suppléant',
            province: deputy.province,
            parti: deputy.parti,
        };
    });

    return mockUsers;
};

export const DEPUTY_MOCK_USERS = generateDeputyMockUsers();
