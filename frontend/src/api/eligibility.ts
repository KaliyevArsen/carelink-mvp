import apiClient from './client';
import {
  EligibilityCheckRequest,
  EligibilityCheckResponse,
  EligibilityHistoryResponse,
} from '../types';

export interface HistoryParams {
  page?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
}

export const eligibilityApi = {
  checkEligibility: async (
    data: EligibilityCheckRequest
  ): Promise<EligibilityCheckResponse> => {
    const response = await apiClient.post<EligibilityCheckResponse>(
      '/eligibility/check',
      data
    );
    return response.data;
  },

  getHistory: async (
    params: HistoryParams = {}
  ): Promise<EligibilityHistoryResponse> => {
    const response = await apiClient.get<EligibilityHistoryResponse>(
      '/eligibility/history',
      { params }
    );
    return response.data;
  },

  getCheckById: async (id: string): Promise<EligibilityCheckResponse> => {
    const response = await apiClient.get<EligibilityCheckResponse>(
      `/eligibility/${id}`
    );
    return response.data;
  },

  getSupportedInsurers: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/eligibility/insurers/list');
    return response.data;
  },
};
