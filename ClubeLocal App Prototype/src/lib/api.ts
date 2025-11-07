import axios from 'axios';

// URL base da API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Criar instância do axios
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('clubelocal_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('clubelocal_token');
      localStorage.removeItem('clubelocal_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

