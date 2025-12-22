/**
 * NEO-CORTEX: HOOK SENSORIEL (USE NERVE)
 * 
 * Ce hook permet aux composants React (Cortex Sensoriel) de :
 * 1. Stimuler le système nerveux (Envoyer un signal)
 * 2. Ressentir des signaux (S'abonner à des événements)
 */

import { useEffect, useCallback } from 'react';
import { NeuralSystem, NeuralSignal } from '../neocortex/synapse';

export function useNerve(
    signalTypeToSense?: string,
    reaction?: (payload: any, signal: NeuralSignal) => void
) {
    // Sensation (Abonnement)
    useEffect(() => {
        if (!signalTypeToSense || !reaction) return;

        console.debug(`👂 [useNerve] Connexion dendrite sur ${signalTypeToSense}`);
        const subscription = NeuralSystem.subscribe(signalTypeToSense, (signal) => {
            reaction(signal.payload, signal);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [signalTypeToSense, reaction]);

    // Stimulation (Emission)
    const stimulate = useCallback((type: string, payload: any, confidence: number = 1.0) => {
        NeuralSystem.dispatch({
            type,
            source: 'SensoryCortex:ReactUI', // Pourrait être plus précis avec le nom du composant
            payload,
            confidence,
            priority: 'REFLEX' // Les actions UI sont souvent prioritaires (Intention utilisateur)
        });
    }, []);

    return { stimulate };
}
