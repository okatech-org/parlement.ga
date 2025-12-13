/**
 * CORTEX - SKILLS: LegislativeSkills (anciennement AdministrativeSkills)
 * 
 * Compétences cognitives législatives d'iAsted.
 * Ces neurones gèrent les processus parlementaires gabonais:
 * - Génération de documents législatifs (amendements, PV, rapports)
 * - Questions au gouvernement
 * - Gestion de l'agenda parlementaire
 * - Travaux de commission
 * 
 * SCOPE : Parlement Gabonais (Assemblée Nationale & Sénat)
 * EXCLUSION : Aucune logique municipale
 * 
 * RÈGLE CRUCIALE: Ces skills ne s'exécutent jamais seuls.
 * Ils doivent recevoir un Signal d'Activation signé par iAstedSoul.
 */

import { iAstedSoul, SoulState } from '@/Consciousness';
import { ParliamentaryRole, ParliamentaryCommission, hasPermission, ParliamentaryPermission } from '@/Cortex/entities/ParliamentaryRole';

// ============================================================
// TYPES
// ============================================================

export interface SkillActivationSignal {
  skillName: string;
  activatedBy: 'voice' | 'text' | 'click' | 'context' | 'system';
  soulState: SoulState;
  timestamp: Date;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

export interface SkillResult<T = unknown> {
  success: boolean;
  skillName: string;
  data?: T;
  error?: string;
  executionTime: number;
  vocalFeedback: string;
}

// === DOCUMENTS PARLEMENTAIRES ===

export interface LegislativeDocumentPayload {
  type: 'amendement' | 'proposition_loi' | 'question_orale' | 'question_ecrite' | 
        'rapport_commission' | 'pv_seance' | 'pv_commission' | 'motion' | 'resolution' | 
        'avis_commission' | 'autre';
  data: Record<string, unknown>;
  format?: 'pdf' | 'word' | 'html';
  confidential?: boolean;
}

export interface AmendmentPayload {
  projectLawId: string;
  articleNumber: number;
  amendmentType: 'modification' | 'suppression' | 'ajout';
  originalText?: string;
  proposedText: string;
  justification: string;
  authorId: string;
  cosignatories?: string[];
}

export interface GovernmentQuestionPayload {
  type: 'orale' | 'ecrite' | 'actualite';
  ministry: string;
  subject: string;
  questionText: string;
  authorId: string;
  urgency?: 'normal' | 'urgent';
}

export interface SessionMinutesPayload {
  sessionType: 'pleniere' | 'commission' | 'conference_presidents' | 'bureau';
  sessionDate: Date;
  attendees: string[];
  absentees?: string[];
  agendaItems: AgendaItem[];
  decisions: Decision[];
  nextSessionDate?: Date;
}

export interface AgendaItem {
  order: number;
  title: string;
  rapporteur?: string;
  duration?: number; // en minutes
  status: 'pending' | 'discussed' | 'voted' | 'postponed';
}

export interface Decision {
  item: string;
  type: 'vote' | 'adoption' | 'rejet' | 'renvoi' | 'suspension';
  result?: { pour: number; contre: number; abstention: number };
  details?: string;
}

export interface CommissionWorkPayload {
  commissionId: ParliamentaryCommission;
  workType: 'audition' | 'examen_texte' | 'mission_information' | 'rapport';
  subject: string;
  participants: string[];
  documents?: string[];
}

export interface ParliamentaryAppointmentPayload {
  type: 'commission' | 'pleniere' | 'groupe' | 'circonscription' | 'audition';
  requestedDate: Date;
  requestedTime: string;
  location?: string;
  subject: string;
  attendees?: string[];
}

// ============================================================
// BASE SKILL CLASS
// ============================================================

abstract class BaseSkill {
  protected soulState: SoulState | null = null;

  protected validateActivation(signal: SkillActivationSignal): boolean {
    if (!signal.soulState.isAwake) {
      console.warn(`⚠️ [${signal.skillName}] Rejeté: iAsted n'est pas éveillé`);
      return false;
    }
    this.soulState = signal.soulState;
    console.log(`🔓 [${signal.skillName}] Activé par ${signal.activatedBy}`);
    return true;
  }

  protected generateVocalFeedback(action: string, success: boolean): string {
    const soul = iAstedSoul.getState();

    if (success) {
      return iAstedSoul.generateActionConfirmation(action);
    } else {
      if (soul.persona.formalityLevel === 3) {
        return `Veuillez m'excuser, je n'ai pas pu ${action}. Permettez-moi de réessayer.`;
      }
      return `Désolé, il y a eu un souci avec ${action}. Je réessaie ?`;
    }
  }

  protected checkPermission(permission: ParliamentaryPermission): boolean {
    const soul = iAstedSoul.getState();
    const userRole = soul.user.role as ParliamentaryRole;
    return hasPermission(userRole, permission);
  }
}

// ============================================================
// LEGISLATIVE SKILLS
// ============================================================

class LegislativeSkillsClass extends BaseSkill {
  private static instance: LegislativeSkillsClass;

  private constructor() {
    super();
    console.log('⚖️ [LegislativeSkills] Compétences législatives chargées');
  }

  public static getInstance(): LegislativeSkillsClass {
    if (!LegislativeSkillsClass.instance) {
      LegislativeSkillsClass.instance = new LegislativeSkillsClass();
    }
    return LegislativeSkillsClass.instance;
  }

  // ========== GÉNÉRATION D'AMENDEMENTS ==========

  /**
   * Prépare un amendement sur un projet de loi
   */
  public async prepareAmendment(
    signal: SkillActivationSignal,
    payload: AmendmentPayload
  ): Promise<SkillResult<{ amendmentId: string; referenceNumber: string }>> {
    const startTime = Date.now();

    if (!this.validateActivation(signal)) {
      return {
        success: false,
        skillName: 'PrepareAmendment',
        error: 'Activation non autorisée',
        executionTime: Date.now() - startTime,
        vocalFeedback: 'Je ne peux pas préparer cet amendement pour le moment.'
      };
    }

    // Vérifier la permission
    if (!this.checkPermission(ParliamentaryPermission.SUBMIT_AMENDMENT)) {
      return {
        success: false,
        skillName: 'PrepareAmendment',
        error: 'Permission insuffisante',
        executionTime: Date.now() - startTime,
        vocalFeedback: 'Vous n\'avez pas les droits pour déposer un amendement.'
      };
    }

    try {
      iAstedSoul.setProcessing(true);
      iAstedSoul.queueAction(`Préparation amendement article ${payload.articleNumber}`);

      console.log(`📝 [PrepareAmendment] Article: ${payload.articleNumber}, Type: ${payload.amendmentType}`);

      // TODO: Intégrer avec le système législatif
      const amendmentId = `amd-${Date.now()}`;
      const referenceNumber = `AMD-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      iAstedSoul.completeAction(`Préparation amendement article ${payload.articleNumber}`);
      iAstedSoul.setProcessing(false);

      const soul = iAstedSoul.getState();
      const feedback = `${soul.persona.honorificPrefix}, votre amendement à l'article ${payload.articleNumber} est prêt. Référence : ${referenceNumber}. Souhaitez-vous l'envoyer à la commission ?`;

      return {
        success: true,
        skillName: 'PrepareAmendment',
        data: { amendmentId, referenceNumber },
        executionTime: Date.now() - startTime,
        vocalFeedback: feedback
      };

    } catch (error) {
      iAstedSoul.setProcessing(false);
      return {
        success: false,
        skillName: 'PrepareAmendment',
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        executionTime: Date.now() - startTime,
        vocalFeedback: this.generateVocalFeedback('préparer l\'amendement', false)
      };
    }
  }

  // ========== QUESTIONS AU GOUVERNEMENT ==========

  /**
   * Prépare une question au gouvernement
   */
  public async prepareGovernmentQuestion(
    signal: SkillActivationSignal,
    payload: GovernmentQuestionPayload
  ): Promise<SkillResult<{ questionId: string; registrationNumber: string }>> {
    const startTime = Date.now();

    if (!this.validateActivation(signal)) {
      return {
        success: false,
        skillName: 'PrepareGovernmentQuestion',
        error: 'Activation non autorisée',
        executionTime: Date.now() - startTime,
        vocalFeedback: ''
      };
    }

    const requiredPermission = payload.type === 'orale' 
      ? ParliamentaryPermission.ASK_ORAL_QUESTION 
      : ParliamentaryPermission.ASK_WRITTEN_QUESTION;

    if (!this.checkPermission(requiredPermission)) {
      return {
        success: false,
        skillName: 'PrepareGovernmentQuestion',
        error: 'Permission insuffisante',
        executionTime: Date.now() - startTime,
        vocalFeedback: 'Vous n\'avez pas les droits pour poser ce type de question.'
      };
    }

    try {
      iAstedSoul.setProcessing(true);
      const questionType = payload.type === 'orale' ? 'Question orale' : 'Question écrite';
      iAstedSoul.queueAction(questionType);

      console.log(`❓ [PrepareGovernmentQuestion] Type: ${payload.type}, Ministère: ${payload.ministry}`);

      const questionId = `qst-${Date.now()}`;
      const registrationNumber = `QG-${payload.type.toUpperCase().charAt(0)}-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      iAstedSoul.completeAction(questionType);
      iAstedSoul.setProcessing(false);

      const soul = iAstedSoul.getState();
      const feedback = `${soul.persona.honorificPrefix}, votre ${questionType.toLowerCase()} au ${payload.ministry} est enregistrée sous le numéro ${registrationNumber}.`;

      return {
        success: true,
        skillName: 'PrepareGovernmentQuestion',
        data: { questionId, registrationNumber },
        executionTime: Date.now() - startTime,
        vocalFeedback: feedback
      };

    } catch (error) {
      iAstedSoul.setProcessing(false);
      return {
        success: false,
        skillName: 'PrepareGovernmentQuestion',
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        executionTime: Date.now() - startTime,
        vocalFeedback: this.generateVocalFeedback('préparer la question', false)
      };
    }
  }

  // ========== PROCÈS-VERBAUX ==========

  /**
   * Génère un procès-verbal de séance
   */
  public async generateSessionMinutes(
    signal: SkillActivationSignal,
    payload: SessionMinutesPayload
  ): Promise<SkillResult<{ pvId: string; documentUrl: string }>> {
    const startTime = Date.now();

    if (!this.validateActivation(signal)) {
      return {
        success: false,
        skillName: 'GenerateSessionMinutes',
        error: 'Activation non autorisée',
        executionTime: Date.now() - startTime,
        vocalFeedback: ''
      };
    }

    if (!this.checkPermission(ParliamentaryPermission.VIEW_PV)) {
      return {
        success: false,
        skillName: 'GenerateSessionMinutes',
        error: 'Permission insuffisante',
        executionTime: Date.now() - startTime,
        vocalFeedback: 'Vous n\'avez pas accès à la génération de procès-verbaux.'
      };
    }

    try {
      iAstedSoul.setProcessing(true);
      const sessionLabel = this.getSessionTypeLabel(payload.sessionType);
      iAstedSoul.queueAction(`Génération PV ${sessionLabel}`);

      console.log(`📋 [GenerateSessionMinutes] Type: ${payload.sessionType}, Date: ${payload.sessionDate}`);

      const pvId = `pv-${Date.now()}`;
      const documentUrl = `/api/documents/pv/${pvId}/download`;

      iAstedSoul.completeAction(`Génération PV ${sessionLabel}`);
      iAstedSoul.setProcessing(false);

      const soul = iAstedSoul.getState();
      const dateStr = payload.sessionDate.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      const feedback = soul.persona.formalityLevel === 3
        ? `${soul.persona.honorificPrefix}, le procès-verbal de la ${sessionLabel} du ${dateStr} est prêt. Souhaitez-vous le consulter ?`
        : `Le PV de la ${sessionLabel} du ${dateStr} est généré. Je l'ouvre ?`;

      return {
        success: true,
        skillName: 'GenerateSessionMinutes',
        data: { pvId, documentUrl },
        executionTime: Date.now() - startTime,
        vocalFeedback: feedback
      };

    } catch (error) {
      iAstedSoul.setProcessing(false);
      return {
        success: false,
        skillName: 'GenerateSessionMinutes',
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        executionTime: Date.now() - startTime,
        vocalFeedback: this.generateVocalFeedback('générer le procès-verbal', false)
      };
    }
  }

  private getSessionTypeLabel(type: SessionMinutesPayload['sessionType']): string {
    const labels: Record<string, string> = {
      'pleniere': 'séance plénière',
      'commission': 'réunion de commission',
      'conference_presidents': 'Conférence des Présidents',
      'bureau': 'réunion du Bureau'
    };
    return labels[type] || 'séance';
  }

  // ========== TRAVAUX DE COMMISSION ==========

  /**
   * Prépare un rapport de commission
   */
  public async prepareCommissionReport(
    signal: SkillActivationSignal,
    payload: CommissionWorkPayload
  ): Promise<SkillResult<{ reportId: string; referenceNumber: string }>> {
    const startTime = Date.now();

    if (!this.validateActivation(signal)) {
      return {
        success: false,
        skillName: 'PrepareCommissionReport',
        error: 'Activation non autorisée',
        executionTime: Date.now() - startTime,
        vocalFeedback: ''
      };
    }

    if (!this.checkPermission(ParliamentaryPermission.REPORT_COMMISSION)) {
      return {
        success: false,
        skillName: 'PrepareCommissionReport',
        error: 'Permission insuffisante',
        executionTime: Date.now() - startTime,
        vocalFeedback: 'Vous n\'avez pas les droits pour produire un rapport de commission.'
      };
    }

    try {
      iAstedSoul.setProcessing(true);
      iAstedSoul.queueAction('Préparation rapport de commission');

      console.log(`📊 [PrepareCommissionReport] Commission: ${payload.commissionId}, Type: ${payload.workType}`);

      const reportId = `rpt-${Date.now()}`;
      const referenceNumber = `RPT-${payload.commissionId.substring(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

      iAstedSoul.completeAction('Préparation rapport de commission');
      iAstedSoul.setProcessing(false);

      const soul = iAstedSoul.getState();
      const feedback = `${soul.persona.honorificPrefix}, le rapport de la commission ${payload.commissionId.toLowerCase().replace('_', ' ')} sur "${payload.subject}" est en cours de préparation. Référence : ${referenceNumber}.`;

      return {
        success: true,
        skillName: 'PrepareCommissionReport',
        data: { reportId, referenceNumber },
        executionTime: Date.now() - startTime,
        vocalFeedback: feedback
      };

    } catch (error) {
      iAstedSoul.setProcessing(false);
      return {
        success: false,
        skillName: 'PrepareCommissionReport',
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        executionTime: Date.now() - startTime,
        vocalFeedback: this.generateVocalFeedback('préparer le rapport', false)
      };
    }
  }

  // ========== AGENDA PARLEMENTAIRE ==========

  /**
   * Planifie un rendez-vous parlementaire
   */
  public async scheduleParliamentaryAppointment(
    signal: SkillActivationSignal,
    payload: ParliamentaryAppointmentPayload
  ): Promise<SkillResult<{ appointmentId: string; confirmationCode: string }>> {
    const startTime = Date.now();

    if (!this.validateActivation(signal)) {
      return {
        success: false,
        skillName: 'ScheduleParliamentaryAppointment',
        error: 'Activation non autorisée',
        executionTime: Date.now() - startTime,
        vocalFeedback: ''
      };
    }

    try {
      iAstedSoul.setProcessing(true);
      const appointmentLabel = this.getAppointmentTypeLabel(payload.type);
      iAstedSoul.queueAction(`Planification ${appointmentLabel}`);

      console.log(`📅 [ScheduleParliamentaryAppointment] Type: ${payload.type}, Date: ${payload.requestedDate}`);

      const appointmentId = `rdv-${Date.now()}`;
      const confirmationCode = `RDV-PARL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      iAstedSoul.completeAction(`Planification ${appointmentLabel}`);
      iAstedSoul.setProcessing(false);

      const dateStr = payload.requestedDate.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });

      const soul = iAstedSoul.getState();
      const feedback = soul.persona.formalityLevel === 3
        ? `${soul.persona.honorificPrefix}, votre ${appointmentLabel} est confirmé(e) pour le ${dateStr} à ${payload.requestedTime}. Code : ${confirmationCode}.`
        : `${appointmentLabel} confirmé(e) le ${dateStr} à ${payload.requestedTime}. Code : ${confirmationCode}.`;

      return {
        success: true,
        skillName: 'ScheduleParliamentaryAppointment',
        data: { appointmentId, confirmationCode },
        executionTime: Date.now() - startTime,
        vocalFeedback: feedback
      };

    } catch (error) {
      iAstedSoul.setProcessing(false);
      return {
        success: false,
        skillName: 'ScheduleParliamentaryAppointment',
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        executionTime: Date.now() - startTime,
        vocalFeedback: this.generateVocalFeedback('planifier le rendez-vous', false)
      };
    }
  }

  private getAppointmentTypeLabel(type: ParliamentaryAppointmentPayload['type']): string {
    const labels: Record<string, string> = {
      'commission': 'réunion de commission',
      'pleniere': 'séance plénière',
      'groupe': 'réunion de groupe',
      'circonscription': 'visite en circonscription',
      'audition': 'audition'
    };
    return labels[type] || 'rendez-vous';
  }

  // ========== GÉNÉRATION DE DOCUMENTS LÉGISLATIFS ==========

  /**
   * Génère un document législatif
   */
  public async generateLegislativeDocument(
    signal: SkillActivationSignal,
    payload: LegislativeDocumentPayload
  ): Promise<SkillResult<{ documentId: string; downloadUrl: string }>> {
    const startTime = Date.now();

    if (!this.validateActivation(signal)) {
      return {
        success: false,
        skillName: 'GenerateLegislativeDocument',
        error: 'Activation non autorisée',
        executionTime: Date.now() - startTime,
        vocalFeedback: 'Je ne peux pas générer ce document pour le moment.'
      };
    }

    // Vérifier les permissions pour les documents confidentiels
    if (payload.confidential && !this.checkPermission(ParliamentaryPermission.VIEW_PV)) {
      return {
        success: false,
        skillName: 'GenerateLegislativeDocument',
        error: 'Accès restreint',
        executionTime: Date.now() - startTime,
        vocalFeedback: 'Ce document est confidentiel. Vous n\'avez pas les autorisations requises.'
      };
    }

    try {
      iAstedSoul.setProcessing(true);
      const docTypeName = this.getLegislativeDocumentTypeName(payload.type);
      iAstedSoul.queueAction(`Génération ${docTypeName}`);

      console.log(`📄 [GenerateLegislativeDocument] Type: ${payload.type}, Format: ${payload.format || 'pdf'}`);

      const documentId = `leg-doc-${Date.now()}`;
      const downloadUrl = `/api/documents/legislative/${documentId}/download`;

      iAstedSoul.completeAction(`Génération ${docTypeName}`);
      iAstedSoul.setProcessing(false);

      const soul = iAstedSoul.getState();
      const feedback = soul.persona.formalityLevel === 3
        ? `${soul.persona.honorificPrefix}, votre ${docTypeName} est prêt. Souhaitez-vous que je l'ouvre pour vous ?`
        : `Voilà ! Votre ${docTypeName} est généré. Je l'ouvre ?`;

      return {
        success: true,
        skillName: 'GenerateLegislativeDocument',
        data: { documentId, downloadUrl },
        executionTime: Date.now() - startTime,
        vocalFeedback: feedback
      };

    } catch (error) {
      iAstedSoul.setProcessing(false);
      return {
        success: false,
        skillName: 'GenerateLegislativeDocument',
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        executionTime: Date.now() - startTime,
        vocalFeedback: this.generateVocalFeedback('générer le document', false)
      };
    }
  }

  private getLegislativeDocumentTypeName(type: LegislativeDocumentPayload['type']): string {
    const names: Record<string, string> = {
      'amendement': 'amendement',
      'proposition_loi': 'proposition de loi',
      'question_orale': 'question orale',
      'question_ecrite': 'question écrite',
      'rapport_commission': 'rapport de commission',
      'pv_seance': 'procès-verbal de séance',
      'pv_commission': 'procès-verbal de commission',
      'motion': 'motion',
      'resolution': 'résolution',
      'avis_commission': 'avis de commission',
      'autre': 'document parlementaire'
    };
    return names[type] || 'document';
  }

  // ========== HORS PÉRIMÈTRE ==========

  /**
   * Répond aux demandes hors périmètre parlementaire
   */
  public getOutOfScopeResponse(): SkillResult<null> {
    const soul = iAstedSoul.getState();
    
    return {
      success: false,
      skillName: 'OutOfScope',
      data: null,
      executionTime: 0,
      vocalFeedback: soul.persona.formalityLevel === 3
        ? `${soul.persona.honorificPrefix}, cette demande ne relève pas du périmètre parlementaire. Les actes d'état civil, permis de construire et autres démarches administratives sont du ressort des Mairies.`
        : 'Je suis l\'assistant du Parlement. Cette demande relève de la compétence des Mairies ou d\'autres administrations.'
    };
  }
}

// ============================================================
// EXPORT
// ============================================================

export const LegislativeSkills = LegislativeSkillsClass.getInstance();

// Alias pour compatibilité avec l'ancien nom
export const AdministrativeSkills = LegislativeSkills;

export type { LegislativeSkillsClass };
