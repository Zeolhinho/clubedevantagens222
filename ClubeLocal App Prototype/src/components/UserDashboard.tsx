import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Gift, Bell, User, Home, Star, History, Search, Heart, Calendar } from 'lucide-react';
import { CouponCard } from './CouponCard';
import { CouponModal } from './CouponModal';
import { Coupon } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useDebounce } from '../hooks/useDebounce';
import { couponService } from '../services/couponService';
import { adaptCoupon } from '../utils/couponAdapter';
import { CouponCardSkeleton } from './CouponCardSkeleton';
import { userService } from '../services/userService';
import { toast } from 'sonner';

export function UserDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  
  const [activeTab, setActiveTab] = useState<'home' | 'favorites' | 'active' | 'history' | 'profile'>('home');
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeCoupons, setActiveCoupons] = useState<any[]>([]);
  const [isLoadingActive, setIsLoadingActive] = useState(false);
  const [couponHistory, setCouponHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [totalSavings, setTotalSavings] = useState<string>('0.00');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Debounce da busca para melhor performance
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Buscar cupons da API
  useEffect(() => {
    // Se categoria for 'all', pode carregar imediatamente
    // Se for uma categoria específica, esperar categorias carregarem
    if (selectedCategory === 'all' || categories.length > 0) {
      loadCoupons();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, selectedCategory, currentPage]);

  // Buscar categorias
  useEffect(() => {
    loadCategories();
  }, []);

  // Buscar cupons ativos quando abrir aba
  useEffect(() => {
    if (activeTab === 'active') {
      loadActiveCoupons();
    }
  }, [activeTab]);

  // Buscar histórico quando abrir aba de histórico
  useEffect(() => {
    if (activeTab === 'history' && couponHistory.length === 0) {
      loadHistory();
    }
  }, [activeTab]);

  // Buscar perfil quando abrir aba de perfil
  useEffect(() => {
    if (activeTab === 'profile' && !userProfile) {
      loadProfile();
    }
  }, [activeTab]);

  const loadCategories = async () => {
    try {
      const response = await couponService.getCategories();
      setCategories(response.categories);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const loadCoupons = async () => {
    if (currentPage === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const params: any = {
        page: currentPage,
        limit: 12,
      };

      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      if (selectedCategory !== 'all') {
        // Encontrar categoria pelo nome
        const category = categories.find(c => c.name === selectedCategory);
        if (category) {
          params.category = category.name;
        }
      }

      const response = await couponService.listCoupons(params);
      
      const adaptedCoupons = response.coupons.map(adaptCoupon);
      
      if (currentPage === 1) {
        setCoupons(adaptedCoupons);
      } else {
        setCoupons(prev => [...prev, ...adaptedCoupons]);
      }

      setHasMore(response.pagination.page < response.pagination.totalPages);
    } catch (error: any) {
      console.error('Erro ao carregar cupons:', error);
      toast.error(error.response?.data?.error || 'Erro ao carregar cupons');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Resetar página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
  }, [debouncedSearch, selectedCategory]);

  // Filtrar cupons por favoritos quando na aba de favoritos
  const filteredCoupons = useMemo(() => {
    if (activeTab === 'favorites') {
      return coupons.filter(coupon => {
        // Considerar favorito se o cupom está favoritado
        return favorites.has(coupon.id);
      });
    }
    return coupons;
  }, [coupons, activeTab, favorites]);

  const loadActiveCoupons = async () => {
    setIsLoadingActive(true);
    try {
      const response = await userService.getActiveCoupons();
      setActiveCoupons(response.activeCoupons);
    } catch (error: any) {
      console.error('Erro ao carregar cupons ativos:', error);
      toast.error(error.response?.data?.error || 'Erro ao carregar cupons ativos');
    } finally {
      setIsLoadingActive(false);
    }
  };

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await userService.getCouponHistory();
      setCouponHistory(response.history);
      setTotalSavings(response.totalSavings || '0.00');
    } catch (error: any) {
      console.error('Erro ao carregar histórico:', error);
      toast.error(error.response?.data?.error || 'Erro ao carregar histórico');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const loadProfile = async () => {
    setIsLoadingProfile(true);
    try {
      const profile = await userService.getProfile();
      setUserProfile(profile);
    } catch (error: any) {
      console.error('Erro ao carregar perfil:', error);
      toast.error(error.response?.data?.error || 'Erro ao carregar perfil');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
                    <div className={`w-2 h-2 rounded-full ${user?.subscriptionStatus === 'active' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className={user?.subscriptionStatus === 'active' ? 'text-green-400' : 'text-red-400'}>
                      {user?.subscriptionStatus === 'active' ? 'Assinatura ativa' : 'Assinatura inativa'}
                    </span>
                  </div>
                  <p className="text-slate-300">
                    {user?.subscriptionEndDate ? `Válida até ${user.subscriptionEndDate}` : 'Assine para acessar cupons'}
                  </p>
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
              <Badge
                variant={selectedCategory === 'all' ? 'secondary' : 'outline'}
                className={
                  selectedCategory === 'all'
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/30 cursor-pointer hover:bg-blue-500/30'
                    : 'border-slate-600 text-slate-300 cursor-pointer hover:bg-slate-800'
                }
                onClick={() => setSelectedCategory('all')}
              >
                Todos
              </Badge>
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant={selectedCategory === category.name ? 'secondary' : 'outline'}
                  className={
                    selectedCategory === category.name
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/30 cursor-pointer hover:bg-blue-500/30'
                      : 'border-slate-600 text-slate-300 cursor-pointer hover:bg-slate-800'
                  }
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
                </Badge>
              ))}
            </div>

            {/* Coupons Grid */}
            <div className="grid md:grid-cols-2 gap-4 pb-20">
              {isLoading ? (
                <>
                  <CouponCardSkeleton />
                  <CouponCardSkeleton />
                  <CouponCardSkeleton />
                  <CouponCardSkeleton />
                </>
              ) : filteredCoupons.length > 0 ? (
                <>
                  {filteredCoupons.map((coupon) => {
                    // Verificar se está favoritado (favoritos são por cupom individual)
                    const isFavorite = favorites.has(coupon.id);
                    
                    return (
                      <CouponCard
                        key={coupon.id}
                        coupon={coupon}
                        isFavorite={isFavorite}
                        onToggleFavorite={toggleFavorite}
                        onUseCoupon={setSelectedCoupon}
                      />
                    );
                  })}
                  {hasMore && !isLoadingMore && (
                    <div className="col-span-2 flex justify-center mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => prev + 1)}
                      >
                        Carregar mais
                      </Button>
                    </div>
                  )}
                  {isLoadingMore && (
                    <>
                      <CouponCardSkeleton />
                      <CouponCardSkeleton />
                    </>
                  )}
                </>
              ) : (
                <div className="col-span-2 text-center py-12">
                  <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Nenhum cupom encontrado</p>
                  <Button 
                    className="mt-4"
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                  >
                    Limpar filtros
                  </Button>
                </div>
              )}
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
                {filteredCoupons.map((coupon) => {
                  // Verificar se está favoritado (favoritos são por cupom individual)
                  const isFavorite = favorites.has(coupon.id);
                  
                  return (
                    <CouponCard
                      key={coupon.id}
                      coupon={coupon}
                      isFavorite={isFavorite}
                      onToggleFavorite={toggleFavorite}
                      onUseCoupon={setSelectedCoupon}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );

      case 'active':
        return (
          <div className="space-y-6 pb-20">
            <h2 className="text-2xl text-white">Meus Cupons Ativos</h2>
            <p className="text-slate-400">Cupons que você ativou e ainda não foram validados pela empresa</p>
            {isLoadingActive ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 animate-pulse">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 bg-slate-700 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-slate-700 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-slate-700 rounded w-full mb-2"></div>
                        <div className="h-3 bg-slate-700 rounded w-24"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : activeCoupons.length === 0 ? (
              <div className="text-center py-12">
                <Gift className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">Você não tem cupons ativos no momento</p>
                <Button
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                  onClick={() => setActiveTab('home')}
                >
                  Explorar Cupons
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeCoupons.map((item) => {
                  const validUntil = new Date(item.coupon.validUntil).toLocaleDateString('pt-BR');
                  
                  let discountText = '';
                  if (item.coupon.discountType === 'PERCENTAGE') {
                    discountText = `${item.coupon.discountValue}% OFF`;
                  } else if (item.coupon.discountType === 'FIXED') {
                    discountText = `R$ ${item.coupon.discountValue?.toFixed(2)} OFF`;
                  } else {
                    discountText = 'Grátis';
                  }

                  return (
                    <div key={item.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-700">
                          <img 
                            src={item.coupon.imageUrl || item.coupon.company.logoUrl || 'https://via.placeholder.com/80'} 
                            alt={item.coupon.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/80';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-semibold text-lg mb-1">{item.coupon.company.name}</h3>
                              <p className="text-slate-300 font-medium mb-1">{item.coupon.title}</p>
                              {item.coupon.description && item.coupon.description !== item.coupon.title && (
                                <p className="text-slate-500 text-sm line-clamp-2">{item.coupon.description}</p>
                              )}
                            </div>
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 flex-shrink-0">
                              Pendente
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-3 text-slate-500 text-sm mb-3 flex-wrap">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              <span>Válido até {validUntil}</span>
                            </div>
                            <Badge variant="outline" className="border-amber-500/50 text-amber-400 bg-amber-500/10">
                              {discountText}
                            </Badge>
                          </div>
                          
                          <div className="bg-slate-900/70 rounded-lg p-3 mb-3 border border-slate-700">
                            <p className="text-slate-400 text-xs mb-2 font-medium">Código do cupom:</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <code className="text-white font-mono text-xl font-bold tracking-wider bg-slate-800 px-3 py-1.5 rounded border border-slate-700">
                                {item.code}
                              </code>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                                onClick={() => {
                                  navigator.clipboard.writeText(item.code);
                                  toast.success('Código copiado!');
                                }}
                              >
                                Copiar
                              </Button>
                            </div>
                          </div>
                          
                          {item.coupon.company.address && (
                            <div className="text-slate-500 text-sm bg-slate-900/30 rounded-lg p-2.5">
                              <p className="font-medium text-slate-400 mb-1">📍 Local:</p>
                              <p className="text-slate-300">{item.coupon.company.address}</p>
                              {item.coupon.company.city && (
                                <p className="text-slate-300">{item.coupon.company.city}</p>
                              )}
                              {item.coupon.company.phone && (
                                <p className="text-slate-300 mt-1">📞 {item.coupon.company.phone}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl text-white">Histórico de Uso</h2>
              {totalSavings !== '0.00' && (
                <div className="text-right">
                  <p className="text-slate-400 text-sm">Economia Total</p>
                  <p className="text-2xl text-green-400 font-bold">R$ {totalSavings}</p>
                </div>
              )}
            </div>
            {isLoadingHistory ? (
              <div className="space-y-3 pb-20">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 animate-pulse">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="w-12 h-12 bg-slate-700 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-slate-700 rounded w-32 mb-2"></div>
                          <div className="h-3 bg-slate-700 rounded w-24 mb-2"></div>
                          <div className="h-3 bg-slate-700 rounded w-40"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : couponHistory.length === 0 ? (
              <div className="text-center py-12 pb-20">
                <History className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Você ainda não usou nenhum cupom</p>
                <Button 
                  className="mt-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                  onClick={() => setActiveTab('home')}
                >
                  Explorar Cupons
                </Button>
              </div>
            ) : (
              <div className="space-y-3 pb-20">
                {couponHistory.map((item) => {
                  const usedDate = new Date(item.usedAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  });
                  
                  let discountText = '';
                  if (item.coupon.discountType === 'PERCENTAGE') {
                    discountText = `${item.coupon.discountValue}% de desconto`;
                  } else if (item.coupon.discountType === 'FIXED') {
                    discountText = `R$ ${item.coupon.discountValue?.toFixed(2)} OFF`;
                  } else {
                    discountText = 'Grátis';
                  }

                  return (
                    <div key={item.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Gift className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white">{item.coupon.company.name}</h3>
                            <p className="text-slate-400">{item.coupon.title}</p>
                            <p className="text-slate-500 text-sm mt-1">{discountText}</p>
                            <div className="flex items-center gap-2 mt-2 text-slate-500">
                              <Calendar className="w-4 h-4" />
                              <span className="text-xs">Usado em {usedDate}</span>
                            </div>
                            <div className="mt-1">
                              <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                                Código: {item.code}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Usado
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6 pb-20">
            <h2 className="text-2xl text-white">Meu Perfil</h2>
            {isLoadingProfile ? (
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-slate-700"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-slate-700 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-slate-700 rounded w-48"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="border-t border-slate-700 pt-4">
                    <div className="h-4 bg-slate-700 rounded w-24 mb-2"></div>
                    <div className="h-4 bg-slate-700 rounded w-32"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    {userProfile?.avatarUrl ? (
                      <img src={userProfile.avatarUrl} alt={userProfile.fullName} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl text-white">{userProfile?.fullName || user?.name || 'Usuário'}</h3>
                    <p className="text-slate-400">{userProfile?.email || user?.email}</p>
                    {userProfile?.phone && (
                      <p className="text-slate-500 text-sm mt-1">{userProfile.phone}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  {userProfile?.subscriptions && userProfile.subscriptions.length > 0 && (
                    <div className="border-t border-slate-700 pt-4">
                      <h4 className="text-white mb-2">Assinatura</h4>
                      {userProfile.subscriptions.map((sub: any) => (
                        <div key={sub.id} className="flex items-center justify-between mb-2">
                          <div>
                            <span className="text-slate-300 capitalize">{sub.planType}</span>
                            <span className={`ml-2 text-xs px-2 py-1 rounded ${
                              sub.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {sub.status === 'ACTIVE' ? 'Ativa' : 'Inativa'}
                            </span>
                          </div>
                          <span className="text-amber-400">R$ {sub.price.toFixed(2)}/mês</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="border-t border-slate-700 pt-4">
                    <h4 className="text-white mb-2">Estatísticas</h4>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div className="text-center">
                        <div className="text-2xl text-white">{userProfile?.stats?.couponsUsed || 0}</div>
                        <div className="text-slate-400 text-xs">Cupons usados</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl text-white">{userProfile?.stats?.totalSavings || 'R$ 0,00'}</div>
                        <div className="text-slate-400 text-xs">Economia total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl text-white">{userProfile?.stats?.favoritesCount || favorites.size}</div>
                        <div className="text-slate-400 text-xs">Favoritos</div>
                      </div>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-6 border-red-500/50 text-red-400 hover:bg-red-500/10"
                  onClick={handleLogout}
                >
                  Sair da conta
                </Button>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pb-20">
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
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800">
        <div className="flex items-center justify-center py-2 px-4">
          <div className="flex items-center justify-center gap-1 max-w-md w-full">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center justify-center py-2 px-4 transition-colors rounded-lg flex-1 ${
                activeTab === 'home' 
                  ? 'text-amber-400 bg-amber-400/10' 
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <Home className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Início</span>
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex flex-col items-center justify-center py-2 px-4 transition-colors rounded-lg flex-1 ${
                activeTab === 'favorites' 
                  ? 'text-amber-400 bg-amber-400/10' 
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <Star className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Favoritos</span>
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`flex flex-col items-center justify-center py-2 px-4 transition-colors rounded-lg flex-1 ${
                activeTab === 'active' 
                  ? 'text-amber-400 bg-amber-400/10' 
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <Gift className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Ativos</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex flex-col items-center justify-center py-2 px-4 transition-colors rounded-lg flex-1 ${
                activeTab === 'history' 
                  ? 'text-amber-400 bg-amber-400/10' 
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <History className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Histórico</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center justify-center py-2 px-4 transition-colors rounded-lg flex-1 ${
                activeTab === 'profile' 
                  ? 'text-amber-400 bg-amber-400/10' 
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <User className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Perfil</span>
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
