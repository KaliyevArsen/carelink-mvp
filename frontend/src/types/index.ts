// User types
export interface Organization {
  id: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'staff' | 'viewer';
  organization: Organization;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Eligibility types
export interface EligibilityCheckRequest {
  patient_first_name: string;
  patient_last_name: string;
  patient_dob: string;
  insurance_company: string;
  member_id: string;
  group_number?: string;
}

export interface CoverageInfo {
  effective_date?: string;
  termination_date?: string | null;
  plan_name?: string;
  plan_type?: string;
  copay_primary_care?: string;
  copay_specialist?: string;
  copay_urgent_care?: string;
  copay_emergency?: string;
  deductible_individual?: string;
  deductible_family?: string;
  deductible_met?: string;
  out_of_pocket_max?: string;
  out_of_pocket_max_family?: string;
  out_of_pocket_met?: string;
  coinsurance?: string;
}

export interface SubscriberInfo {
  name?: string;
  relationship?: string;
  member_id?: string;
}

export interface EligibilityCheckResponse {
  id: string;
  status: 'active' | 'inactive' | 'error' | 'not_found';
  coverage?: CoverageInfo;
  subscriber?: SubscriberInfo;
  error_message?: string;
  response_time_ms?: number;
  created_at: string;
}

export interface EligibilityHistoryItem {
  id: string;
  patient_first_name: string;
  patient_last_name: string;
  patient_dob: string;
  insurance_company: string;
  member_id: string;
  group_number?: string;
  status: string;
  response_data?: {
    status: string;
    coverage?: CoverageInfo;
    subscriber?: SubscriberInfo;
  };
  error_message?: string;
  response_time_ms?: number;
  created_at: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface EligibilityHistoryResponse {
  data: EligibilityHistoryItem[];
  pagination: PaginationInfo;
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
