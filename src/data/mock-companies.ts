// Mock companies data

import { Company } from '@/types/company';

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Société Gabonaise de Transport',
    registrationNumber: 'GA-2021-001234',
    type: 'SARL',
    companyType: 'SARL',
    address: '123 Boulevard Triomphal',
    city: 'Libreville',
    phone: '+241 01 23 45 67',
    email: 'contact@sgt.ga',
    status: 'APPROVED',
    createdAt: '2021-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Tech Innovation Gabon',
    registrationNumber: 'GA-2022-005678',
    type: 'SAS',
    companyType: 'SAS',
    address: '45 Avenue de l\'Indépendance',
    city: 'Libreville',
    phone: '+241 01 98 76 54',
    email: 'info@techinnovation.ga',
    status: 'APPROVED',
    createdAt: '2022-03-20T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z'
  }
];

// Legacy export for backward compatibility
export const MOCK_COMPANIES = mockCompanies;
