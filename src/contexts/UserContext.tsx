import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNerve } from '@/hooks/useNerve';
import { UserRole, User } from '@/neocortex/actors/PrefrontalActor'; // Import types from Actor

// Re-export types for compatibility
export type { UserRole, User };

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

    // Local state for React Reactivity (Synced with Cortex)
    const [user, setUser] = useState<User | null>(null);
    const [currentRole, setCurrentRole] = useState<UserRole | null>(null);

    // ========================================================
    // NEOCORTEX INTEGRATION (System Nervous System)
    // ========================================================

    // 1. Sensation: Listen to Identity State Changes
    useNerve('IDENTITY:STATE_CHANGED', (payload) => {
        console.log('🧠 [UserContext] Synced with Prefrontal Cortex', payload);
        setUser(payload.currentUser);
        setCurrentRole(payload.currentRole);
    });

    // 2. Sensation: Listen for Navigation Decisions
    useNerve('IDENTITY:LOGIN_SUCCESS', (payload) => {
        navigateToRole(payload.role);
    });

    useNerve('IDENTITY:LOGOUT_SUCCESS', () => {
        console.log('🧠 [UserContext] Logout Confirmed - Redirecting');
        // Force hard redirect to clear any lingering React state/cache
        window.location.href = '/';
    });

    useNerve('IDENTITY:ROLE_SWITCHED', (payload) => {
        navigateToRole(payload.role);
    });

    // 3. Stimulation: Actions dispatch signals
    const { stimulate } = useNerve();

    const login = useCallback((phoneNumber: string, accountType: string) => {
        stimulate('IDENTITY:LOGIN_INTENT', { phoneNumber, accountType });
    }, [stimulate]);

    const logout = useCallback(() => {
        console.log('🧠 [UserContext] Stimulating LOGOUT_INTENT');
        stimulate('IDENTITY:LOGOUT_INTENT', {});

        // REFLEX FAIL-SAFE:
        // Si le cortex ne répond pas sous 100ms, on force la déconnexion par voie réflexe (moelle épinière)
        setTimeout(() => {
            console.warn('⚡ [Reflex] Logout Fallback triggered');
            sessionStorage.clear();
            window.location.href = '/';
        }, 100);
    }, [stimulate]);

    const switchRole = useCallback((role: UserRole) => {
        stimulate('IDENTITY:SWITCH_ROLE_INTENT', { role });
    }, [stimulate]);

    // ========================================================
    // LEGACY COMPATIBILITY (Navigation Logic)
    // We keep navigation here for now as "Motor Output" of the Cortex
    // ========================================================

    // Initial Hydration (Fallback if Actor hasn't fired yet)
    useEffect(() => {
        const storedUser = sessionStorage.getItem('user_data');
        const storedRole = sessionStorage.getItem('current_role');
        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedRole) setCurrentRole(storedRole as UserRole);
    }, []);

    const navigateToRole = (role: UserRole) => {
        // Reads current state from Actor Sync (or fallback to local)
        // ... (Original switch case logic preserved)
        // Note: We use the local 'user' state which should be synced
        const userRoles = user?.roles || [];

        switch (role) {
            case 'president':
                navigate(userRoles.includes('senator') ? '/senat/espace/president' : '/president');
                break;
            case 'president_senate': navigate('/senat/espace/president'); break;
            case 'vp':
                navigate(userRoles.includes('senator') ? '/senat/espace/vp' : '/vp');
                break;
            case 'vp_senate': navigate('/senat/espace/vp'); break;
            case 'deputy': navigate('/vote'); break;
            case 'senator': navigate('/senat/espace/senateur'); break;
            case 'substitute': navigate('/suppleant'); break;
            case 'questeur':
            case 'questeur_budget':
            case 'questeur_resources':
            case 'questeur_services':
                navigate(userRoles.includes('senator') ? '/senat/espace/questeur' : '/questeurs');
                break;
            case 'questeur_senate': navigate('/senat/espace/questeur'); break;
            case 'secretary':
                navigate(userRoles.includes('senator') ? '/senat/espace' : '/secretaires');
                break;
            case 'secretary_senate': navigate('/senat/espace/secretary'); break;
            case 'citizen': navigate('/citizen'); break;
            case 'system_admin': navigate('/admin/dashboard'); break;
            case 'admin_an': navigate('/an/admin'); break;
            case 'admin_senat': navigate('/senat/admin'); break;
            case 'admin_parlement': navigate('/parlement/admin'); break;
            case 'president_congress': navigate('/parlement/espace/president'); break;
            case 'deputy_congress': navigate('/parlement/congres'); break;
            case 'senator_congress': navigate('/parlement/congres'); break;
            case 'secretary_session': navigate('/parlement/espace/secretaire'); break;
            case 'cmp_member': navigate('/parlement/cmp'); break;
            default: navigate('/');
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
