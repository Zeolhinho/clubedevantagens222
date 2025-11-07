import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { userService } from '../services/userService';
import { toast } from 'sonner';

interface FavoritesContextType {
  favorites: Set<string>; // IDs dos cupons favoritados
  toggleFavorite: (couponId: string) => void;
  isFavorite: (couponId: string) => boolean;
  clearFavorites: () => void;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Carregar favoritos da API quando autenticado
  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    } else {
      // Se não autenticado, usar localStorage
      const savedFavorites = localStorage.getItem('clubelocal_favorites');
      if (savedFavorites) {
        try {
          const favArray = JSON.parse(savedFavorites);
          setFavorites(new Set(favArray));
        } catch (error) {
          console.error('Erro ao carregar favoritos:', error);
          localStorage.removeItem('clubelocal_favorites');
        }
      }
    }
  }, [isAuthenticated]);

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      const response = await userService.getFavorites();
      // Mapear IDs dos cupons favoritados
      const couponIds = new Set(response.favorites.map(f => f.id));
      setFavorites(couponIds);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Salvar favoritos no localStorage quando mudar (apenas se não autenticado)
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('clubelocal_favorites', JSON.stringify(Array.from(favorites)));
    }
  }, [favorites, isAuthenticated]);

  const toggleFavorite = async (couponId: string) => {
    if (!isAuthenticated) {
      // Modo offline: apenas atualizar estado local
      setFavorites(prev => {
        const newFavorites = new Set(prev);
        if (newFavorites.has(couponId)) {
          newFavorites.delete(couponId);
        } else {
          newFavorites.add(couponId);
        }
        return newFavorites;
      });
      return;
    }

    // Modo online: usar API
    try {
      const isCurrentlyFavorite = favorites.has(couponId);
      
      if (isCurrentlyFavorite) {
        // Remover cupom dos favoritos
        await userService.removeFavorite(couponId);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(couponId);
          return newSet;
        });
        toast.info('Removido dos favoritos');
      } else {
        // Adicionar cupom aos favoritos
        await userService.addFavorite(couponId);
        setFavorites(prev => new Set(prev).add(couponId));
        toast.success('Adicionado aos favoritos! ❤️');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao atualizar favoritos';
      toast.error(errorMessage);
    }
  };

  const isFavorite = (couponId: string): boolean => {
    return favorites.has(couponId);
  };

  const clearFavorites = () => {
    setFavorites(new Set());
    localStorage.removeItem('clubelocal_favorites');
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      toggleFavorite,
      isFavorite,
      clearFavorites,
      isLoading,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider');
  }
  return context;
}

