// Mock document service types (tables don't exist in Supabase yet)

export type DocumentStatus = 'pending' | 'approved' | 'rejected' | 'archived';

export interface Document {
  id: string;
  user_id: string;
  name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  category?: string;
  tags?: string[];
  status?: DocumentStatus;
  created_at: string;
  updated_at: string;
}

export interface DocumentAnalysis {
  documentType: string;
  confidence: number;
  extractedData?: Record<string, any>;
  uncertainFields?: string[];
  error?: string;
}

export type DocumentType = 
  | 'id_card'
  | 'ID_CARD'
  | 'passport'
  | 'PASSPORT'
  | 'birth_certificate'
  | 'BIRTH_CERTIFICATE'
  | 'marriage_certificate'
  | 'MARRIAGE_CERTIFICATE'
  | 'residence_certificate'
  | 'RESIDENCE_CERTIFICATE'
  | 'RESIDENCE_PERMIT'
  | 'RESIDENCE_PROOF'
  | 'PHOTO'
  | 'invoice'
  | 'INVOICE'
  | 'contract'
  | 'CONTRACT'
  | 'OTHER'
  | 'unknown';
