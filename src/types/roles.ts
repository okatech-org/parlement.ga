// Role types for authentication

export type UserRole = 
  | 'citizen'
  | 'admin'
  | 'super_admin'
  | 'maire'
  | 'maire_adjoint'
  | 'secretaire_general'
  | 'chef_service'
  | 'agent'
  | 'president'
  | 'vice_president'
  | 'questeur'
  | 'secretary'
  | 'deputy'
  | 'substitute';

export interface RoleConfig {
  name: string;
  displayName: string;
  permissions: string[];
}

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  avatar?: string;
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  citizen: { name: 'citizen', displayName: 'Citoyen', permissions: ['read'] },
  admin: { name: 'admin', displayName: 'Administrateur', permissions: ['read', 'write', 'manage'] },
  super_admin: { name: 'super_admin', displayName: 'Super Admin', permissions: ['read', 'write', 'manage', 'admin'] },
  maire: { name: 'maire', displayName: 'Maire', permissions: ['read', 'write', 'manage', 'approve'] },
  maire_adjoint: { name: 'maire_adjoint', displayName: 'Maire Adjoint', permissions: ['read', 'write', 'manage'] },
  secretaire_general: { name: 'secretaire_general', displayName: 'Secrétaire Général', permissions: ['read', 'write', 'manage'] },
  chef_service: { name: 'chef_service', displayName: 'Chef de Service', permissions: ['read', 'write'] },
  agent: { name: 'agent', displayName: 'Agent', permissions: ['read', 'write'] },
  president: { name: 'president', displayName: 'Président', permissions: ['read', 'write', 'manage', 'approve'] },
  vice_president: { name: 'vice_president', displayName: 'Vice-Président', permissions: ['read', 'write', 'manage'] },
  questeur: { name: 'questeur', displayName: 'Questeur', permissions: ['read', 'write', 'manage'] },
  secretary: { name: 'secretary', displayName: 'Secrétaire', permissions: ['read', 'write'] },
  deputy: { name: 'deputy', displayName: 'Député', permissions: ['read', 'write'] },
  substitute: { name: 'substitute', displayName: 'Suppléant', permissions: ['read'] },
};
