/**
 * NEO-CORTEX: SYSTÈME NERVEUX (SYNAPSE)
 * 
 * Bus d'événements central pour l'architecture Acteur-Organique.
 * Gère la distribution des signaux (NeuralSignals) entre les différents Cortex (Acteurs).
 */

// Types de priorité pour la modulation de l'attention
export type SignalPriority =
    | 'REFLEX'      // Haute priorité, traitement immédiat (ex: Erreur critique, Interaction UI directe)
    | 'COGNITIVE'   // Priorité normale, traitement métier standard (ex: Validation formulaire)
    | 'DREAM';      // Basse priorité, tâches de fond (ex: Analytics, Sync, Cleanup)

// Structure d'un Signal Nerveux (Evénement)
export interface NeuralSignal<T = any> {
    id: string;             // UUID unique du signal
    type: string;           // Type de signal (ex: "LEGISLATIVE_TEXT_SUBMITTED")
    source: string;         // Identifiant de l'émetteur (ex: "Sensoriel:DepotPage")
    payload: T;             // Données transportées
    timestamp: number;      // Moment de l'émission
    priority: SignalPriority;
    confidence: number;     // 0.0 - 1.0 (Niveau de certitude, pour logique floue future)
    correlationId?: string; // Pour tracer les chaines de réactions
}

type SignalHandler = (signal: NeuralSignal) => void;

class NeuralSystemClass {
    private static instance: NeuralSystemClass;
    private listeners: Map<string, Set<SignalHandler>> = new Map();
    private signalLog: NeuralSignal[] = []; // Mémoire tampon à court terme pour debugging
    private readonly MAX_LOG_SIZE = 100;

    private constructor() {
        console.log('🧠 [NeoCortex] Système Nerveux Initialisé');
    }

    public static getInstance(): NeuralSystemClass {
        if (!NeuralSystemClass.instance) {
            NeuralSystemClass.instance = new NeuralSystemClass();
        }
        return NeuralSystemClass.instance;
    }

    /**
     * Dispatch un signal dans le système nerveux
     */
    public dispatch(signal: Omit<NeuralSignal, 'id' | 'timestamp'> & { id?: string, timestamp?: number }) {
        const fullSignal: NeuralSignal = {
            id: signal.id || crypto.randomUUID(),
            timestamp: signal.timestamp || Date.now(),
            ...signal
        };

        this.logSignal(fullSignal);

        // Distribution aux abonnés du type spécifique
        if (this.listeners.has(fullSignal.type)) {
            const handlers = this.listeners.get(fullSignal.type);
            console.debug(`🧠 [Synapse] Dispatching ${fullSignal.type} to ${handlers?.size} listeners`);
            handlers?.forEach(handler => {
                try {
                    handler(fullSignal);
                } catch (error) {
                    console.error(`🧠 [NeoCortex] Erreur traitement signal ${fullSignal.type}:`, error);
                }
            });
        } else {
            console.warn(`🧠 [Synapse] No listeners for ${fullSignal.type}. Registered: ${Array.from(this.listeners.keys()).join(', ')}`);
        }

        // Distribution aux abonnés globaux (wildcard '*')
        if (this.listeners.has('*')) {
            this.listeners.get('*')?.forEach(handler => handler(fullSignal));
        }

        if (fullSignal.priority === 'REFLEX') {
            console.debug(`⚡ [Reflex] ${fullSignal.type}`, fullSignal.payload);
        }
    }

    /**
     * S'abonner à un type de signal
     */
    public subscribe(type: string, handler: SignalHandler): { unsubscribe: () => void } {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }

        this.listeners.get(type)?.add(handler);

        return {
            unsubscribe: () => {
                this.listeners.get(type)?.delete(handler);
                if (this.listeners.get(type)?.size === 0) {
                    this.listeners.delete(type);
                }
            }
        };
    }

    private logSignal(signal: NeuralSignal) {
        this.signalLog.unshift(signal);
        if (this.signalLog.length > this.MAX_LOG_SIZE) {
            this.signalLog.pop();
        }
    }

    public getRecentActivity() {
        return this.signalLog;
    }
}

export const NeuralSystem = NeuralSystemClass.getInstance();
