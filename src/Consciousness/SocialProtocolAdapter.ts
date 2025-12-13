/**
 * CONSCIOUSNESS - SocialProtocolAdapter
 * 
 * Adaptateur du Protocole Social Parlementaire Gabonais.
 * Gère les formules de politesse et le ton selon le protocole républicain.
 * 
 * EXCLUSION : Aucune logique municipale (Mairie, Maire, État Civil).
 * SCOPE : Assemblée Nationale et Sénat uniquement.
 */

// ============================================================
// TYPES
// ============================================================

export type ParliamentaryRole = 
  | 'PRESIDENT'
  | 'VICE_PRESIDENT'
  | 'QUESTEUR'
  | 'SECRETARY'
  | 'DEPUTY'
  | 'SENATOR'
  | 'SUBSTITUTE'
  | 'STAFF'
  | 'CITIZEN'
  | 'ADMIN'
  | 'ANONYMOUS';

export type CommunicationContext = 'greeting' | 'request' | 'confirmation' | 'error' | 'farewell';

export interface ProtocolResponse {
  prefix: string;
  suffix: string;
  tone: 'formal' | 'warm' | 'technical';
  emoticons: boolean;
}

// ============================================================
// PROTOCOLE PAR RÔLE PARLEMENTAIRE
// ============================================================

const PROTOCOL_RULES: Record<string, {
  salutation: {
    morning: string;
    afternoon: string;
    evening: string;
  };
  honorific: string;
  closings: string[];
  tone: 'formal' | 'warm' | 'technical';
  useEmoticons: boolean;
}> = {
  // ========== HAUTS RESPONSABLES ==========
  PRESIDENT: {
    salutation: {
      morning: 'Monsieur le Président, je vous présente mes salutations distinguées en ce matin.',
      afternoon: 'Monsieur le Président, je vous salue respectueusement.',
      evening: 'Monsieur le Président, je vous souhaite une excellente soirée.'
    },
    honorific: 'Monsieur le Président',
    closings: [
      'Je reste à votre entière disposition, Monsieur le Président.',
      'C\'est un honneur de vous servir.',
      'Vos instructions seront exécutées avec la plus grande diligence.'
    ],
    tone: 'formal',
    useEmoticons: false
  },

  VICE_PRESIDENT: {
    salutation: {
      morning: 'Monsieur le Vice-Président, bonjour et bienvenue.',
      afternoon: 'Monsieur le Vice-Président, bon après-midi.',
      evening: 'Monsieur le Vice-Président, bonsoir.'
    },
    honorific: 'Monsieur le Vice-Président',
    closings: [
      'Je reste à votre disposition.',
      'N\'hésitez pas si vous avez besoin d\'assistance supplémentaire.'
    ],
    tone: 'formal',
    useEmoticons: false
  },

  QUESTEUR: {
    salutation: {
      morning: 'Honorable Questeur, bonjour.',
      afternoon: 'Honorable Questeur, bon après-midi.',
      evening: 'Honorable Questeur, bonsoir.'
    },
    honorific: 'Honorable Questeur',
    closings: [
      'À votre service pour la gestion du Parlement.',
      'Je suis prêt pour vos prochaines instructions.'
    ],
    tone: 'formal',
    useEmoticons: false
  },

  // ========== PARLEMENTAIRES ==========
  DEPUTY: {
    salutation: {
      morning: 'Honorable Député, bonjour ! Comment puis-je vous assister ?',
      afternoon: 'Honorable Député, bon après-midi.',
      evening: 'Honorable Député, bonsoir.'
    },
    honorific: 'Honorable Député',
    closings: [
      'Je reste à votre disposition pour vos travaux législatifs.',
      'Bon travail parlementaire !'
    ],
    tone: 'formal',
    useEmoticons: false
  },

  SENATOR: {
    salutation: {
      morning: 'Vénérable Sénateur, bonjour ! Comment puis-je vous assister ?',
      afternoon: 'Vénérable Sénateur, bon après-midi.',
      evening: 'Vénérable Sénateur, bonsoir.'
    },
    honorific: 'Vénérable Sénateur',
    closings: [
      'Je reste à votre disposition pour vos travaux législatifs.',
      'Bon travail parlementaire, Vénérable !'
    ],
    tone: 'formal',
    useEmoticons: false
  },

  SUBSTITUTE: {
    salutation: {
      morning: 'Cher(e) Suppléant(e), bonjour ! Prêt(e) à vous accompagner.',
      afternoon: 'Cher(e) Suppléant(e), bon après-midi.',
      evening: 'Cher(e) Suppléant(e), bonsoir.'
    },
    honorific: 'Cher(e) Suppléant(e)',
    closings: [
      'Bonne préparation !',
      'Je reste disponible pour votre accompagnement.'
    ],
    tone: 'warm',
    useEmoticons: false
  },

  // ========== STAFF PARLEMENTAIRE ==========
  SECRETARY: {
    salutation: {
      morning: 'Bonjour ! Prêt pour les travaux du jour ?',
      afternoon: 'Bon après-midi ! Des procès-verbaux à préparer ?',
      evening: 'Bonsoir, collègue du secrétariat !'
    },
    honorific: 'Cher(e) collègue',
    closings: ['Bon travail !', 'À votre service.'],
    tone: 'warm',
    useEmoticons: false
  },

  STAFF: {
    salutation: {
      morning: 'Bonjour collègue ! Comment ça va ?',
      afternoon: 'Bon après-midi ! Besoin d\'aide ?',
      evening: 'Bonsoir ! Je suis là si tu as besoin.'
    },
    honorific: 'Collègue',
    closings: ['Bon courage !', 'Bonne continuation.', 'À plus tard !'],
    tone: 'warm',
    useEmoticons: false
  },

  // ========== CITOYENS / ÉLECTEURS ==========
  CITIZEN: {
    salutation: {
      morning: 'Bonjour cher citoyen ! Bienvenue sur le portail du Parlement.',
      afternoon: 'Bon après-midi ! Comment puis-je vous renseigner sur les travaux législatifs ?',
      evening: 'Bonsoir ! Je suis là pour vous informer.'
    },
    honorific: 'Cher citoyen',
    closings: [
      'N\'hésitez pas si vous avez d\'autres questions sur les lois.',
      'Je reste à votre disposition.',
      'Bonne journée et à bientôt sur le portail parlementaire !'
    ],
    tone: 'warm',
    useEmoticons: true
  },

  // ========== SPECIAL ==========
  ADMIN: {
    salutation: {
      morning: 'Admin connecté. Système opérationnel.',
      afternoon: 'Session admin active.',
      evening: 'Mode admin nocturne.'
    },
    honorific: 'Admin',
    closings: ['Fin de session.', 'Logs enregistrés.'],
    tone: 'technical',
    useEmoticons: false
  },

  ANONYMOUS: {
    salutation: {
      morning: 'Bonjour ! Bienvenue au Parlement Gabonais.',
      afternoon: 'Bon après-midi ! Je suis iAsted, votre assistant parlementaire.',
      evening: 'Bonsoir ! Comment puis-je vous renseigner ?'
    },
    honorific: 'Cher visiteur',
    closings: [
      'Créez un compte pour accéder à tous les services parlementaires !',
      'N\'hésitez pas à vous inscrire pour une expérience personnalisée.'
    ],
    tone: 'warm',
    useEmoticons: true
  }
};

// ============================================================
// SOCIAL PROTOCOL ADAPTER CLASS
// ============================================================

class SocialProtocolAdapterClass {
  private static instance: SocialProtocolAdapterClass;

  private constructor() {
    console.log('🎭 [SocialProtocolAdapter] Protocole parlementaire initialisé');
  }

  public static getInstance(): SocialProtocolAdapterClass {
    if (!SocialProtocolAdapterClass.instance) {
      SocialProtocolAdapterClass.instance = new SocialProtocolAdapterClass();
    }
    return SocialProtocolAdapterClass.instance;
  }

  /**
   * Génère une salutation adaptée au rôle et à l'heure
   */
  public generateSalutation(role: ParliamentaryRole | string): string {
    const protocol = PROTOCOL_RULES[role.toUpperCase()] || PROTOCOL_RULES.ANONYMOUS;
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return protocol.salutation.morning;
    } else if (hour >= 12 && hour < 18) {
      return protocol.salutation.afternoon;
    } else {
      return protocol.salutation.evening;
    }
  }

  /**
   * Récupère le titre honorifique approprié
   */
  public getHonorific(role: ParliamentaryRole | string): string {
    const protocol = PROTOCOL_RULES[role.toUpperCase()] || PROTOCOL_RULES.ANONYMOUS;
    return protocol.honorific;
  }

  /**
   * Génère une formule de conclusion
   */
  public generateClosing(role: ParliamentaryRole | string): string {
    const protocol = PROTOCOL_RULES[role.toUpperCase()] || PROTOCOL_RULES.ANONYMOUS;
    const closings = protocol.closings;
    return closings[Math.floor(Math.random() * closings.length)];
  }

  /**
   * Adapte un message au protocole social parlementaire
   */
  public adaptMessage(
    message: string,
    role: ParliamentaryRole | string,
    context: CommunicationContext
  ): string {
    const protocol = PROTOCOL_RULES[role.toUpperCase()] || PROTOCOL_RULES.ANONYMOUS;

    switch (context) {
      case 'greeting':
        return this.generateSalutation(role);

      case 'confirmation':
        if (protocol.tone === 'formal') {
          return `${protocol.honorific}, c'est fait. ${message}`;
        }
        return `Parfait ! ${message}`;

      case 'error':
        if (protocol.tone === 'formal') {
          return `Veuillez m'excuser, ${protocol.honorific}. ${message}`;
        }
        return `Désolé, ${message}`;

      case 'farewell':
        return this.generateClosing(role);

      case 'request':
      default:
        return message;
    }
  }

  /**
   * Vérifie si les emoticons sont appropriés
   */
  public canUseEmoticons(role: ParliamentaryRole | string): boolean {
    const protocol = PROTOCOL_RULES[role.toUpperCase()] || PROTOCOL_RULES.ANONYMOUS;
    return protocol.useEmoticons;
  }

  /**
   * Récupère le ton approprié
   */
  public getTone(role: ParliamentaryRole | string): 'formal' | 'warm' | 'technical' {
    const protocol = PROTOCOL_RULES[role.toUpperCase()] || PROTOCOL_RULES.ANONYMOUS;
    return protocol.tone;
  }

  /**
   * Génère un message de bienvenue complet
   */
  public generateWelcomeMessage(
    role: ParliamentaryRole | string,
    userName?: string
  ): string {
    const protocol = PROTOCOL_RULES[role.toUpperCase()] || PROTOCOL_RULES.ANONYMOUS;
    const salutation = this.generateSalutation(role);

    if (userName && protocol.tone !== 'technical') {
      return salutation.replace(protocol.honorific, `${protocol.honorific} ${userName}`);
    }

    return salutation;
  }

  /**
   * Génère un message de confirmation d'action
   */
  public generateActionConfirmation(
    role: ParliamentaryRole | string,
    action: string,
    success: boolean
  ): string {
    const protocol = PROTOCOL_RULES[role.toUpperCase()] || PROTOCOL_RULES.ANONYMOUS;

    if (success) {
      if (protocol.tone === 'formal') {
        return `${protocol.honorific}, j'ai le plaisir de vous confirmer que ${action}.`;
      } else if (protocol.tone === 'technical') {
        return `Action exécutée: ${action}`;
      } else {
        const emoji = protocol.useEmoticons ? ' ✅' : '';
        return `C'est fait ! ${action}${emoji}`;
      }
    } else {
      if (protocol.tone === 'formal') {
        return `Veuillez m'excuser, ${protocol.honorific}. Je n'ai pas pu ${action}. Permettez-moi de réessayer.`;
      } else if (protocol.tone === 'technical') {
        return `Échec: ${action}. Retry recommandé.`;
      } else {
        return `Désolé, il y a eu un souci avec ${action}. Je réessaie ?`;
      }
    }
  }

  /**
   * Message hors périmètre parlementaire
   */
  public generateOutOfScopeMessage(): string {
    return "Je suis l'assistant du Parlement. Cette demande relève de la compétence des Mairies ou d'autres administrations.";
  }
}

// ============================================================
// EXPORT
// ============================================================

export const SocialProtocolAdapter = SocialProtocolAdapterClass.getInstance();
export type { SocialProtocolAdapterClass };
