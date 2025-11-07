import api from '../lib/api';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: 'ADMIN' | 'COMPANY' | 'CUSTOMER';
  createdAt: string;
  subscriptions?: Array<{
    id: string;
    planType: string;
    status: string;
    price: number;
    startDate: string;
    endDate: string;
  }>;
  company?: {
    id: string;
    name: string;
    logoUrl?: string;
    status: string;
  };
  stats: {
    couponsUsed: number;
    favoritesCount: number;
    totalSavings: string;
  };
}

export interface Favorite {
  id: string;
  title: string;
  description: string;
  discountType: string;
  discountValue?: number;
  imageUrl?: string;
  validUntil: string;
  company: {
    id: string;
    name: string;
    logoUrl?: string;
  };
  category?: {
    id: string;
    name: string;
    icon?: string;
  };
}

export interface ActiveCoupon {
  id: string;
  code: string;
  createdAt: string;
  qrCode: string;
  coupon: {
    id: string;
    title: string;
    description: string;
    discountType: string;
    discountValue?: number;
    imageUrl?: string;
    validUntil: string;
    validFrom: string;
    company: {
      id: string;
      name: string;
      logoUrl?: string;
      address?: string;
      city?: string;
      phone?: string;
    };
    category?: {
      id: string;
      name: string;
      icon?: string;
    };
  };
}

export interface CouponHistoryItem {
  id: string;
  code: string;
  usedAt: string;
  coupon: {
    id: string;
    title: string;
    description: string;
    discountType: string;
    discountValue?: number;
    company: {
      id: string;
      name: string;
      logoUrl?: string;
    };
    category?: {
      id: string;
      name: string;
      icon?: string;
    };
  };
}

export const userService = {
  async getProfile(): Promise<UserProfile> {
    const response = await api.get<UserProfile>('/users/profile');
    return response.data;
  },

  async updateProfile(data: {
    fullName?: string;
    phone?: string;
    avatarUrl?: string;
  }) {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  async getFavorites(): Promise<{ favorites: Favorite[] }> {
    const response = await api.get<{ favorites: Favorite[] }>('/users/favorites');
    return response.data;
  },

  async addFavorite(couponId: string) {
    const response = await api.post('/users/favorites', { couponId });
    return response.data;
  },

  async removeFavorite(couponId: string) {
    const response = await api.delete(`/users/favorites/${couponId}`);
    return response.data;
  },

  async getActiveCoupons(): Promise<{ activeCoupons: ActiveCoupon[]; total: number }> {
    const response = await api.get<{ activeCoupons: ActiveCoupon[]; total: number }>('/users/active-coupons');
    return response.data;
  },

  async getCouponHistory(): Promise<{ history: CouponHistoryItem[]; total: number; totalSavings: string }> {
    const response = await api.get<{ history: CouponHistoryItem[]; total: number; totalSavings: string }>('/users/history');
    return response.data;
  },
};

