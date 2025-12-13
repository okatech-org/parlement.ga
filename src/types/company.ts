// Company types

export type EntityStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
export type CompanyType = 'SARL' | 'SA' | 'SAS' | 'EI' | 'OTHER';
export type ActivitySector = 'COMMERCE' | 'SERVICES' | 'INDUSTRIE' | 'AGRICULTURE' | 'BTP' | 'TRANSPORT' | 'TECH' | 'SANTE' | 'EDUCATION' | 'OTHER';
export type CompanyRole = 'OWNER' | 'DIRECTOR' | 'MANAGER' | 'EMPLOYEE';

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Company {
  id: string;
  name: string;
  legalName?: string;
  registrationNumber: string;
  companyType?: CompanyType;
  activitySector?: ActivitySector;
  siret?: string;
  type?: 'SARL' | 'SA' | 'SAS' | 'EI' | 'OTHER';
  address: string | Address;
  city?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  shortDescription?: string;
  logoUrl?: string;
  ownerId?: string;
  ownerRole?: CompanyRole;
  status?: EntityStatus;
  validatedAt?: string;
  validatedById?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyContact {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  role: string;
  email?: string;
  phone?: string;
}
