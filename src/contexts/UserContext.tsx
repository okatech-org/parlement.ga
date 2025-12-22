import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'president' | 'president_senate' | 'president_congress' | 'vp' | 'vp_senate' | 'deputy' | 'deputy_congress' | 'senator' | 'senator_congress' | 'substitute' | 'citizen' | 'questeur' | 'questeur_senate' | 'secretary' | 'secretary_senate' | 'secretary_session' | 'cmp_member' | 'questeur_budget' | 'questeur_resources' | 'questeur_services' | 'system_admin' | 'admin_an' | 'admin_senat' | 'admin_parlement';

interface User {
    id: string;
    name: string;
    phoneNumber: string;
    roles: UserRole[];
    // Bureau rank display label (e.g., "2ème Vice-Président", "1er Questeur")
    bureauLabel?: string;
    // For AN deputies
    circonscription?: string;
    // For Senators
    province?: string;
    origine?: 'partis' | 'société_civile' | 'fds';
}

interface UserContextType {
    user: User | null;
    currentRole: UserRole | null;
    login: (phoneNumber: string, accountType: string) => void;
    logout: () => void;
    switchRole: (role: UserRole) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [currentRole, setCurrentRole] = useState<UserRole | null>(null);

    // Load user from session storage on mount
    useEffect(() => {
        const storedUser = sessionStorage.getItem('user_data');
        const storedRole = sessionStorage.getItem('current_role');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        if (storedRole) {
            setCurrentRole(storedRole as UserRole);
        }
    }, []);

    /**
     * Role Priority System:
     * 1. Parliament Bureau (highest) - CMP Member, Congress President, Secretary Session
     * 2. AN/Senate Bureau - President, VP, Questeur, Secretary
     * 3. Elected Officials (lowest) - Deputy, Senator
     * 4. Citizen (public)
     */
    const ROLE_PRIORITY: UserRole[] = [
        // Parliament Bureau (highest priority)
        'cmp_member',
        'president_congress',
        'secretary_session',
        'deputy_congress',
        'senator_congress',
        // AN Bureau
        'president',
        'vp',
        'questeur',
        'questeur_budget',
        'questeur_resources',
        'questeur_services',
        'secretary',
        // Senate Bureau
        'president_senate',
        'vp_senate',
        'questeur_senate',
        'secretary_senate',
        // Admin roles
        'system_admin',
        'admin_parlement',
        'admin_an',
        'admin_senat',
        // Elected Officials
        'deputy',
        'senator',
        'substitute',
        // Public
        'citizen',
    ];

    const getHighestPriorityRole = (roles: UserRole[]): UserRole => {
        for (const priorityRole of ROLE_PRIORITY) {
            if (roles.includes(priorityRole)) {
                return priorityRole;
            }
        }
        return roles[0] || 'citizen';
    };

    const navigateToRole = (role: UserRole) => {
        // Always read latest data from storage for navigation decisions to avoid state race conditions
        const storedUser = sessionStorage.getItem('user_data');
        const currentUser = storedUser ? JSON.parse(storedUser) : user;
        const userRoles = currentUser?.roles || [];

        switch (role) {
            case 'president':
                if (userRoles.includes('senator')) {
                    navigate('/senat/espace/president');
                } else {
                    navigate('/president');
                }
                break;
            case 'president_senate':
                navigate('/senat/espace/president');
                break;
            case 'vp':
                if (userRoles.includes('senator')) {
                    navigate('/senat/espace/vp');
                } else {
                    navigate('/vp');
                }
                break;
            case 'vp_senate':
                navigate('/senat/espace/vp');
                break;
            case 'deputy':
                navigate('/vote'); // Deputy Dashboard
                break;
            case 'senator':
                navigate('/senat/espace/senateur'); // Senator Dashboard
                break;
            case 'substitute':
                navigate('/suppleant');
                break;
            case 'questeur':
            case 'questeur_budget':
            case 'questeur_resources':
            case 'questeur_services':
                if (userRoles.includes('senator')) {
                    navigate('/senat/espace/questeur');
                } else {
                    navigate('/questeurs');
                }
                break;
            case 'questeur_senate':
                navigate('/senat/espace/questeur');
                break;
            case 'secretary':
                if (userRoles.includes('senator')) {
                    // Fallback to basic Senate space if specific Secretary space doesn't exist yet
                    navigate('/senat/espace');
                } else {
                    navigate('/secretaires');
                }
                break;
            case 'secretary_senate':
                navigate('/senat/espace/secretary');
                break;
            case 'citizen':
                navigate('/citizen');
                break;
            case 'system_admin':
                navigate('/admin/dashboard');
                break;
            case 'admin_an':
                navigate('/an/admin');
                break;
            case 'admin_senat':
                navigate('/senat/admin');
                break;
            case 'admin_parlement':
                navigate('/parlement/admin');
                break;
            case 'president_congress':
                navigate('/parlement/espace/president');
                break;
            case 'deputy_congress':
                navigate('/parlement/congres');
                break;
            case 'senator_congress':
                navigate('/parlement/congres');
                break;
            case 'secretary_session':
                navigate('/parlement/espace/secretaire');
                break;
            case 'cmp_member':
                navigate('/parlement/cmp');
                break;
            default:
                navigate('/');
        }
    };

    const login = (phoneNumber: string, accountType: string) => {
        // Normalize phone number
        const normalizedPhone = phoneNumber.trim();

        console.log('[Login] Phone:', normalizedPhone, 'AccountType:', accountType);

        // Mock User Data based on phone number
        let mockUser: User = {
            id: '1',
            name: 'Utilisateur',
            phoneNumber: normalizedPhone,
            roles: ['citizen']
        };

        // Mock Logic for Roles
        if (normalizedPhone === "01010101") {
            // President: Has President, Deputy, and Citizen roles
            mockUser = { ...mockUser, name: 'Michel Régis Onanga Ndiaye', roles: ['president', 'deputy', 'citizen'] };
        } else if (normalizedPhone === "02020202") {
            // VP: Has VP, Deputy, and Citizen roles
            mockUser = { ...mockUser, name: 'François Ndong Obiang', roles: ['vp', 'deputy', 'citizen'] };
        } else if (normalizedPhone === "03030303") {
            // Substitute: Has Substitute and Citizen roles
            mockUser = { ...mockUser, name: 'M. Suppléant', roles: ['substitute', 'citizen'] };
        } else if (normalizedPhone === "04040401") {
            // Questeur Budget
            mockUser = { ...mockUser, name: 'Questeur Budget', roles: ['questeur_budget', 'citizen'] };
        } else if (normalizedPhone === "04040402") {
            // Questeur Ressources
            mockUser = { ...mockUser, name: 'Questeur Ressources', roles: ['questeur_resources', 'citizen'] };
        } else if (normalizedPhone === "04040403") {
            // Questeur Services
            mockUser = { ...mockUser, name: 'Questeur Services', roles: ['questeur_services', 'citizen'] };
        } else if (normalizedPhone === "04040404") {
            // Questeur General (Admin) - Access to all
            mockUser = { ...mockUser, name: 'M. Questeur Général', roles: ['questeur', 'citizen'] };
        } else if (normalizedPhone === "05050505") {
            // Secretary: Admin role
            mockUser = { ...mockUser, name: 'M. Secrétaire', roles: ['secretary', 'citizen'] };
        } else if (normalizedPhone === "01010102" || phoneNumber === "11111111") {
            // Senate President: Has President, Senator, and Citizen roles
            mockUser = { ...mockUser, name: 'Huguette Yvonne NYANA EKOUME Ep. AWORI', roles: ['president_senate', 'senator', 'citizen'], bureauLabel: 'Présidente du Sénat', province: 'Ogooué-Ivindo' };
        } else if (normalizedPhone === "12121211") {
            // 1er VP Sénat
            mockUser = { ...mockUser, name: 'MABIALA Serge Maurice', roles: ['vp_senate', 'senator', 'citizen'], bureauLabel: '1er Vice-Président', province: 'Ngounié' };
        } else if (normalizedPhone === "12121212") {
            // 2ème VP Sénat
            mockUser = { ...mockUser, name: 'BIYOGHE MBA Paul', roles: ['vp_senate', 'senator', 'citizen'], bureauLabel: '2ème Vice-Président', province: 'Estuaire' };
        } else if (normalizedPhone === "12121213") {
            // 3ème VP Sénat
            mockUser = { ...mockUser, name: 'FOUEFOUE Élodie Diane Ep. SANDJOH', roles: ['vp_senate', 'senator', 'citizen'], bureauLabel: '3ème Vice-Présidente', province: 'Haut-Ogooué' };
        } else if (normalizedPhone === "12121214") {
            // 4ème VP Sénat
            mockUser = { ...mockUser, name: 'REVANGUE Madeleine Sidonie', roles: ['vp_senate', 'senator', 'citizen'], bureauLabel: '4ème Vice-Présidente', province: 'Moyen-Ogooué' };
        } else if (normalizedPhone === "12121215") {
            // 5ème VP Sénat
            mockUser = { ...mockUser, name: 'ONA ESSANGUI Marc', roles: ['vp_senate', 'senator', 'citizen'], bureauLabel: '5ème Vice-Président', province: 'Woleu-Ntem' };
        } else if (normalizedPhone === "14141411") {
            // 1er Questeur Sénat
            mockUser = { ...mockUser, name: 'OWONO NGUEMA Jean Christophe', roles: ['questeur_senate', 'senator', 'citizen'], bureauLabel: '1er Questeur', province: 'Woleu-Ntem' };
        } else if (normalizedPhone === "14141412") {
            // 2ème Questeur Sénat
            mockUser = { ...mockUser, name: 'MAGHOUMBOU Liliane Anette Ep. NDJAMI', roles: ['questeur_senate', 'senator', 'citizen'], bureauLabel: '2ème Questeur', province: 'Nyanga' };
        } else if (normalizedPhone === "15151511") {
            // 1er Secrétaire Sénat
            mockUser = { ...mockUser, name: 'NGOUBOU Etienne Dieudonné', roles: ['secretary_senate', 'senator', 'citizen'], bureauLabel: '1er Secrétaire', province: 'Nyanga' };
        } else if (normalizedPhone === "15151512") {
            // 2ème Secrétaire Sénat
            mockUser = { ...mockUser, name: 'MPAGA Georges', roles: ['secretary_senate', 'senator', 'citizen'], bureauLabel: '2ème Secrétaire', province: 'Ogooué-Maritime' };
        } else if (normalizedPhone === "15151513") {
            // 3ème Secrétaire Sénat
            mockUser = { ...mockUser, name: 'Secrétaire 3', roles: ['secretary_senate', 'senator', 'citizen'], bureauLabel: '3ème Secrétaire', province: 'Estuaire' };
        } else if (normalizedPhone === "15151514") {
            // 4ème Secrétaire Sénat
            mockUser = { ...mockUser, name: 'Secrétaire 4', roles: ['secretary_senate', 'senator', 'citizen'], bureauLabel: '4ème Secrétaire', province: 'Haut-Ogooué' };
        } else if (normalizedPhone === "15151515") {
            // 5ème Secrétaire Sénat
            mockUser = { ...mockUser, name: 'Secrétaire 5', roles: ['secretary_senate', 'senator', 'citizen'], bureauLabel: '5ème Secrétaire', province: 'Woleu-Ntem' };

            // ==================== CONGRÈS / CMP ====================
        } else if (normalizedPhone === "20202001") {
            // Président du Congrès (Président de l'AN - convoque et préside les sessions conjointes)
            mockUser = { ...mockUser, name: 'Michel Régis Onanga Ndiaye', roles: ['president_congress', 'president', 'deputy', 'citizen'], bureauLabel: 'Président du Congrès' };
        } else if (normalizedPhone === "20202002") {
            // Secrétaire de Séance du Congrès (1er Secrétaire AN désigné)
            mockUser = { ...mockUser, name: 'MOUNDOUNGA Bernadette', roles: ['secretary_session', 'secretary', 'deputy', 'citizen'], bureauLabel: 'Secrétaire de Séance', circonscription: 'Libreville-Nord' };
        } else if (normalizedPhone === "20202003") {
            // Député participant au Congrès (pour révision constitutionnelle)
            mockUser = { ...mockUser, name: 'NDONG ESSONO Pierre', roles: ['deputy_congress', 'deputy', 'citizen'], bureauLabel: 'Député (Congrès)', circonscription: 'Ntoum' };
        } else if (normalizedPhone === "20202004") {
            // Sénateur participant au Congrès (pour révision constitutionnelle)
            mockUser = { ...mockUser, name: 'ONDO MOUCHITA Laurent', roles: ['senator_congress', 'senator', 'citizen'], bureauLabel: 'Sénateur (Congrès)', province: 'Estuaire' };
        } else if (normalizedPhone === "20202005") {
            // Membre CMP - Commissaire AN
            mockUser = { ...mockUser, name: 'BIYOGHE MEBA Joséphine', roles: ['cmp_member', 'deputy', 'citizen'], bureauLabel: 'Commissaire CMP (AN)', circonscription: 'Libreville-Sud' };
        } else if (normalizedPhone === "20202006") {
            // Membre CMP - Commissaire Sénat
            mockUser = { ...mockUser, name: 'NZAMBA NZAMBA Robert', roles: ['cmp_member', 'senator', 'citizen'], bureauLabel: 'Commissaire CMP (Sénat)', province: 'Ogooué-Maritime' };
        } else if (normalizedPhone === "20202007") {
            // Coprésident CMP - Député
            mockUser = { ...mockUser, name: 'MEBIAME François', roles: ['cmp_member', 'deputy', 'citizen'], bureauLabel: 'Coprésident CMP (AN)', circonscription: 'Owendo' };
        } else if (normalizedPhone === "20202008") {
            // Coprésident CMP - Sénateur
            mockUser = { ...mockUser, name: 'KOMBILA MOUSSAVOU Alain', roles: ['cmp_member', 'senator', 'citizen'], bureauLabel: 'Coprésident CMP (Sénat)', province: 'Nyanga' };

        } else if (normalizedPhone === "admin00") {
            // System Admin / Super Admin
            mockUser = { ...mockUser, name: 'Administrateur Système', roles: ['system_admin'] };
        } else if (normalizedPhone === "admin01") {
            // Admin AN
            mockUser = { ...mockUser, name: 'Administrateur AN', roles: ['admin_an'] };
        } else if (normalizedPhone === "admin02") {
            // Admin Sénat
            mockUser = { ...mockUser, name: 'Administrateur Sénat', roles: ['admin_senat'] };
        } else if (normalizedPhone === "admin03") {
            // Admin Parlement
            mockUser = { ...mockUser, name: 'Administrateur Parlement', roles: ['admin_parlement'] };
        } else if (accountType === 'parlement') {
            // Standard Deputy
            mockUser = { ...mockUser, name: 'Honorable Député', roles: ['deputy', 'citizen'] };
        }

        setUser(mockUser);
        sessionStorage.setItem('user_data', JSON.stringify(mockUser));

        // Role Priority Navigation: Always navigate to the highest priority role's space
        const highestPriorityRole = getHighestPriorityRole(mockUser.roles);
        setCurrentRole(highestPriorityRole);
        sessionStorage.setItem('current_role', highestPriorityRole);
        navigateToRole(highestPriorityRole);
    };

    const logout = () => {
        const isDemo = sessionStorage.getItem('is_demo') === 'true';
        let redirectPath = '/';

        // Contextual Redirection
        if (isDemo) {
            // Return to specific Demo page
            if (currentRole === 'admin_an' || user?.roles.includes('deputy')) {
                redirectPath = '/an/demo';
            } else if (currentRole === 'admin_senat' || user?.province) {
                redirectPath = '/senat/demo';
            } else if (currentRole === 'admin_parlement') {
                redirectPath = '/parlement/demo';
            } else {
                // Default fallback for demo
                redirectPath = '/an/demo';
            }
        } else {
            // Updated Logic per User Request
            const path = window.location.pathname;

            // 1. Citizen -> Parlement Home
            if (currentRole === 'citizen' || path.includes('/espace/citoyen') || path.includes('/citizen')) {
                redirectPath = '/parlement';
            }
            // 2. Senate Context -> Senate Home (Senators, Senate Admin)
            else if (path.includes('/senat') || currentRole === 'admin_senat' || user?.province) {
                redirectPath = '/senat';
            }
            // 3. AN Context -> AN Home (Deputies, Questeurs, etc.)
            else if (path.includes('/an') || ['deputy', 'substitute', 'questeur', 'secretary', 'questeur_budget', 'questeur_resources', 'questeur_services', 'admin_an'].includes(currentRole || '')) {
                redirectPath = '/an';
            }
            // 4. Fallback
            else {
                redirectPath = '/';
            }
        }

        // Clear storage immediately
        sessionStorage.removeItem('user_data');
        sessionStorage.removeItem('current_role');
        sessionStorage.removeItem('is_demo');

        // Force HARD redirection to bypass ProtectedRoute race conditions
        window.location.href = redirectPath;
    };

    const switchRole = (role: UserRole) => {
        // Strict check: User must possess the role
        if (!user || !user.roles.includes(role)) {
            console.error(`Attempted to switch to unauthorized role: ${role}`);
            return;
        }

        console.log(`Switching to role: ${role}`);
        setCurrentRole(role);
        sessionStorage.setItem('current_role', role);
        navigateToRole(role);
    };

    return (
        <UserContext.Provider value={{ user, currentRole, login, logout, switchRole }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
