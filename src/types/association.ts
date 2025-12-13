// Association types

import { EntityStatus, Address } from './company';

export type AssociationType = 'ONG' | 'ASSOCIATION' | 'FONDATION' | 'SYNDICAT' | 'COOPERATIVE' | 'OTHER';
export type AssociationRole = 'PRESIDENT' | 'SECRETARY' | 'TREASURER' | 'MEMBER';

export interface Association {
  id: string;
  name: string;
  legalName?: string;
  registrationNumber: string;
  type?: 'ONG' | 'ASSOCIATION' | 'FONDATION' | 'OTHER';
  associationType?: AssociationType;
  address: string | Address;
  city?: string;
  phone?: string;
  email?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  description?: string;
  shortDescription?: string;
  objectives?: string;
  memberCount?: number;
  foundingYear?: number;
  logoUrl?: string;
  president?: string;
  ownerId?: string;
  ownerRole?: AssociationRole;
  status?: EntityStatus;
  creationDate?: string;
  validatedAt?: string;
  validatedById?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}
