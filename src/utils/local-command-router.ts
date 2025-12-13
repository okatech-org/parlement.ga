/**
 * iAsted Local Command Router - ÉDITION PARLEMENTAIRE
 * Reconnaissance vocale locale pour l'Assemblée Nationale & le Sénat
 * 
 * Pattern: commande vocale → match local → action immédiate (0 coût)
 *          commande vocale → pas de match → API OpenAI (payant)
 */

export interface LocalCommandResult {
    matched: boolean;
    action?: string;
    toolName?: string;
    toolArgs?: Record<string, any>;
    response?: string;
    confidence?: number;
}

// Normalize text for matching
const normalize = (text: string): string => {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[.,!?;:'"()]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
};

// Levenshtein distance for fuzzy matching
const levenshteinDistance = (a: string, b: string): number => {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[b.length][a.length];
};

const similarity = (a: string, b: string): number => {
    const maxLen = Math.max(a.length, b.length);
    if (maxLen === 0) return 1;
    return 1 - levenshteinDistance(a, b) / maxLen;
};

const containsKeywords = (text: string, keywords: string[]): boolean => {
    return keywords.every(kw => text.includes(kw));
};

const containsAnyKeyword = (text: string, keywords: string[]): boolean => {
    return keywords.some(kw => text.includes(kw));
};

interface CommandDef {
    patterns?: RegExp[];
    requiredKeywords?: string[];
    anyKeywords?: string[];
    actionKeywords?: string[];
    exactPhrases?: string[];
    toolName: string;
    toolArgs?: Record<string, any>;
    response: string;
}

const COMMAND_DEFINITIONS: CommandDef[] = [
    // ========== 1. NAVIGATION LÉGISLATIVE (Prioritaire) ==========
    {
        patterns: [
            /ordre\s*(du\s*)?jour/,
            /agenda(\s*parlementaire)?/,
            /calendrier\s*des\s*seances/,
            /planning\s*des\s*commissions/,
            /prochaine\s*seance/,
            /ouvre\s*(l\s*)?agenda/,
            /va\s*(a\s*)?(l\s*)?agenda/,
        ],
        anyKeywords: ['agenda', 'calendrier', 'seance', 'ordre', 'jour', 'planning'],
        actionKeywords: ['ouvre', 'va', 'montre', 'affiche'],
        exactPhrases: ['ordre du jour', 'agenda parlementaire', 'calendrier des seances'],
        toolName: 'global_navigate',
        toolArgs: { query: 'agenda' },
        response: 'Voici l\'ordre du jour de la session.'
    },
    {
        patterns: [
            /projets?\s*de\s*lois?/,
            /propositions?\s*de\s*lois?/,
            /textes?\s*en\s*examen/,
            /dossiers?\s*legislatifs?/,
            /ouvre\s*(les\s*)?textes/,
            /legislation/,
        ],
        anyKeywords: ['projet', 'loi', 'proposition', 'texte', 'legislation', 'dossier'],
        exactPhrases: ['projets de loi', 'textes en examen', 'dossiers legislatifs'],
        toolName: 'global_navigate',
        toolArgs: { query: 'legislation' },
        response: 'J\'affiche les textes de loi en cours d\'examen.'
    },
    {
        patterns: [
            /hemicycle/,
            /seances?\s*plenieres?/,
            /direct\s*tv/,
            /voir\s*la\s*seance/,
            /pleniere/,
            /ouvre\s*(l\s*)?hemicycle/,
        ],
        anyKeywords: ['hemicycle', 'pleniere', 'seance', 'direct'],
        exactPhrases: ['hemicycle', 'seance pleniere', 'direct tv'],
        toolName: 'global_navigate',
        toolArgs: { query: 'hemicycle' },
        response: 'Connexion au direct de l\'Hémicycle.'
    },
    {
        patterns: [
            /mes\s*amendements/,
            /deposer\s*(un\s*)?amendement/,
            /rediger\s*(un\s*)?amendement/,
            /ouvre\s*(les\s*)?amendements/,
            /cosigner\s*(un\s*)?amendement/,
        ],
        anyKeywords: ['amendement', 'amendements', 'cosign'],
        actionKeywords: ['ouvre', 'deposer', 'rediger', 'cosigner'],
        exactPhrases: ['mes amendements', 'deposer un amendement'],
        toolName: 'global_navigate',
        toolArgs: { query: 'amendements' },
        response: 'Ouverture du module de gestion des amendements.'
    },
    {
        patterns: [
            /commissions?/,
            /travaux\s*en\s*commission/,
            /reunion\s*(de\s*)?commission/,
            /mes\s*commissions/,
            /ouvre\s*(les\s*)?commissions/,
        ],
        anyKeywords: ['commission', 'commissions'],
        actionKeywords: ['ouvre', 'va', 'montre', 'affiche'],
        exactPhrases: ['travaux en commission', 'reunion de commission'],
        toolName: 'global_navigate',
        toolArgs: { query: 'commissions' },
        response: 'Accès aux travaux des commissions permanentes.'
    },

    // ========== 2. CONTRÔLE GOUVERNEMENTAL ==========
    {
        patterns: [
            /questions?\s*(au\s*)?gouvernement/,
            /interpellation/,
            /questions?\s*orales?/,
            /questions?\s*ecrites?/,
            /poser\s*(une\s*)?question/,
            /mes\s*questions/,
        ],
        anyKeywords: ['question', 'questions', 'gouvernement', 'interpellation'],
        exactPhrases: ['questions au gouvernement', 'question orale', 'question ecrite'],
        toolName: 'global_navigate',
        toolArgs: { query: 'questions' },
        response: 'J\'ouvre le module des Questions au Gouvernement.'
    },

    // ========== 3. OUTILS DE SÉANCE ==========
    {
        patterns: [
            /reglement\s*interieur/,
            /constitution/,
            /article\s*\d+/,
            /textes?\s*fondamentaux/,
        ],
        anyKeywords: ['reglement', 'constitution', 'article'],
        toolName: 'search_legislation',
        toolArgs: { type: 'law' },
        response: 'Recherche dans les textes fondamentaux.'
    },
    {
        patterns: [
            /suspension\s*de\s*seance/,
            /demande\s*de\s*parole/,
            /scrutin\s*public/,
            /vote\s*solennel/,
        ],
        anyKeywords: ['suspension', 'parole', 'scrutin', 'vote'],
        toolName: 'manage_session',
        toolArgs: { action: 'alert' },
        response: 'Note prise pour la présidence.'
    },

    // ========== 4. GESTION DU MANDAT ==========
    {
        patterns: [
            /ma\s*circonscription/,
            /mes\s*electeurs/,
            /doleances/,
            /terrain/,
            /citoyens/,
        ],
        anyKeywords: ['circonscription', 'terrain', 'electeur', 'citoyen', 'doleance'],
        exactPhrases: ['ma circonscription', 'mes electeurs'],
        toolName: 'global_navigate',
        toolArgs: { query: 'circonscription' },
        response: 'Affichage des données de votre circonscription.'
    },
    {
        patterns: [
            /mon\s*espace\s*depute/,
            /espace\s*depute/,
            /mon\s*espace\s*senateur/,
            /espace\s*parlementaire/,
            /va\s*(a\s*)?(mon\s*)?espace/,
        ],
        requiredKeywords: ['espace'],
        anyKeywords: ['depute', 'senateur', 'parlementaire'],
        toolName: 'global_navigate',
        toolArgs: { query: 'espace député' },
        response: 'Navigation vers votre espace parlementaire.'
    },
    {
        patterns: [
            /bureau\s*virtuel/,
            /mon\s*bureau/,
            /ouvre\s*(le\s*)?bureau/,
        ],
        anyKeywords: ['bureau'],
        exactPhrases: ['bureau virtuel', 'mon bureau'],
        toolName: 'global_navigate',
        toolArgs: { query: 'bureau' },
        response: 'Ouverture de votre bureau virtuel.'
    },

    // ========== 5. DOCUMENTS PARLEMENTAIRES ==========
    {
        patterns: [
            /mes\s*documents/,
            /ouvre\s*(mes\s*)?documents/,
            /rapports?\s*parlementaires?/,
            /comptes?\s*rendus?/,
        ],
        anyKeywords: ['document', 'documents', 'rapport', 'compte', 'rendu'],
        toolName: 'global_navigate',
        toolArgs: { query: 'documents' },
        response: 'Navigation vers vos documents parlementaires.'
    },

    // ========== 6. GESTION DU CHAT ==========
    {
        patterns: [
            /ouvre\s*(le\s*|la\s*)?chat/,
            /ouvre\s*(la\s*)?fenetre\s*(de|du)\s*chat/,
            /ouvre\s*(la\s*)?conversation/,
            /parler\s*(par\s*)?(ecrit|texte)/,
            /mode\s*texte/,
            /messagerie\s*securisee/,
            /confidentiel/,
        ],
        requiredKeywords: ['ouvr', 'chat'],
        anyKeywords: ['chat', 'fenetre', 'conversation', 'texte'],
        exactPhrases: ['ouvre le chat', 'mode texte'],
        toolName: 'manage_chat',
        toolArgs: { action: 'open' },
        response: 'Ouverture du canal sécurisé.'
    },
    {
        patterns: [
            /ferme\s*(le\s*|la\s*)?chat/,
            /ferme\s*(la\s*)?fenetre/,
            /cache\s*(le\s*)?chat/,
            /quitte\s*(le\s*)?chat/,
        ],
        requiredKeywords: ['ferm', 'chat'],
        anyKeywords: ['chat', 'fenetre'],
        exactPhrases: ['ferme le chat', 'ferme la fenetre'],
        toolName: 'manage_chat',
        toolArgs: { action: 'close' },
        response: 'Chat fermé.'
    },
    {
        patterns: [
            /efface\s*(la\s*)?conversation/,
            /nouvelle\s*conversation/,
            /recommence/,
            /clear\s*chat/,
        ],
        exactPhrases: ['efface la conversation', 'nouvelle conversation'],
        toolName: 'manage_chat',
        toolArgs: { action: 'clear' },
        response: 'Conversation effacée.'
    },

    // ========== 7. THÈME & INTERFACE ==========
    {
        patterns: [
            /mode\s*sombre/,
            /theme\s*sombre/,
            /dark\s*mode/,
            /mode\s*nuit/,
        ],
        anyKeywords: ['sombre', 'noir', 'dark', 'nuit'],
        exactPhrases: ['mode sombre', 'theme sombre'],
        toolName: 'control_ui',
        toolArgs: { action: 'set_theme_dark' },
        response: 'Mode sombre activé pour la séance nocturne.'
    },
    {
        patterns: [
            /mode\s*clair/,
            /theme\s*clair/,
            /light\s*mode/,
            /mode\s*jour/,
        ],
        anyKeywords: ['clair', 'light', 'jour'],
        exactPhrases: ['mode clair', 'theme clair'],
        toolName: 'control_ui',
        toolArgs: { action: 'set_theme_light' },
        response: 'Mode clair activé.'
    },
    {
        patterns: [
            /change\s*(le\s*)?theme/,
            /bascule\s*(le\s*)?theme/,
            /toggle\s*theme/,
        ],
        toolName: 'control_ui',
        toolArgs: { action: 'toggle_theme' },
        response: 'Thème changé.'
    },
    {
        patterns: [
            /ouvre\s*(le\s*)?menu/,
            /deplie\s*(le\s*)?menu/,
            /montre\s*(la\s*)?sidebar/,
        ],
        requiredKeywords: ['menu'],
        actionKeywords: ['ouvre', 'deplie', 'affiche', 'montre'],
        toolName: 'control_ui',
        toolArgs: { action: 'toggle_sidebar' },
        response: 'Menu ouvert.'
    },
    {
        patterns: [
            /ferme\s*(le\s*)?menu/,
            /cache\s*(le\s*)?menu/,
            /replie\s*(le\s*)?menu/,
        ],
        requiredKeywords: ['menu'],
        actionKeywords: ['ferme', 'cache', 'replie'],
        toolName: 'control_ui',
        toolArgs: { action: 'toggle_sidebar' },
        response: 'Menu fermé.'
    },

    // ========== 8. VOIX ==========
    {
        patterns: [
            /change\s*(de\s*)?voix/,
            /autre\s*voix/,
        ],
        toolName: 'change_voice',
        toolArgs: {},
        response: 'Voix changée.'
    },
    {
        patterns: [
            /voix\s*feminine/,
            /voix\s*femme/,
        ],
        toolName: 'change_voice',
        toolArgs: { voice_id: 'shimmer' },
        response: 'Voix féminine activée.'
    },
    {
        patterns: [
            /voix\s*masculine/,
            /voix\s*homme/,
        ],
        toolName: 'change_voice',
        toolArgs: { voice_id: 'ash' },
        response: 'Voix masculine activée.'
    },
    {
        patterns: [
            /parle\s*plus\s*vite/,
            /accelere/,
        ],
        requiredKeywords: ['parle', 'vite'],
        toolName: 'control_ui',
        toolArgs: { action: 'set_speech_rate', value: '1.3' },
        response: 'Je parle plus vite maintenant.'
    },
    {
        patterns: [
            /parle\s*plus\s*lentement/,
            /ralentis/,
        ],
        toolName: 'control_ui',
        toolArgs: { action: 'set_speech_rate', value: '0.8' },
        response: 'Je parle plus lentement maintenant.'
    },

    // ========== 9. COMMANDES SYSTÈME ==========
    {
        patterns: [
            /^stop$/,
            /^arrete$/,
            /^silence$/,
            /arrete\s*toi/,
            /tais\s*toi/,
            /fin\s*de\s*seance/,
            /^au\s*revoir$/,
            /^bye$/,
            /deconnecte\s*(toi|la\s*voix)/,
        ],
        anyKeywords: ['stop', 'arrete', 'silence', 'bye', 'revoir'],
        exactPhrases: ['stop', 'arrete', 'au revoir', 'fin de seance'],
        toolName: 'stop_conversation',
        toolArgs: {},
        response: 'À votre service. Fin de l\'écoute.'
    },
    {
        patterns: [
            /deconnexion/,
            /deconnecte\s*moi/,
            /logout/,
            /me\s*deconnecter/,
        ],
        requiredKeywords: ['deconnect'],
        toolName: 'logout_user',
        toolArgs: {},
        response: 'Déconnexion en cours...'
    },

    // ========== 10. GUIDE & AIDE ==========
    {
        patterns: [
            /lance\s*(la\s*)?presentation/,
            /demarre\s*(la\s*)?presentation/,
            /mode\s*presentation/,
        ],
        requiredKeywords: ['presentation'],
        toolName: 'start_presentation',
        toolArgs: {},
        response: 'Mode présentation activé.'
    },
    {
        patterns: [
            /arrete\s*(la\s*)?presentation/,
            /stop\s*presentation/,
            /quitte\s*(la\s*)?presentation/,
        ],
        toolName: 'stop_presentation',
        toolArgs: {},
        response: 'Présentation arrêtée.'
    },
    {
        patterns: [
            /guide\s*moi/,
            /aide\s*moi/,
            /comment\s*ca\s*marche/,
            /montre\s*moi\s*comment/,
        ],
        toolName: 'start_guide',
        toolArgs: {},
        response: 'Mode guide activé. Je vais vous accompagner.'
    },
    {
        patterns: [
            /c\s*est\s*quoi\s*(cette\s*page|ici)/,
            /ou\s*suis\s*je/,
            /a\s*quoi\s*sert/,
        ],
        toolName: 'explain_context',
        toolArgs: {},
        response: 'Je vais vous expliquer cette page.'
    },

    // ========== 11. PARAMÈTRES ==========
    {
        patterns: [
            /parametres/,
            /reglages/,
            /settings/,
            /ouvre\s*(les\s*)?parametres/,
            /configuration/,
        ],
        anyKeywords: ['parametre', 'reglage', 'setting', 'config'],
        toolName: 'global_navigate',
        toolArgs: { query: 'parametres' },
        response: 'Navigation vers les paramètres.'
    },

    // ========== 12. STATISTIQUES & VOTES ==========
    {
        patterns: [
            /statistiques/,
            /stats/,
            /resultats?\s*des\s*votes/,
            /historique\s*des\s*votes/,
        ],
        anyKeywords: ['statistique', 'stats', 'vote', 'resultat'],
        toolName: 'global_navigate',
        toolArgs: { query: 'statistiques' },
        response: 'Affichage des statistiques parlementaires.'
    },
    {
        patterns: [
            /voter\s*(pour|contre)?/,
            /ouvrir\s*(le\s*)?vote/,
            /lance\s*(le\s*)?scrutin/,
        ],
        anyKeywords: ['vote', 'voter', 'scrutin'],
        toolName: 'global_navigate',
        toolArgs: { query: 'vote' },
        response: 'Accès au module de vote.'
    },
];

/**
 * Match une commande vocale avec plusieurs stratégies
 */
export function matchLocalCommand(transcript: string): LocalCommandResult {
    const normalized = normalize(transcript);

    if (normalized.length < 3) {
        return { matched: false };
    }

    console.log(`🔍 [LocalRouter] Checking: "${transcript}" → normalized: "${normalized}"`);

    let bestMatch: { cmd: CommandDef; confidence: number } | null = null;

    for (const cmd of COMMAND_DEFINITIONS) {
        let confidence = 0;

        // Strategy 1: Regex pattern matching (highest confidence: 1.0)
        if (cmd.patterns) {
            for (const pattern of cmd.patterns) {
                if (pattern.test(normalized)) {
                    confidence = 1.0;
                    console.log(`✅ [LocalRouter] REGEX MATCH: "${normalized}" → ${cmd.toolName}`);
                    return {
                        matched: true,
                        action: cmd.toolName,
                        toolName: cmd.toolName,
                        toolArgs: cmd.toolArgs || {},
                        response: cmd.response,
                        confidence: 1.0
                    };
                }
            }
        }

        // Strategy 2: Required keywords (confidence: 0.8)
        if (cmd.requiredKeywords && containsKeywords(normalized, cmd.requiredKeywords)) {
            confidence = Math.max(confidence, 0.8);
        }

        // Strategy 3: Action + any keyword combination (confidence: 0.7)
        if (cmd.actionKeywords && cmd.anyKeywords) {
            if (containsAnyKeyword(normalized, cmd.actionKeywords) &&
                containsAnyKeyword(normalized, cmd.anyKeywords)) {
                confidence = Math.max(confidence, 0.7);
            }
        }

        // Strategy 4: Any keywords alone (confidence: 0.5)
        if (cmd.anyKeywords && containsAnyKeyword(normalized, cmd.anyKeywords)) {
            if (normalized.split(' ').length <= 5) {
                confidence = Math.max(confidence, 0.5);
            }
        }

        // Strategy 5: Fuzzy matching (confidence: 0.6-0.9)
        if (cmd.exactPhrases) {
            for (const phrase of cmd.exactPhrases) {
                const sim = similarity(normalized, phrase);
                if (sim > 0.7) {
                    const fuzzyConfidence = 0.6 + (sim - 0.7) * 1.0;
                    confidence = Math.max(confidence, fuzzyConfidence);
                }
            }
        }

        if (confidence > 0 && (!bestMatch || confidence > bestMatch.confidence)) {
            bestMatch = { cmd, confidence };
        }
    }

    if (bestMatch && bestMatch.confidence >= 0.6) {
        console.log(`✅ [LocalRouter] FUZZY MATCH (${(bestMatch.confidence * 100).toFixed(0)}%): "${normalized}" → ${bestMatch.cmd.toolName}`);
        return {
            matched: true,
            action: bestMatch.cmd.toolName,
            toolName: bestMatch.cmd.toolName,
            toolArgs: bestMatch.cmd.toolArgs || {},
            response: bestMatch.cmd.response,
            confidence: bestMatch.confidence
        };
    }

    console.log(`❌ [LocalRouter] No match for: "${normalized}" → forwarding to API`);
    return { matched: false };
}

/**
 * Vérifie si une commande peut être traitée localement
 */
export function canHandleLocally(transcript: string): boolean {
    return matchLocalCommand(transcript).matched;
}

/**
 * Statistiques de matching
 */
export function getLocalCommandStats() {
    return {
        totalCommands: COMMAND_DEFINITIONS.length,
        categories: {
            legislation: COMMAND_DEFINITIONS.filter(c => 
                ['legislation', 'hemicycle', 'commissions', 'amendements', 'questions'].some(q => 
                    c.toolArgs?.query?.includes(q)
                )
            ).length,
            navigation: COMMAND_DEFINITIONS.filter(c => c.toolName === 'global_navigate').length,
            chat: COMMAND_DEFINITIONS.filter(c => c.toolName === 'manage_chat').length,
            theme: COMMAND_DEFINITIONS.filter(c => c.toolName === 'control_ui').length,
            voice: COMMAND_DEFINITIONS.filter(c => c.toolName === 'change_voice').length,
            session: COMMAND_DEFINITIONS.filter(c => c.toolName === 'manage_session').length,
            other: COMMAND_DEFINITIONS.filter(c =>
                !['control_ui', 'global_navigate', 'manage_chat', 'change_voice', 'manage_session'].includes(c.toolName)
            ).length
        }
    };
}
