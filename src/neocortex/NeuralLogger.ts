/**
 * NEO-CORTEX: NEURAL LOGGER (EEG)
 * 
 * Outil de monitoring pour visualiser l'activité du système nerveux en temps réel.
 * Agit comme une sonde écoutant tous les signaux traversant le synapse.
 */

import { NeuralSystem as neuralSystem, NeuralSignal } from './synapse';

const STYLES = {
    SIGNAL: 'background: #2b2b2b; color: #bada55; padding: 2px 5px; border-radius: 3px; font-weight: bold;',
    PAYLOAD: 'color: #9cdcfe;',
    META: 'color: #888; font-size: 0.8em;',
    ERROR: 'background: #5c0000; color: #ffcccc; padding: 2px 5px; border-radius: 3px; font-weight: bold;'
};

export class NeuralLogger {
    private isEnabled: boolean = true;

    constructor() {
        if (import.meta.env.DEV) {
            this.attach();
        }
    }

    private attach() {
        // Enregistrement d'un middleware ou d'un écouteur global
        // Note: Notre implémentation actuelle de synapse.ts est basique.
        // Pour ce logger, nous allons "monkey-patch" la méthode dispatch du singleton
        // C'est une méthode intrusive mais efficace pour le debug sans refondre l'architecture.

        const originalDispatch = neuralSystem.dispatch.bind(neuralSystem);

        neuralSystem.dispatch = (signal: NeuralSignal) => {
            if (this.isEnabled) {
                this.logSignal(signal);
            }
            return originalDispatch(signal);
        };

        console.log('%c🧠 [NeuralLogger] EEG Monitoring Activé', 'color: #bada55; font-size: 1.2em; font-weight: bold;');
    }

    private logSignal(signal: NeuralSignal) {
        const isError = signal.type.includes('ERROR') || signal.priority === 'REFLEX';
        const style = isError ? STYLES.ERROR : STYLES.SIGNAL;
        const icon = this.getIconForType(signal.type);

        console.groupCollapsed(`%c${icon} ${signal.type}`, style);

        console.log('%cPayload:', STYLES.PAYLOAD, signal.payload);
        console.log('%cMeta:', STYLES.META, {
            id: signal.id || 'pending-generation',
            timestamp: signal.timestamp ? new Date(signal.timestamp).toISOString() : 'now (pending)',
            priority: signal.priority,
            sender: signal.source
        });

        if (signal.correlationId) {
            console.log(`%c🔗 Correlation: ${signal.correlationId}`, 'color: #ff9e64');
        }

        console.groupEnd();
    }

    private getIconForType(type: string): string {
        if (type.includes('ERROR')) return '💥';
        if (type.includes('COMMUNICATION')) return '📡';
        if (type.includes('LEGISLATIVE')) return '📜';
        if (type.includes('IDENTITY')) return '👤';
        if (type.includes('NAVIGATION')) return '🧭';
        return '⚡';
    }
}

// Auto-start in Dev
export const neuralLogger = new NeuralLogger();
