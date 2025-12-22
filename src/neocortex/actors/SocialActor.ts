/**
 * NEO-CORTEX: SOCIAL ACTOR (Relations & Annuaire)
 * 
 * Responsable du graphe social :
 * - Qui connait qui ?
 * - Qui a le droit de contacter qui ?
 * - Fournit l'annuaire unifié pour iBoite, iCorrespondance, iAgenda.
 */

import { BioActor } from '../BioActor';
import { NeuralSignal } from '../synapse';
import { MOCK_DIRECTORY, DirectoryContact } from '@/data/mock-directory';
import { User, UserRole } from './PrefrontalActor';

interface SocialState {
    fullDirectory: DirectoryContact[];
    accessibleContacts: DirectoryContact[];
    isLoading: boolean;
    lastUpdated: number;
}

const PARLIAMENTARY_ROLES: UserRole[] = [
    'president', 'vp', 'questeur', 'secretary', 'deputy', 'substitute', // AN
    'president_senate', 'vp_senate', 'questeur_senate', 'secretary_senate', 'senator', // SENAT
    'admin_an', 'admin_senat', 'admin_parlement', 'system_admin' // ADMINS
];

export class SocialActor extends BioActor<SocialState> {

    constructor() {
        super('Cortex:Social', {
            fullDirectory: [],
            accessibleContacts: [],
            isLoading: false,
            lastUpdated: 0
        });
    }

    protected initialize(): void {
        // Réagir à la connexion pour charger l'annuaire approprié
        this.listen('IDENTITY:LOGIN_SUCCESS', this.handleLoginSuccess.bind(this));

        // Réagir à la demande explicite de rafraichissement
        this.listen('SOCIAL:REFRESH_DIRECTORY', this.handleRefreshRequest.bind(this));

        // Réagir à la déconnexion pour nettoyer (sécurité)
        this.listen('IDENTITY:LOGOUT_SUCCESS', this.handleLogout.bind(this));
    }

    private handleLoginSuccess(payload: { user: User, role: UserRole }, signal: NeuralSignal) {
        console.log('🧠 [Social] Connexion détectée. Calcul du cercle de confiance...');
        this.setState({ isLoading: true });

        // Simulation latence réseau (optionnel, pour réalisme UI)
        setTimeout(() => {
            const isParliamentarian = payload.user.roles.some(r => PARLIAMENTARY_ROLES.includes(r));

            let accessibleContacts: DirectoryContact[] = [];

            if (isParliamentarian) {
                // Règle métier : Un parlementaire voit TOUT LE MONDE (Pairs + Bureaux + Admins)
                // On exclut juste l'utilisateur lui-même de la liste
                accessibleContacts = MOCK_DIRECTORY.filter(c => c.phoneNumber !== payload.user.phoneNumber);
                console.log(`🧠 [Social] Accès Plein Tarif accordé (${accessibleContacts.length} contacts)`);
            } else {
                // Règle métier : Un citoyen ne voit que les profils publics (ex: Présidents) - À définir
                // Pour l'instant, vide pour éviter le spam
                console.log('🧠 [Social] Accès Restreint (Citoyen)');
                accessibleContacts = [];
            }

            this.setState({
                fullDirectory: MOCK_DIRECTORY, // "Memory"
                accessibleContacts, // "Perception"
                isLoading: false,
                lastUpdated: Date.now()
            });

            this.emit('SOCIAL:DIRECTORY_READY', { contacts: accessibleContacts });
        }, 500);
    }

    private handleRefreshRequest() {
        // Simple re-emit de l'état actuel pour les composants qui viennent de monter
        this.emit('SOCIAL:DIRECTORY_READY', { contacts: this.state.accessibleContacts });
    }

    private handleLogout() {
        console.log('🧠 [Social] Nettoyage mémoire (Amnésie sécurité)');
        this.setState({
            accessibleContacts: [],
            isLoading: false
        });
    }
}

export const socialActor = new SocialActor();
