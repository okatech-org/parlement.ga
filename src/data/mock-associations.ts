// Mock associations data

import { Association } from '@/types/association';

export const mockAssociations: Association[] = [
  {
    id: '1',
    name: 'Association des Jeunes du Gabon',
    registrationNumber: 'AJG-2020-001',
    type: 'ASSOCIATION',
    associationType: 'ASSOCIATION',
    address: '78 Rue des Palmiers',
    city: 'Libreville',
    phone: '+241 06 12 34 56',
    email: 'contact@ajg.ga',
    president: 'Jean-Pierre Mba',
    status: 'APPROVED',
    createdAt: '2020-05-10T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    id: '2',
    name: 'ONG Environnement Plus',
    registrationNumber: 'ENV-2019-023',
    type: 'ONG',
    associationType: 'ONG',
    address: '12 Avenue de la Forêt',
    city: 'Port-Gentil',
    phone: '+241 07 65 43 21',
    email: 'info@environnementplus.ga',
    president: 'Marie Nzue',
    status: 'APPROVED',
    createdAt: '2019-09-15T00:00:00Z',
    updatedAt: '2023-12-20T00:00:00Z'
  }
];

// Legacy export for backward compatibility
export const MOCK_ASSOCIATIONS = mockAssociations;
