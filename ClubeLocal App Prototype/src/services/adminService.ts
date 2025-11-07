import api from '../lib/api';

export interface AdminStats {
  users: {
    total: number;
    activeSubscriptions: number;
  };
  companies: {
    total: number;
    active: number;
    pending: number;
  };
  coupons: {
    total: number;
    approved: number;
    pending: number;
    totalUsages: number;
  };
  revenue: {
    monthly: string;
    activeSubscriptions: number;
  };
}

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const response = await api.get<AdminStats>('/admin/stats');
    return response.data;
  },

  async listCompanies(params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await api.get('/admin/companies', { params });
    return response.data;
  },

  async updateCompanyStatus(id: string, status: 'ACTIVE' | 'SUSPENDED') {
    const response = await api.put(`/admin/companies/${id}/status`, { status });
    return response.data;
  },

  async listPendingCoupons(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const response = await api.get('/admin/coupons/pending', { params });
    return response.data;
  },

  async updateCouponStatus(id: string, status: 'APPROVED' | 'REJECTED') {
    const response = await api.put(`/admin/coupons/${id}/status`, { status });
    return response.data;
  },

  async toggleCouponActive(id: string) {
    const response = await api.put(`/admin/coupons/${id}/toggle-active`);
    return response.data;
  },

  async listUsers(params?: {
    role?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },
};

