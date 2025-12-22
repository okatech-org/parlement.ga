/**
 * NEO-CORTEX: BIO-ACTOR
 * 
 * Classe de base abstraite pour tous les Acteurs du système.
 * Un Acteur représente une unité fonctionnelle (Cortex) capable de :
 * - Maintenir un état interne
 * - Réagir à des signaux (Dendrites)
 * - Émettre des signaux (Axones)
 */

import { NeuralSystem, NeuralSignal } from './synapse';

export abstract class BioActor<State> {
    protected state: State;
    protected subscriptions: Array<{ unsubscribe: () => void }> = [];
    protected name: string;

    constructor(name: string, initialState: State) {
        this.name = name;
        this.state = initialState;
        this.initialize();
        console.log(`🥚 [Acteur] ${this.name} né avec l'état initial`);
    }

    /**
     * Initialisation : S'abonner aux signaux pertinents ici
     */
    protected abstract initialize(): void;

    /**
     * Méthode helper pour s'abonner (Créer une Dendrite)
     */
    protected listen(signalType: string, handler: (payload: any, signal: NeuralSignal) => void) {
        const sub = NeuralSystem.subscribe(signalType, (signal) => {
            // Logique de filtrage ou pré-traitement possible ici
            handler(signal.payload, signal);
        });
        this.subscriptions.push(sub);
    }

    /**
     * Méthode helper pour émettre (Créer un Axone)
     */
    protected emit(type: string, payload: any, confidence: number = 1.0) {
        NeuralSystem.dispatch({
            type,
            source: this.name,
            payload,
            confidence,
            priority: 'COGNITIVE'
        });
    }

    /**
     * Mise à jour de l'état interne (Plasticité)
     */
    protected setState(newState: Partial<State>) {
        this.state = { ...this.state, ...newState };
        // On pourrait émettre un signal de changement d'état ici si besoin (Observabilité)
    }

    /**
     * Nettoyage (Apoptose)
     */
    public kill() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
        console.log(`💀 [Acteur] ${this.name} détruit`);
    }
}
