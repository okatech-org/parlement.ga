// Environment types

export interface UserEnvironment {
  id: string;
  user_id: string;
  role: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface EnvironmentConfig {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
}

// IBoite types
export type ConversationType = 'internal' | 'external' | 'group' | 'broadcast' | 'PRIVATE' | 'GROUP';

export interface IBoiteParticipant {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  role?: string;
  department?: string;
}

export interface IBoiteAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface IBoiteMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  attachments?: IBoiteAttachment[];
  read: boolean;
  created_at: string;
}

export interface IBoiteConversation {
  id: string;
  type: ConversationType;
  subject: string;
  participants: IBoiteParticipant[];
  last_message?: IBoiteMessage;
  unread_count: number;
  is_starred: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface IBoiteContact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  department?: string;
  organization?: string;
  avatar?: string;
}

export interface IBoiteUserSearchResult {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  department?: string;
}

export interface IBoiteServiceSearchResult {
  id: string;
  name: string;
  description?: string;
  category?: string;
}

export interface IBoiteExternalCorrespondence {
  id: string;
  recipient_name: string;
  recipient_organization: string;
  recipient_email?: string;
  subject: string;
  content: string;
  attachments?: IBoiteAttachment[];
  status: 'draft' | 'sent' | 'delivered' | 'read';
  created_at: string;
  sent_at?: string;
}

export interface IBoiteService {
  getConversations(): Promise<IBoiteConversation[]>;
  getConversation(id: string): Promise<IBoiteConversation | null>;
  sendMessage(conversationId: string, content: string, attachments?: File[]): Promise<IBoiteMessage>;
  createConversation(participants: string[], subject: string, initialMessage?: string): Promise<IBoiteConversation>;
  searchUsers(query: string): Promise<IBoiteUserSearchResult[]>;
  searchServices(query: string): Promise<IBoiteServiceSearchResult[]>;
  getContacts(): Promise<IBoiteContact[]>;
}

// Recipient types for iBoite search
export type RecipientType = 'USER' | 'ORGANIZATION' | 'SERVICE' | 'EXTERNAL';

export interface GlobalRecipient {
  recipientType: RecipientType;
  recipientId: string;
  displayName: string;
  subtitle?: string;
  email?: string;
  avatarUrl?: string;
  organizationId?: string;
  organizationName?: string;
}

export interface OrganizationRecipient {
  id: string;
  name: string;
  city?: string;
  departement?: string;
  contactEmail?: string;
  logoUrl?: string;
}

export interface ServiceRecipient {
  id: string;
  name: string;
  category?: string;
  organizationId?: string;
  organizationName?: string;
}

// Contact directory entry for advanced contact search
export interface ContactDirectoryEntry {
  userId: string;
  profileId: string;
  displayName: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  position?: string | null;
  servicePhone?: string | null;
  isPublicContact: boolean;
  environment?: string;
  role?: string;
  organizationId?: string | null;
  organizationName?: string | null;
  services?: Array<{ id: string; name: string }>;
}

// Service member for service-based messaging
export interface ServiceMember {
  id: string;
  serviceId: string;
  userId: string;
  memberRole: 'LEADER' | 'MEMBER' | 'BACKUP';
  canReceiveCorrespondence: boolean;
  canReceiveCalls: boolean;
  displayOrder: number;
  joinedAt: string;
  user: {
    displayName: string;
    phone?: string | null;
    position?: string | null;
  };
}
