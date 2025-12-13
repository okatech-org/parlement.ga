/**
 * CORTEX - SKILLS: Central Export
 * 
 * Les Compétences Cognitives d'iAsted.
 * Ces skills sont les "réflexes inconscients" que la Conscience active.
 * 
 * SCOPE : Parlement Gabonais (Assemblée Nationale & Sénat)
 * 
 * RÈGLE: Les skills ne s'exécutent jamais seuls.
 * Ils doivent recevoir un Signal d'Activation signé par iAstedSoul.
 */

// Skills
export { CommunicationSkills } from './CommunicationSkills';
export { AdministrativeSkills, LegislativeSkills } from './AdministrativeSkills';
export { NavigationSkills } from './NavigationSkills';

// Types réutilisables - Communication
export type {
  SkillActivationSignal,
  SkillResult,
  EmailPayload,
  CallPayload,
  NotificationPayload
} from './CommunicationSkills';

// Types réutilisables - Législatif (Parlementaire)
export type {
  LegislativeDocumentPayload,
  AmendmentPayload,
  GovernmentQuestionPayload,
  SessionMinutesPayload,
  AgendaItem,
  Decision,
  CommissionWorkPayload,
  ParliamentaryAppointmentPayload
} from './AdministrativeSkills';

// Types réutilisables - Navigation
export type {
  NavigationTarget,
  ScrollTarget
} from './NavigationSkills';
