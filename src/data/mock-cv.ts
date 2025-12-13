// Mock CV data

import { CV } from '@/types/cv';

export const mockCVs: CV[] = [
  {
    id: '1',
    userId: 'user-1',
    firstName: 'Jean',
    lastName: 'Obame',
    email: 'jean.obame@email.ga',
    phone: '+241 06 12 34 56',
    address: 'Libreville, Gabon',
    summary: 'Professionnel expérimenté dans le domaine administratif',
    experiences: [
      {
        id: 'exp-1',
        company: 'Ministère des Finances',
        position: 'Analyste financier',
        startDate: '2020-01-01',
        current: true,
        description: 'Analyse des budgets et rapports financiers'
      }
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'Université Omar Bongo',
        degree: 'Master',
        field: 'Économie',
        startDate: '2015-09-01',
        endDate: '2018-06-30',
        current: false
      }
    ],
    skills: ['Excel', 'Analyse financière', 'Gestion de projet'],
    languages: [
      { name: 'Français', level: 'native' },
      { name: 'Anglais', level: 'intermediate' }
    ],
    updatedAt: '2024-01-10T00:00:00Z'
  }
];

// Legacy single CV export for backward compatibility
export const MOCK_CV: CV = mockCVs[0];
