import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Gift, Bell, User, Home, Star, History, Search, Heart, MapPin, Calendar } from 'lucide-react';
import { CouponCard } from './CouponCard';
import { CouponModal } from './CouponModal';
import { mockCoupons, Coupon } from '../data/mockData';

interface UserDashboardProps {
  onLogout: () => void;
}

export function UserDashboard({ onLogout }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'favorites' | 'history' | 'profile'>('home');
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (couponId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(couponId)) {
        newFavorites.delete(couponId);
      } else {
        newFavorites.add(couponId);
      }
      return newFavorites;
    });
  };

  const filteredCoupons = mockCoupons.filter(coupon => {
    const matchesSearch = coupon.business.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         coupon.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorites = activeTab === 'favorites' ? favorites.has(coupon.id) : true;
    return matchesSearch && matchesFavorites;
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            {/* Subscription Status */}
            <div className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 border border-blue-700/50 rounded-xl p-6 backdrop-blur">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-green-400">Assinatura ativa</span>
                  </div>
                  <p className="text-slate-300">Válida até 06/12/2025</p>
                </div>
                <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800">
                  Gerenciar
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Buscar cupons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 cursor-pointer hover:bg-blue-500/30">
                Todos
              </Badge>
              <Badge variant="outline" className="border-slate-600 text-slate-300 cursor-pointer hover:bg-slate-800">
                Alimentação
              </Badge>
              <Badge variant="outline" className="border-slate-600 text-slate-300 cursor-pointer hover:bg-slate-800">
                Beleza
              </Badge>
              <Badge variant="outline" className="border-slate-600 text-slate-300 cursor-pointer hover:bg-slate-800">
                Serviços
              </Badge>
              <Badge variant="outline" className="border-slate-600 text-slate-300 cursor-pointer hover:bg-slate-800">
                Lazer
              </Badge>
            </div>

            {/* Coupons Grid */}
            <div className="grid md:grid-cols-2 gap-4 pb-20">
              {filteredCoupons.map((coupon) => (
                <CouponCard
                  key={coupon.id}
                  coupon={coupon}
                  isFavorite={favorites.has(coupon.id)}
                  onToggleFavorite={toggleFavorite}
                  onUseCoupon={setSelectedCoupon}
                />
              ))}
            </div>
          </div>
        );

      case 'favorites':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl text-white">Meus Favoritos</h2>
            {favorites.size === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Você ainda não favoritou nenhum cupom</p>
                <Button 
                  className="mt-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                  onClick={() => setActiveTab('home')}
                >
                  Explorar Cupons
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4 pb-20">
                {filteredCoupons.map((coupon) => (
                  <CouponCard
                    key={coupon.id}
                    coupon={coupon}
                    isFavorite={favorites.has(coupon.id)}
                    onToggleFavorite={toggleFavorite}
                    onUseCoupon={setSelectedCoupon}
                  />
                ))}
              </div>
            )}
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl text-white">Histórico de Uso</h2>
            <div className="space-y-3 pb-20">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Gift className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white">Restaurante Sabor Local</h3>
                        <p className="text-slate-400">20% de desconto</p>
                        <div className="flex items-center gap-2 mt-1 text-slate-500">
                          <Calendar className="w-4 h-4" />
                          <span>Usado em 01/11/2025</span>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Usado
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6 pb-20">
            <h2 className="text-2xl text-white">Meu Perfil</h2>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-xl text-white">João Silva</h3>
                  <p className="text-slate-400">joao@email.com</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="border-t border-slate-700 pt-4">
                  <h4 className="text-white mb-2">Assinatura</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Plano Mensal</span>
                    <span className="text-amber-400">R$ 29,90/mês</span>
                  </div>
                </div>
                <div className="border-t border-slate-700 pt-4">
                  <h4 className="text-white mb-2">Estatísticas</h4>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <div className="text-center">
                      <div className="text-2xl text-white">12</div>
                      <div className="text-slate-400">Cupons usados</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl text-white">R$ 450</div>
                      <div className="text-slate-400">Economia total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl text-white">{favorites.size}</div>
                      <div className="text-slate-400">Favoritos</div>
                    </div>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-6 border-red-500/50 text-red-400 hover:bg-red-500/10"
                onClick={onLogout}
              >
                Sair da conta
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-4xl">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xl">ClubeLocal</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
              <Bell className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-slate-300 hover:text-white"
              onClick={() => setActiveTab('profile')}
            >
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center py-3 transition-colors ${
                activeTab === 'home' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <Home className="w-6 h-6 mb-1" />
              <span className="text-xs">Início</span>
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex flex-col items-center py-3 transition-colors ${
                activeTab === 'favorites' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <Star className="w-6 h-6 mb-1" />
              <span className="text-xs">Favoritos</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex flex-col items-center py-3 transition-colors ${
                activeTab === 'history' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <History className="w-6 h-6 mb-1" />
              <span className="text-xs">Histórico</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center py-3 transition-colors ${
                activeTab === 'profile' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <User className="w-6 h-6 mb-1" />
              <span className="text-xs">Perfil</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Coupon Modal */}
      {selectedCoupon && (
        <CouponModal
          coupon={selectedCoupon}
          onClose={() => setSelectedCoupon(null)}
        />
      )}
    </div>
  );
}
