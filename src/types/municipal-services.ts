// Municipal services types

export interface MunicipalService {
  id: string;
  name: string;
  description?: string;
  category: string;
  price?: number;
  currency?: string;
  requiredDocuments?: string[];
  processingDays?: number;
  isAvailable?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  services?: MunicipalService[];
}

export interface ServiceRequest {
  id: string;
  service_id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  documents?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}
