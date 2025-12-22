/**
 * NEO-CORTEX: LEGISLATIVE ACTOR
 * 
 * Cortex responsable du processus législatif.
 * Gère le cycle de vie des textes : Dépôt, Validation Bureau, Navette.
 */

import { BioActor } from '../BioActor';
import { NeuralSignal } from '../synapse';
import { legislativeService, CreateTextInput } from '@/services/legislativeService';

interface LegislativeState {
    pendingSubmissions: number;
    activeTexts: number;
}

export class LegislativeActor extends BioActor<LegislativeState> {

    constructor() {
        super('Cortex:Legislative', {
            pendingSubmissions: 0,
            activeTexts: 0
        });
    }

    protected initialize(): void {
        this.listen('LEGISLATIVE:SUBMIT_TEXT', this.handleSubmitText.bind(this));
        // On pourrait écouter LEGISLATIVE:VOTE, LEGISLATIVE:AMENDMENT, etc.
    }

    private async handleSubmitText(payload: CreateTextInput, signal: NeuralSignal) {
        console.log('📜 [Cortex:Legis] Dépôt de texte reçu', payload);

        this.emit('LEGISLATIVE:SUBMISSION_STARTED', { correlationId: signal.id });

        try {
            // Validation "Cognitive" (Bio-inspirée: Vérification conformité)
            if (!payload.title || !payload.text_type) {
                throw new Error("L'ADN du texte est incomplet (Titre ou Type manquant)");
            }

            // Exécution "Musculaire"
            const newText = await legislativeService.createText(payload);

            this.emit('LEGISLATIVE:TEXT_CREATED', {
                originalSignalId: signal.id,
                text: newText
            });

            console.log('✅ [Cortex:Legis] Texte créé', newText.reference);

        } catch (error: any) {
            console.error('❌ [Cortex:Legis] Rejet du texte', error);
            this.emit('LEGISLATIVE:ERROR', {
                originalSignalId: signal.id,
                error: error.message
            });
        }
    }
}

export const legislativeActor = new LegislativeActor();
