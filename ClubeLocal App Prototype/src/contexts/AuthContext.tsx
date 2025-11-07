import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, AuthResponse } from '../services/authService';
import { toast } from 'sonner';

export type UserRole = 'guest' | 'user' | 'business' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  subscriptionStatus?: 'active' | 'cancelled' | 'expired';
  subscriptionEndDate?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Converter role do backend para role do frontend
function mapRole(role: string): UserRole {
  if (role === 'ADMIN') return 'admin';
  if (role === 'COMPANY') return 'business';
  return 'user';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('clubelocal_user');
    const token = localStorage.getItem('clubelocal_token');
    
    if (savedUser && token) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        
        // Verificar se token ainda é válido fazendo uma requisição
        // Por enquanto, apenas carregar do localStorage
        // Em produção, você pode fazer uma chamada para /users/profile
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        localStorage.removeItem('clubelocal_user');
        localStorage.removeItem('clubelocal_token');
      }
    }
    setIsLoading(false);
  }, []);

  // Salvar usuário no localStorage quando mudar
  useEffect(() => {
    if (user) {
      localStorage.setItem('clubelocal_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('clubelocal_user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response: AuthResponse = await authService.login({ email, password });
      
      const newUser: User = {
        id: response.user.id,
        name: response.user.fullName,
        email: response.user.email,
        role: mapRole(response.user.role),
        avatarUrl: response.user.avatarUrl,
        subscriptionStatus: 'active', // Será atualizado quando buscar perfil
      };

      setUser(newUser);
      toast.success('Login realizado com sucesso!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao fazer login';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response: AuthResponse = await authService.signup({ 
        fullName: name, 
        email, 
        password 
      });
      
      const newUser: User = {
        id: response.user.id,
        name: response.user.fullName,
        email: response.user.email,
        role: mapRole(response.user.role),
        avatarUrl: response.user.avatarUrl,
        subscriptionStatus: 'active',
      };

      setUser(newUser);
      toast.success('Conta criada com sucesso! Bem-vindo(a)!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao criar conta';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    localStorage.removeItem('clubelocal_favorites');
    toast.info('Logout realizado');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      signup,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

