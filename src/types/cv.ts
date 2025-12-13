// CV types

export interface CV {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  summary?: string;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  languages: Language[];
  hobbies?: string[];
  portfolioUrl?: string;
  linkedinUrl?: string;
  createdAt?: string;
  updatedAt: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

export interface Language {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'native';
}
