import api from '../lib/api';

export interface Coupon {
  id: string;
  title: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED' | 'FREEBIE';
  discountValue?: number;
  imageUrl?: string;
  termsConditions?: string;
  validFrom: string;
  validUntil: string;
  maxUsesPerUser: number;
  isActive: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  company: {
    id: string;
    name: string;
    logoUrl?: string;
    city?: string;
  };
  category?: {
    id: string;
    name: string;
    icon?: string;
  };
  usageCount: number;
}

export interface CouponsResponse {
  coupons: Coupon[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CategoriesResponse {
  categories: Array<{
    id: string;
    name: string;
    icon?: string;
    couponCount: number;
  }>;
}

export interface UseCouponResponse {
  message: string;
  code: string;
  couponUsage: {
    id: string;
    code: string;
    coupon: {
      title: string;
      description: string;
      discountType: string;
      discountValue?: number;
      validUntil: string;
    };
    createdAt: string;
  };
  qrCode: string;
}

export const couponService = {
  async listCoupons(params?: {
    category?: string;
    search?: string;
    companyId?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<CouponsResponse> {
    const response = await api.get<CouponsResponse>('/coupons', { params });
    return response.data;
  },

  async getCouponById(id: string): Promise<Coupon> {
    const response = await api.get<Coupon>(`/coupons/${id}`);
    return response.data;
  },

  async getCategories(): Promise<CategoriesResponse> {
    const response = await api.get<CategoriesResponse>('/coupons/categories');
    return response.data;
  },

  async useCoupon(couponId: string): Promise<UseCouponResponse> {
    const response = await api.post<UseCouponResponse>(`/coupons/${couponId}/use`);
    return response.data;
  },

  async createCoupon(data: {
    title: string;
    description: string;
    discountType: 'PERCENTAGE' | 'FIXED' | 'FREEBIE';
    discountValue?: number;
    imageUrl?: string;
    termsConditions?: string;
    validFrom: string;
    validUntil: string;
    maxUsesPerUser?: number;
    totalUsesLimit?: number;
    categoryId?: string;
  }) {
    const response = await api.post('/coupons', data);
    return response.data;
  },

  async updateCoupon(id: string, data: Partial<{
    title: string;
    description: string;
    discountType: 'PERCENTAGE' | 'FIXED' | 'FREEBIE';
    discountValue?: number;
    imageUrl?: string;
    termsConditions?: string;
    validFrom: string;
    validUntil: string;
    maxUsesPerUser?: number;
    totalUsesLimit?: number;
    categoryId?: string;
  }>) {
    const response = await api.put(`/coupons/${id}`, data);
    return response.data;
  },

  async deleteCoupon(id: string) {
    const response = await api.delete(`/coupons/${id}`);
    return response.data;
  },

  async validateCouponCode(data: { code?: string; qrCode?: string }) {
    const response = await api.post('/coupons/validate', data);
    return response.data;
  },
};

