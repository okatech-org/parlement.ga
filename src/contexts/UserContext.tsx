import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'president' | 'vp' | 'deputy' | 'substitute' | 'citizen' | 'questeur' | 'secretary' | 'questeur_budget' | 'questeur_resources' | 'questeur_services' | 'system_admin' | 'admin_an' | 'admin_senat' | 'admin_parlement';

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

    const navigateToRole = (role: UserRole) => {
        switch (role) {
            case 'president':
                navigate('/president');
                break;
            case 'vp':
                navigate('/vp');
                break;
            case 'deputy':
                navigate('/vote'); // Deputy Dashboard
                break;
            case 'substitute':
                navigate('/suppleant');
                break;
            case 'questeur':
            case 'questeur_budget':
            case 'questeur_resources':
            case 'questeur_services':
                navigate('/questeurs');
                break;
            case 'secretary':
                navigate('/secretaires');
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
            default:
                navigate('/');
        }
    };

    const login = (phoneNumber: string, accountType: string) => {
        // Mock User Data based on phone number
        let mockUser: User = {
            id: '1',
            name: 'Utilisateur',
            phoneNumber,
            roles: ['citizen']
        };

        // Mock Logic for Roles
        if (phoneNumber === "01010101") {
            // President: Has President, Deputy, and Citizen roles
            mockUser = { ...mockUser, name: 'Michel Régis Onanga Ndiaye', roles: ['president', 'deputy', 'citizen'] };
        } else if (phoneNumber === "02020202") {
            // VP: Has VP, Deputy, and Citizen roles
            mockUser = { ...mockUser, name: 'François Ndong Obiang', roles: ['vp', 'deputy', 'citizen'] };
        } else if (phoneNumber === "03030303") {
            // Substitute: Has Substitute and Citizen roles
            mockUser = { ...mockUser, name: 'M. Suppléant', roles: ['substitute', 'citizen'] };
        } else if (phoneNumber === "04040401") {
            // Questeur Budget
            mockUser = { ...mockUser, name: 'Questeur Budget', roles: ['questeur_budget', 'citizen'] };
        } else if (phoneNumber === "04040402") {
            // Questeur Ressources
            mockUser = { ...mockUser, name: 'Questeur Ressources', roles: ['questeur_resources', 'citizen'] };
        } else if (phoneNumber === "04040403") {
            // Questeur Services
            mockUser = { ...mockUser, name: 'Questeur Services', roles: ['questeur_services', 'citizen'] };
        } else if (phoneNumber === "04040404") {
            // Questeur General (Admin) - Access to all
            mockUser = { ...mockUser, name: 'M. Questeur Général', roles: ['questeur', 'citizen'] };
        } else if (phoneNumber === "05050505") {
            // Secretary: Admin role
            mockUser = { ...mockUser, name: 'M. Secrétaire', roles: ['secretary', 'citizen'] };
        } else if (phoneNumber === "admin00") {
            // System Admin / Super Admin
            mockUser = { ...mockUser, name: 'Administrateur Système', roles: ['system_admin'] };
        } else if (phoneNumber === "admin01") {
            // Admin AN
            mockUser = { ...mockUser, name: 'Administrateur AN', roles: ['admin_an'] };
        } else if (phoneNumber === "admin02") {
            // Admin Sénat
            mockUser = { ...mockUser, name: 'Administrateur Sénat', roles: ['admin_senat'] };
        } else if (phoneNumber === "admin03") {
            // Admin Parlement
            mockUser = { ...mockUser, name: 'Administrateur Parlement', roles: ['admin_parlement'] };
        } else if (accountType === 'parlement') {
            // Standard Deputy
            mockUser = { ...mockUser, name: 'Honorable Député', roles: ['deputy', 'citizen'] };
        }

        setUser(mockUser);
        sessionStorage.setItem('user_data', JSON.stringify(mockUser));

        // Redirection Logic
        if (mockUser.roles.length > 1) {
            navigate('/portail');
        } else {
            // Direct navigation to avoid race condition with state
            const role = mockUser.roles[0];
            setCurrentRole(role);
            sessionStorage.setItem('current_role', role);
            navigateToRole(role);
        }
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

        setUser(null);
        setCurrentRole(null);
        sessionStorage.removeItem('user_data');
        sessionStorage.removeItem('current_role');
        sessionStorage.removeItem('is_demo'); // Clear demo flag

        navigate(redirectPath);
    };

    const switchRole = (role: UserRole) => {
        if (user && user.roles.includes(role)) {
            setCurrentRole(role);
            sessionStorage.setItem('current_role', role);
            navigateToRole(role);
        }
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
