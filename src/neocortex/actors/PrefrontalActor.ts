/**
 * NEO-CORTEX: PREFRONTAL ACTOR (Identity & Decision)
 * 
 * Cortex responsable de l'Identité, des Rôles et des décisions de navigation majeures.
 * Remplace la logique métier anciennement enfouie dans UserContext.
 */

import { BioActor } from '../BioActor';
import { NeuralSignal } from '../synapse';

// Types dupliqués pour l'instant pour éviter dépendances circulaires
// À terme, ces types devraient être dans @/types/neocortex-types.ts
export type UserRole = 'president' | 'president_senate' | 'president_congress' | 'vp' | 'vp_senate' | 'deputy' | 'deputy_congress' | 'senator' | 'senator_congress' | 'substitute' | 'citizen' | 'questeur' | 'questeur_senate' | 'secretary' | 'secretary_senate' | 'secretary_session' | 'cmp_member' | 'questeur_budget' | 'questeur_resources' | 'questeur_services' | 'system_admin' | 'admin_an' | 'admin_senat' | 'admin_parlement';

export interface User {
    id: string;
    name: string;
    phoneNumber: string;
    roles: UserRole[];
    bureauLabel?: string;
    circonscription?: string;
    province?: string;
    origine?: 'partis' | 'société_civile' | 'fds';
}

interface IdentityState {
    currentUser: User | null;
    currentRole: UserRole | null;
    isAuthenticated: boolean;
    lastLoginAttempt: number | null;
}

/**
 * Hiérarchie de priorité des rôles pour la redirection par défaut
 */
const ROLE_PRIORITY: UserRole[] = [
    'cmp_member', 'president_congress', 'secretary_session', 'deputy_congress', 'senator_congress',
    'president', 'vp', 'questeur', 'questeur_budget', 'questeur_resources', 'questeur_services', 'secretary',
    'president_senate', 'vp_senate', 'questeur_senate', 'secretary_senate',
    'system_admin', 'admin_parlement', 'admin_an', 'admin_senat',
    'deputy', 'senator', 'substitute',
    'citizen',
];

export class PrefrontalActor extends BioActor<IdentityState> {

    constructor() {
        super('Cortex:Prefrontal', {
            currentUser: null,
            currentRole: null,
            isAuthenticated: false,
            lastLoginAttempt: null
        });

        // Hydratation au démarrage (Mémoire persistante)
        this.hydrateFromStorage();
    }

    protected initialize(): void {
        this.listen('IDENTITY:LOGIN_INTENT', this.handleLogin.bind(this));
        this.listen('IDENTITY:LOGOUT_INTENT', this.handleLogout.bind(this));
        this.listen('IDENTITY:SWITCH_ROLE_INTENT', this.handleSwitchRole.bind(this));
    }

    private hydrateFromStorage() {
        try {
            const storedUser = sessionStorage.getItem('user_data');
            const storedRole = sessionStorage.getItem('current_role');
            if (storedUser) {
                this.setState({
                    currentUser: JSON.parse(storedUser),
                    currentRole: storedRole as UserRole || null,
                    isAuthenticated: true
                });
                console.log('🧠 [Prefrontal] Conscience restaurée (SessionStorage)');

                // On ré-émet le signal de login pour réveiller les cortex dépendants (Social, etc.)
                this.emit('IDENTITY:LOGIN_SUCCESS', {
                    user: JSON.parse(storedUser),
                    role: storedRole as UserRole || null,
                    restored: true
                });
            }
        } catch (e) {
            console.error('🧠 [Prefrontal] Amnésie partielle (Erreur lecture storage)', e);
        }
    }

    /**
     * Traitement de l'intention de connexion
     */
    private handleLogin(payload: { phoneNumber: string, accountType: string }, signal: NeuralSignal) {
        console.log('🧠 [Prefrontal] Analyse identité...', payload.phoneNumber);

        const user = this.resolveUserIdentity(payload.phoneNumber, payload.accountType);

        if (user) {
            const priorityRole = this.getHighestPriorityRole(user.roles);

            // Mise à jour état
            this.setState({
                currentUser: user,
                currentRole: priorityRole,
                isAuthenticated: true,
                lastLoginAttempt: Date.now()
            });

            // Persistance (Hippocampe simulé)
            sessionStorage.setItem('user_data', JSON.stringify(user));
            sessionStorage.setItem('current_role', priorityRole);

            // Emission du succès et de la décision de navigation
            this.emit('IDENTITY:LOGIN_SUCCESS', { user, role: priorityRole });

            // On émet aussi un signal de changement d'état générique pour les composants réactifs
            this.emit('IDENTITY:STATE_CHANGED', this.state);

        } else {
            console.warn('🧠 [Prefrontal] Identité inconnue');
            this.emit('IDENTITY:LOGIN_FAILURE', { reason: 'User not found' });
        }
    }

    private handleLogout() {
        console.log('🧠 [Prefrontal] Dissolution identité (Logout)');
        sessionStorage.removeItem('user_data');
        sessionStorage.removeItem('current_role');
        sessionStorage.removeItem('is_demo'); // Ensure demo flag is cleared too

        this.setState({
            currentUser: null,
            currentRole: null,
            isAuthenticated: false
        });

        console.log('🧠 [Prefrontal] Emitting LOGOUT_SUCCESS'); // DEBUG
        this.emit('IDENTITY:LOGOUT_SUCCESS', {});
        this.emit('IDENTITY:STATE_CHANGED', this.state);
    }

    private handleSwitchRole(payload: { role: UserRole }) {
        if (this.state.currentUser?.roles.includes(payload.role)) {
            this.setState({ currentRole: payload.role });
            sessionStorage.setItem('current_role', payload.role);

            this.emit('IDENTITY:ROLE_SWITCHED', { role: payload.role });
            this.emit('IDENTITY:STATE_CHANGED', this.state);
        }
    }

    // --- LOGIQUE MÉTIER PURE (EXTRAITE DE USERCONTEXT) ---

    private getHighestPriorityRole(roles: UserRole[]): UserRole {
        for (const priorityRole of ROLE_PRIORITY) {
            if (roles.includes(priorityRole)) return priorityRole;
        }
        return roles[0] || 'citizen';
    }

    private resolveUserIdentity(phone: string, type: string): User {
        // Logique de Mock extraite de UserContext.tsx
        // Copie des règles existantes (simplifiées pour la démo, mais exhaustives selon le fichier source)

        const normalizedPhone = phone.trim();
        let mockUser: User = { id: '1', name: 'Utilisateur', phoneNumber: normalizedPhone, roles: ['citizen'] };

        // Mappings (Extrait de UserContext)
        const mappings: Record<string, Partial<User>> = {
            "01010101": { name: 'Michel Régis Onanga Ndiaye', roles: ['president', 'deputy', 'citizen'] },
            "02020202": { name: 'François Ndong Obiang', roles: ['vp', 'deputy', 'citizen'] },
            "03030303": { name: 'M. Suppléant', roles: ['substitute', 'citizen'] },
            // ... (Autres cas AN)
            "01010102": { name: 'Huguette AWORI', roles: ['president_senate', 'senator', 'citizen'], bureauLabel: 'Présidente du Sénat' },
            "11111111": { name: 'Huguette AWORI', roles: ['president_senate', 'senator', 'citizen'], bureauLabel: 'Présidente du Sénat' },
            "12121211": { name: 'MABIALA Serge Maurice', roles: ['vp_senate', 'senator', 'citizen'], bureauLabel: '1er VP' },
            // ... (Cas Sénat)

            // Congrès
            "20202001": { name: 'Michel Régis Onanga Ndiaye', roles: ['president_congress', 'president', 'deputy', 'citizen'], bureauLabel: 'Président du Congrès' },
            "20202002": { name: 'MOUNDOUNGA Bernadette', roles: ['secretary_session', 'secretary', 'deputy', 'citizen'], bureauLabel: 'Secrétaire de Séance' },
            "20202003": { name: 'NDONG ESSONO Pierre', roles: ['deputy_congress', 'deputy', 'citizen'], bureauLabel: 'Député (Congrès)' },
            "20202004": { name: 'ONDO MOUCHITA Laurent', roles: ['senator_congress', 'senator', 'citizen'], bureauLabel: 'Sénateur (Congrès)' },
            "20202005": { name: 'BIYOGHE MEBA Joséphine', roles: ['cmp_member', 'deputy', 'citizen'], bureauLabel: 'Commissaire CMP (AN)' },
            "20202006": { name: 'NZAMBA NZAMBA Robert', roles: ['cmp_member', 'senator', 'citizen'], bureauLabel: 'Commissaire CMP (Sénat)' },

            // Admins
            "admin00": { name: 'Admin Système', roles: ['system_admin'] },
            "admin01": { name: 'Admin AN', roles: ['admin_an'] },
            "admin02": { name: 'Admin Sénat', roles: ['admin_senat'] },
            "admin03": { name: 'Admin Parlement', roles: ['admin_parlement'] }
        };

        if (mappings[normalizedPhone]) {
            return { ...mockUser, ...mappings[normalizedPhone] };
        }

        // Fallback générique
        if (type === 'parlement') {
            mockUser.name = 'Honorable Député';
            mockUser.roles = ['deputy', 'citizen'];
        }

        return mockUser;
    }
}

export const prefrontalActor = new PrefrontalActor();
