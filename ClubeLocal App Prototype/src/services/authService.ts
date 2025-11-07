import api from '../lib/api';

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: 'ADMIN' | 'COMPANY' | 'CUSTOMER';
    phone?: string;
    avatarUrl?: string;
  };
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    // Salvar token
    localStorage.setItem('clubelocal_token', response.data.token);
    return response.data;
  },

  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/signup', data);
    // Salvar token
    localStorage.setItem('clubelocal_token', response.data.token);
    return response.data;
  },

  logout() {
    localStorage.removeItem('clubelocal_token');
    localStorage.removeItem('clubelocal_user');
  },

  getToken(): string | null {
    return localStorage.getItem('clubelocal_token');
  },
};

