/**
 * Données de correspondance parlementaire
 * 
 * Données fictives pour les dossiers et documents de correspondance
 * utilisés dans le contexte parlementaire (AN + Sénat)
 */

// Types de correspondance parlementaire
export const CORRESPONDANCE_TYPES = [
    { id: 'courrier_officiel', name: 'Courrier Officiel', category: 'Correspondance' },
    { id: 'note_service', name: 'Note de Service', category: 'Interne' },
    { id: 'convocation', name: 'Convocation', category: 'Interne' },
    { id: 'demande_information', name: 'Demande d\'Information', category: 'Correspondance' },
    { id: 'reponse_question', name: 'Réponse à Question', category: 'Législatif' },
    { id: 'transmission_document', name: 'Transmission de Document', category: 'Correspondance' },
    { id: 'invitation', name: 'Invitation', category: 'Événement' },
    { id: 'notification', name: 'Notification', category: 'Interne' },
];

// Organisations parlementaires et gouvernementales
export const ORGANIZATIONS = [
    // Institutions parlementaires
    { id: 'presidence_an', name: 'Présidence de l\'Assemblée Nationale', category: 'Parlement', address: 'Boulevard Triomphal, Libreville' },
    { id: 'presidence_senat', name: 'Présidence du Sénat', category: 'Parlement', address: 'Boulevard Triomphal, Libreville' },
    { id: 'sg_an', name: 'Secrétariat Général de l\'AN', category: 'Parlement', address: 'Boulevard Triomphal, Libreville' },
    { id: 'sg_senat', name: 'Secrétariat Général du Sénat', category: 'Parlement', address: 'Boulevard Triomphal, Libreville' },
    { id: 'questure_an', name: 'Questure de l\'AN', category: 'Parlement', address: 'Boulevard Triomphal, Libreville' },
    { id: 'questure_senat', name: 'Questure du Sénat', category: 'Parlement', address: 'Boulevard Triomphal, Libreville' },

    // Commissions
    { id: 'commission_finances', name: 'Commission des Finances', category: 'Commission', address: 'Assemblée Nationale' },
    { id: 'commission_lois', name: 'Commission des Lois', category: 'Commission', address: 'Assemblée Nationale' },
    { id: 'commission_defense', name: 'Commission de la Défense', category: 'Commission', address: 'Assemblée Nationale' },
    { id: 'commission_affaires_etrangeres', name: 'Commission des Affaires Étrangères', category: 'Commission', address: 'Assemblée Nationale' },
    { id: 'commission_affaires_sociales', name: 'Commission des Affaires Sociales', category: 'Commission', address: 'Assemblée Nationale' },

    // Ministères
    { id: 'presidence_republique', name: 'Présidence de la République', category: 'Gouvernement', address: 'Palais Rénovation, Libreville' },
    { id: 'primature', name: 'Primature', category: 'Gouvernement', address: 'Libreville' },
    { id: 'ministere_interieur', name: 'Ministère de l\'Intérieur', category: 'Gouvernement', address: 'Libreville' },
    { id: 'ministere_justice', name: 'Ministère de la Justice', category: 'Gouvernement', address: 'Libreville' },
    { id: 'ministere_economie', name: 'Ministère de l\'Économie', category: 'Gouvernement', address: 'Libreville' },
    { id: 'ministere_education', name: 'Ministère de l\'Éducation Nationale', category: 'Gouvernement', address: 'Libreville' },
    { id: 'ministere_sante', name: 'Ministère de la Santé', category: 'Gouvernement', address: 'Libreville' },

    // Autres institutions
    { id: 'cour_constitutionnelle', name: 'Cour Constitutionnelle', category: 'Justice', address: 'Libreville' },
    { id: 'conseil_etat', name: 'Conseil d\'État', category: 'Justice', address: 'Libreville' },
    { id: 'cour_comptes', name: 'Cour des Comptes', category: 'Justice', address: 'Libreville' },
];

// Contacts simulés par organisation
export const ORGANIZATION_CONTACTS: Record<string, Array<{ name: string; role: string; email: string }>> = {
    presidence_an: [
        { name: 'M. le Président', role: 'Président de l\'Assemblée Nationale', email: 'president@an.ga' },
        { name: 'Mme la Directrice de Cabinet', role: 'Directrice de Cabinet', email: 'cabinet@an.ga' },
    ],
    presidence_senat: [
        { name: 'M. le Président', role: 'Président du Sénat', email: 'president@senat.ga' },
        { name: 'M. le Directeur de Cabinet', role: 'Directeur de Cabinet', email: 'cabinet@senat.ga' },
    ],
    sg_an: [
        { name: 'M. le Secrétaire Général', role: 'Secrétaire Général', email: 'sg@an.ga' },
    ],
    commission_finances: [
        { name: 'M. le Président', role: 'Président de Commission', email: 'finances@an.ga' },
        { name: 'M. le Rapporteur Général', role: 'Rapporteur Général', email: 'rapporteur.finances@an.ga' },
    ],
    ministere_economie: [
        { name: 'M. le Ministre', role: 'Ministre de l\'Économie', email: 'ministre@economie.gouv.ga' },
        { name: 'M. le Directeur de Cabinet', role: 'Directeur de Cabinet', email: 'cabinet@economie.gouv.ga' },
    ],
};

// Helper pour récupérer les contacts d'une organisation
export function getOrganizationContacts(orgId: string) {
    return ORGANIZATION_CONTACTS[orgId] || [];
}

// ============================================================
// MOCK DATA - DOSSIERS DE CORRESPONDANCE FICTIFS
// ============================================================

export interface MockCorrespondanceFolder {
    id: string;
    name: string;
    reference_number: string;
    recipient_organization: string;
    recipient_name?: string;
    recipient_email?: string;
    status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'SENT' | 'ARCHIVED';
    is_urgent: boolean;
    is_read: boolean;
    is_internal: boolean;
    comment?: string;
    created_at: string;
    sent_at?: string;
    documents: MockCorrespondanceDocument[];
}

export interface MockCorrespondanceDocument {
    id: string;
    name: string;
    file_type: 'pdf' | 'doc' | 'image' | 'other';
    file_size: string;
}

export const MOCK_CORRESPONDANCE_FOLDERS: MockCorrespondanceFolder[] = [
    {
        id: 'corr-001',
        name: 'Transmission PJL Finances 2026',
        reference_number: 'AN/SG/2025/1234',
        recipient_organization: 'Commission des Finances',
        recipient_name: 'M. le Président de Commission',
        status: 'SENT',
        is_urgent: true,
        is_read: true,
        is_internal: true,
        comment: 'Transmission du Projet de Loi de Finances 2026 pour examen en commission.',
        created_at: '2025-12-20T10:00:00Z',
        sent_at: '2025-12-20T14:30:00Z',
        documents: [
            { id: 'doc-001', name: 'PJL_Finances_2026.pdf', file_type: 'pdf', file_size: '2.4 MB' },
            { id: 'doc-002', name: 'Annexe_Budgetaire.pdf', file_type: 'pdf', file_size: '1.8 MB' },
            { id: 'doc-003', name: 'Note_Explicative.pdf', file_type: 'pdf', file_size: '450 KB' },
        ],
    },
    {
        id: 'corr-002',
        name: 'Question au Gouvernement - Éducation',
        reference_number: 'AN/QG/2025/0089',
        recipient_organization: 'Ministère de l\'Éducation Nationale',
        recipient_name: 'M. le Ministre',
        recipient_email: 'cabinet@education.gouv.ga',
        status: 'PENDING_APPROVAL',
        is_urgent: false,
        is_read: true,
        is_internal: false,
        comment: 'Question orale concernant la réforme des programmes scolaires et son calendrier de mise en œuvre.',
        created_at: '2025-12-22T09:15:00Z',
        documents: [
            { id: 'doc-004', name: 'Question_Education.pdf', file_type: 'pdf', file_size: '320 KB' },
        ],
    },
    {
        id: 'corr-003',
        name: 'Convocation Session Extraordinaire',
        reference_number: 'AN/PRES/2025/0456',
        recipient_organization: 'Tous les Députés',
        status: 'SENT',
        is_urgent: true,
        is_read: true,
        is_internal: true,
        comment: 'Convocation pour la session extraordinaire du 15 janvier 2026 portant sur le vote du budget.',
        created_at: '2025-12-18T16:00:00Z',
        sent_at: '2025-12-18T16:30:00Z',
        documents: [
            { id: 'doc-005', name: 'Convocation_Session.pdf', file_type: 'pdf', file_size: '180 KB' },
            { id: 'doc-006', name: 'Ordre_du_Jour.pdf', file_type: 'pdf', file_size: '95 KB' },
        ],
    },
    {
        id: 'corr-004',
        name: 'Réponse Interpellation Ministre Santé',
        reference_number: 'AN/INT/2025/0234',
        recipient_organization: 'Ministère de la Santé',
        recipient_name: 'M. le Ministre',
        status: 'DRAFT',
        is_urgent: false,
        is_read: true,
        is_internal: false,
        comment: 'Demande de précisions suite à l\'interpellation du 12 décembre concernant les ruptures de médicaments.',
        created_at: '2025-12-23T11:00:00Z',
        documents: [
            { id: 'doc-007', name: 'Demande_Precisions.pdf', file_type: 'pdf', file_size: '280 KB' },
        ],
    },
    {
        id: 'corr-005',
        name: 'Note de Service - Formation Continue',
        reference_number: 'AN/RH/2025/0078',
        recipient_organization: 'Direction des Ressources Humaines',
        status: 'APPROVED',
        is_urgent: false,
        is_read: false,
        is_internal: true,
        comment: 'Organisation des sessions de formation 2026 pour le personnel administratif.',
        created_at: '2025-12-19T08:30:00Z',
        documents: [
            { id: 'doc-008', name: 'Programme_Formation_2026.pdf', file_type: 'pdf', file_size: '520 KB' },
            { id: 'doc-009', name: 'Calendrier_Sessions.xlsx', file_type: 'other', file_size: '85 KB' },
        ],
    },
    {
        id: 'corr-006',
        name: 'Invitation Cérémonie Voeux 2026',
        reference_number: 'AN/PROT/2026/0001',
        recipient_organization: 'Corps Diplomatique',
        status: 'SENT',
        is_urgent: false,
        is_read: true,
        is_internal: false,
        comment: 'Invitation à la cérémonie de présentation des vœux du Parlement pour l\'année 2026.',
        created_at: '2025-12-10T14:00:00Z',
        sent_at: '2025-12-11T10:00:00Z',
        documents: [
            { id: 'doc-010', name: 'Carton_Invitation.pdf', file_type: 'pdf', file_size: '150 KB' },
            { id: 'doc-011', name: 'Programme_Ceremonie.pdf', file_type: 'pdf', file_size: '220 KB' },
        ],
    },
    {
        id: 'corr-007',
        name: 'Rapport Mission Provinciale',
        reference_number: 'AN/MISS/2025/0156',
        recipient_organization: 'Bureau de l\'Assemblée Nationale',
        status: 'ARCHIVED',
        is_urgent: false,
        is_read: true,
        is_internal: true,
        comment: 'Rapport de la mission parlementaire dans la Province de l\'Ogooué-Maritime.',
        created_at: '2025-11-28T09:00:00Z',
        sent_at: '2025-11-30T11:00:00Z',
        documents: [
            { id: 'doc-012', name: 'Rapport_Mission_Ogooue.pdf', file_type: 'pdf', file_size: '3.2 MB' },
            { id: 'doc-013', name: 'Photos_Mission.zip', file_type: 'other', file_size: '15 MB' },
            { id: 'doc-014', name: 'Recommandations.pdf', file_type: 'pdf', file_size: '450 KB' },
        ],
    },
    {
        id: 'corr-008',
        name: 'Transmission Décret Budget Rectificatif',
        reference_number: 'SENAT/SG/2025/0789',
        recipient_organization: 'Primature',
        recipient_name: 'M. le Premier Ministre',
        status: 'SENT',
        is_urgent: true,
        is_read: true,
        is_internal: false,
        comment: 'Transmission du décret portant budget rectificatif pour l\'exercice 2025.',
        created_at: '2025-12-15T08:00:00Z',
        sent_at: '2025-12-15T09:30:00Z',
        documents: [
            { id: 'doc-015', name: 'Decret_Budget_Rectificatif.pdf', file_type: 'pdf', file_size: '890 KB' },
        ],
    },
];

// ============================================================
// MOCK DATA - DOCUMENTS PARLEMENTAIRES (pour SharedDocumentsPage)
// ============================================================

export interface MockDocumentFolder {
    id: string;
    name: string;
    icon: string; // Lucide icon name
    color: string;
    description: string;
    documentsCount: number;
}

export interface MockParliamentaryDocument {
    id: string;
    folderId: string;
    title: string;
    reference: string;
    type: 'projet_loi' | 'proposition' | 'rapport' | 'pv_seance' | 'amendement' | 'question' | 'decret' | 'arrete' | 'circulaire';
    status: 'brouillon' | 'en_examen' | 'adopte' | 'rejete' | 'archive' | 'publie';
    date: string;
    author?: string;
    commission?: string;
    file_size?: string;
    description?: string;
}

export const MOCK_DOCUMENT_FOLDERS: MockDocumentFolder[] = [
    {
        id: 'folder-lois',
        name: 'Textes de Loi',
        icon: 'Gavel',
        color: 'bg-blue-500/10 text-blue-500',
        description: 'Projets et propositions de loi',
        documentsCount: 12,
    },
    {
        id: 'folder-rapports',
        name: 'Rapports',
        icon: 'BookOpen',
        color: 'bg-green-500/10 text-green-500',
        description: 'Rapports de commission et d\'enquête',
        documentsCount: 8,
    },
    {
        id: 'folder-pv',
        name: 'Procès-Verbaux',
        icon: 'FileCheck',
        color: 'bg-orange-500/10 text-orange-500',
        description: 'PV de séances plénières et de commission',
        documentsCount: 24,
    },
    {
        id: 'folder-questions',
        name: 'Questions au Gouvernement',
        icon: 'HelpCircle',
        color: 'bg-purple-500/10 text-purple-500',
        description: 'Questions orales et écrites',
        documentsCount: 45,
    },
    {
        id: 'folder-amendements',
        name: 'Amendements',
        icon: 'FileEdit',
        color: 'bg-yellow-500/10 text-yellow-500',
        description: 'Amendements déposés',
        documentsCount: 67,
    },
    {
        id: 'folder-officiels',
        name: 'Actes Officiels',
        icon: 'FileSignature',
        color: 'bg-red-500/10 text-red-500',
        description: 'Décrets, arrêtés et circulaires',
        documentsCount: 15,
    },
];

export const MOCK_PARLIAMENTARY_DOCUMENTS: MockParliamentaryDocument[] = [
    // Textes de Loi
    {
        id: 'doc-loi-001',
        folderId: 'folder-lois',
        title: 'Projet de Loi de Finances 2026',
        reference: 'PJL-2026-001',
        type: 'projet_loi',
        status: 'en_examen',
        date: '2025-12-15',
        author: 'Gouvernement',
        commission: 'Finances',
        file_size: '2.4 MB',
        description: 'Budget de l\'État pour l\'exercice 2026',
    },
    {
        id: 'doc-loi-002',
        folderId: 'folder-lois',
        title: 'Proposition de Loi sur le Numérique',
        reference: 'PPL-2025-089',
        type: 'proposition',
        status: 'en_examen',
        date: '2025-12-10',
        author: 'Groupe Parlementaire Majorité',
        commission: 'Lois',
        file_size: '890 KB',
    },
    {
        id: 'doc-loi-003',
        folderId: 'folder-lois',
        title: 'Projet de Loi sur la Protection des Données',
        reference: 'PJL-2025-078',
        type: 'projet_loi',
        status: 'adopte',
        date: '2025-11-20',
        author: 'Gouvernement',
        commission: 'Lois',
        file_size: '1.1 MB',
    },

    // Rapports
    {
        id: 'doc-rap-001',
        folderId: 'folder-rapports',
        title: 'Rapport sur la Réforme de l\'Éducation',
        reference: 'RAP-2025-045',
        type: 'rapport',
        status: 'publie',
        date: '2025-12-08',
        commission: 'Affaires Sociales',
        file_size: '3.2 MB',
    },
    {
        id: 'doc-rap-002',
        folderId: 'folder-rapports',
        title: 'Rapport d\'Activité 2024',
        reference: 'RAP-2025-001',
        type: 'rapport',
        status: 'publie',
        date: '2025-03-31',
        file_size: '5.8 MB',
        description: 'Bilan des travaux parlementaires de l\'année 2024',
    },

    // Procès-Verbaux
    {
        id: 'doc-pv-001',
        folderId: 'folder-pv',
        title: 'PV Séance Plénière du 20/12/2025',
        reference: 'PV-2025-048',
        type: 'pv_seance',
        status: 'publie',
        date: '2025-12-21',
        file_size: '1.4 MB',
    },
    {
        id: 'doc-pv-002',
        folderId: 'folder-pv',
        title: 'PV Commission des Finances - 18/12/2025',
        reference: 'PV-CF-2025-023',
        type: 'pv_seance',
        status: 'archive',
        date: '2025-12-19',
        commission: 'Finances',
        file_size: '780 KB',
    },

    // Questions
    {
        id: 'doc-q-001',
        folderId: 'folder-questions',
        title: 'Question orale - Politique Énergétique',
        reference: 'QO-2025-156',
        type: 'question',
        status: 'archive',
        date: '2025-12-12',
        author: 'Dép. NDONG Jean-Pierre',
    },
    {
        id: 'doc-q-002',
        folderId: 'folder-questions',
        title: 'Question écrite - Infrastructures Routières',
        reference: 'QE-2025-234',
        type: 'question',
        status: 'en_examen',
        date: '2025-12-18',
        author: 'Dép. MBOUMBA Claire',
    },

    // Amendements
    {
        id: 'doc-amd-001',
        folderId: 'folder-amendements',
        title: 'Amendement au PJL Finances - Art. 15',
        reference: 'AMD-2025-890',
        type: 'amendement',
        status: 'adopte',
        date: '2025-12-19',
        author: 'Commission Finances',
    },
    {
        id: 'doc-amd-002',
        folderId: 'folder-amendements',
        title: 'Amendement au PJL Finances - Art. 23',
        reference: 'AMD-2025-891',
        type: 'amendement',
        status: 'rejete',
        date: '2025-12-19',
        author: 'Groupe Opposition',
    },

    // Actes Officiels
    {
        id: 'doc-off-001',
        folderId: 'folder-officiels',
        title: 'Décret portant Organisation du Parlement',
        reference: 'DEC-2025-008',
        type: 'decret',
        status: 'publie',
        date: '2025-11-15',
        file_size: '420 KB',
    },
    {
        id: 'doc-off-002',
        folderId: 'folder-officiels',
        title: 'Arrêté portant Nomination SG Adjoint',
        reference: 'ARR-2025-156',
        type: 'arrete',
        status: 'publie',
        date: '2025-12-01',
        file_size: '180 KB',
    },
];

// Helper pour récupérer les documents d'un dossier
export function getDocumentsByFolder(folderId: string): MockParliamentaryDocument[] {
    return MOCK_PARLIAMENTARY_DOCUMENTS.filter(doc => doc.folderId === folderId);
}

// Helper pour récupérer les statistiques
export function getDocumentStats() {
    const docs = MOCK_PARLIAMENTARY_DOCUMENTS;
    return {
        total: docs.length,
        projets: docs.filter(d => d.type === 'projet_loi' || d.type === 'proposition').length,
        rapports: docs.filter(d => d.type === 'rapport').length,
        enExamen: docs.filter(d => d.status === 'en_examen').length,
    };
}
