/**
 * NEO-CORTEX: COMMUNICATION ACTOR
 * 
 * Cortex responsable de la gestion des communications (iBoite).
 * Il intercepte les intentions d'envoi de message, valide, et délègue l'exécution
 * au service infrastructurel (iBoiteService) tout en émettant des signaux de feedback.
 */

import { BioActor } from '../BioActor';
import { NeuralSignal } from '../synapse';
import { iBoiteService } from '@/services/iboite-service';

// État interne de l'acteur
interface CommunicationState {
    pendingMessages: number;
    lastMessageTimestamp: number | null;
    errors: string[];
}

export class CommunicationActor extends BioActor<CommunicationState> {
    private service: typeof iBoiteService;

    constructor() {
        super('Cortex:Communication', {
            pendingMessages: 0,
            lastMessageTimestamp: null,
            errors: []
        });
        this.service = iBoiteService; // Liaison avec l'infrastructure existante (Strangler Fig)
    }

    protected initialize(): void {
        // Dendrite : Écoute des demandes d'envoi de message
        this.listen('COMMUNICATION:SEND_MESSAGE', this.handleSendMessage.bind(this));
    }

    /**
     * Traitement du signal "Envoi de message"
     */
    private async handleSendMessage(payload: any, signal: NeuralSignal) {
        console.log('📨 [Cortex:Comm] Intention de message reçue', payload);

        // Mise à jour état (Plasticité à court terme)
        this.setState({ pendingMessages: this.state.pendingMessages + 1 });

        // Signal "Traitement en cours" (pour UI loading)
        this.emit('COMMUNICATION:SENDING_STARTED', {
            correlationId: signal.id
        });

        try {
            // Délégation au "muscle" (Service existant)
            // On s'attend à ce que le payload contienne les params nécessaires pour sendConversationMessage
            // ou sendMessage (on simplifie pour l'exemple : payload = params de sendMessage)

            const { conversationId, content, attachments } = payload;

            if (!conversationId || !content) {
                throw new Error("Données incomplètes pour l'envoi");
            }

            const result = await this.service.sendMessage({
                conversationId,
                content,
                attachments
            });

            if (!result) {
                throw new Error("Echec de l'envoi (Service retour null)");
            }

            // Réussite -> Emission signal "Succès"
            this.setState({
                pendingMessages: this.state.pendingMessages - 1,
                lastMessageTimestamp: Date.now()
            });

            this.emit('COMMUNICATION:MESSAGE_SENT', {
                originalSignalId: signal.id,
                message: result
            });

        } catch (error: any) {
            console.error('❌ [Cortex:Comm] Erreur envoi', error);

            this.setState({
                pendingMessages: this.state.pendingMessages - 1,
                errors: [...this.state.errors, error.message]
            });

            // Signal "Erreur"
            this.emit('COMMUNICATION:ERROR', {
                originalSignalId: signal.id,
                error: error.message
            });
        }
    }
}

// Singleton de l'acteur (pour l'instant, instance unique globale)
export const communicationActor = new CommunicationActor();
