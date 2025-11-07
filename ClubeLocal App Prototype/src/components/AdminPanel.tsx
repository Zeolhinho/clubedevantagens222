import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Gift, Users, Building2, Ticket, TrendingUp, Search, Check, X, Loader2, Trash2, Edit, Pause, Play, Calendar, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { adminService } from '../services/adminService';
import { couponService } from '../services/couponService';
import { toast } from 'sonner';

export function AdminPanel() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [pendingBusinesses, setPendingBusinesses] = useState<any[]>([]);
  const [allBusinesses, setAllBusinesses] = useState<any[]>([]);
  const [pendingCoupons, setPendingCoupons] = useState<any[]>([]);
  const [allCoupons, setAllCoupons] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(false);
  const [businessFilter, setBusinessFilter] = useState<'all' | 'PENDING' | 'ACTIVE' | 'SUSPENDED'>('all');
  const [couponFilter, setCouponFilter] = useState<'all' | 'PENDING' | 'APPROVED' | 'REJECTED'>('all');

  useEffect(() => {
    loadStats();
    loadAllBusinesses();
    loadAllCoupons();
  }, []);

  useEffect(() => {
    if (businessFilter === 'all') {
      loadAllBusinesses();
    } else {
      loadPendingBusinesses();
    }
  }, [businessFilter]);

  useEffect(() => {
    if (couponFilter === 'PENDING') {
      loadPendingCoupons();
    } else {
      // Para 'all', 'APPROVED', 'REJECTED' - carregar todos e filtrar no frontend
      if (allCoupons.length === 0) {
        loadAllCoupons();
      }
    }
  }, [couponFilter]);

  const loadStats = async () => {
    try {
      const data = await adminService.getStats();
      setStats(data);
    } catch (error: any) {
      console.error('Erro ao carregar estatísticas:', error);
      toast.error(error.response?.data?.error || 'Erro ao carregar estatísticas');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllBusinesses = async () => {
    setIsLoadingBusinesses(true);
    try {
      const response = await adminService.listCompanies();
      setAllBusinesses(response.companies || []);
      setPendingBusinesses((response.companies || []).filter((b: any) => b.status === 'PENDING'));
    } catch (error: any) {
      console.error('Erro ao carregar empresas:', error);
    } finally {
      setIsLoadingBusinesses(false);
    }
  };

  const loadPendingBusinesses = async () => {
    try {
      const response = await adminService.listCompanies({ status: businessFilter as any });
      setPendingBusinesses(response.companies || []);
    } catch (error: any) {
      console.error('Erro ao carregar empresas:', error);
    }
  };

  const loadAllCoupons = async () => {
    setIsLoadingCoupons(true);
    try {
      // Buscar todos os cupons (sem filtro de status)
      const response = await adminService.listPendingCoupons({ limit: 1000, status: 'all' });
      setAllCoupons(response.coupons || []);
      setPendingCoupons((response.coupons || []).filter((c: any) => c.status === 'PENDING'));
    } catch (error: any) {
      console.error('Erro ao carregar cupons:', error);
    } finally {
      setIsLoadingCoupons(false);
    }
  };

  const loadPendingCoupons = async () => {
    setIsLoadingCoupons(true);
    try {
      const response = await adminService.listPendingCoupons({ status: 'PENDING' });
      setPendingCoupons(response.coupons || []);
    } catch (error: any) {
      console.error('Erro ao carregar cupons:', error);
    } finally {
      setIsLoadingCoupons(false);
    }
  };

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await adminService.listUsers({ role: 'CUSTOMER' });
      setAllUsers(response.users || []);
    } catch (error: any) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleApproveCompany = async (id: string) => {
    try {
      await adminService.updateCompanyStatus(id, 'ACTIVE');
      toast.success('Empresa aprovada com sucesso');
      loadAllBusinesses();
      loadStats();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao aprovar empresa');
    }
  };

  const handleRejectCompany = async (id: string) => {
    try {
      await adminService.updateCompanyStatus(id, 'SUSPENDED');
      toast.success('Empresa suspensa');
      loadAllBusinesses();
      loadStats();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao suspender empresa');
    }
  };

  const handleSuspendCompany = async (id: string) => {
    try {
      await adminService.updateCompanyStatus(id, 'SUSPENDED');
      toast.success('Empresa suspensa');
      loadAllBusinesses();
      loadStats();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao suspender empresa');
    }
  };

  const handleActivateCompany = async (id: string) => {
    try {
      await adminService.updateCompanyStatus(id, 'ACTIVE');
      toast.success('Empresa ativada');
      loadAllBusinesses();
      loadStats();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao ativar empresa');
    }
  };

  const handleApproveCoupon = async (id: string) => {
    try {
      await adminService.updateCouponStatus(id, 'APPROVED');
      toast.success('Cupom aprovado com sucesso');
      loadAllCoupons();
      loadStats();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao aprovar cupom');
    }
  };

  const handleRejectCoupon = async (id: string) => {
    try {
      await adminService.updateCouponStatus(id, 'REJECTED');
      toast.success('Cupom rejeitado');
      loadAllCoupons();
      loadStats();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao rejeitar cupom');
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cupom? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      await couponService.deleteCoupon(id);
      toast.success('Cupom excluído com sucesso');
      loadAllCoupons();
      loadStats();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao excluir cupom');
    }
  };

  const handleToggleCouponActive = async (id: string) => {
    try {
      await adminService.toggleCouponActive(id);
      toast.success('Status do cupom atualizado');
      loadAllCoupons();
      loadStats();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao atualizar cupom');
    }
  };

  // Filtrar empresas e cupons baseado no filtro selecionado
  const filteredBusinesses = businessFilter === 'all' 
    ? allBusinesses 
    : allBusinesses.filter((b: any) => b.status === businessFilter);

  const filteredCoupons = couponFilter === 'all'
    ? allCoupons
    : couponFilter === 'PENDING'
    ? pendingCoupons
    : allCoupons.filter((c: any) => c.status === couponFilter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-white text-xl">ClubeLocal</span>
              <p className="text-slate-400">Painel Administrativo</p>
            </div>
          </div>
          <Button 
            variant="outline"
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Stats Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-6 bg-slate-800/50 border-slate-700 animate-pulse">
                  <div className="w-12 h-12 bg-slate-700 rounded-lg mb-2"></div>
                  <div className="h-4 bg-slate-700 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-slate-700 rounded w-16"></div>
                </Card>
              ))}
            </div>
          ) : stats ? (
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="p-6 bg-slate-800/50 border-slate-700">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 rounded-lg bg-slate-700/50 flex items-center justify-center text-blue-400">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-slate-400">Assinantes Ativos</p>
                <p className="text-3xl text-white mt-1">{stats.users.activeSubscriptions}</p>
              </Card>
              <Card className="p-6 bg-slate-800/50 border-slate-700">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 rounded-lg bg-slate-700/50 flex items-center justify-center text-purple-400">
                    <Building2 className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-slate-400">Empresas Parceiras</p>
                <p className="text-3xl text-white mt-1">{stats.companies.active}</p>
              </Card>
              <Card className="p-6 bg-slate-800/50 border-slate-700">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 rounded-lg bg-slate-700/50 flex items-center justify-center text-green-400">
                    <Ticket className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-slate-400">Cupons Aprovados</p>
                <p className="text-3xl text-white mt-1">{stats.coupons.approved}</p>
              </Card>
              <Card className="p-6 bg-slate-800/50 border-slate-700">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 rounded-lg bg-slate-700/50 flex items-center justify-center text-amber-400">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-slate-400">Receita Mensal</p>
                <p className="text-3xl text-white mt-1">{stats.revenue.monthly}</p>
              </Card>
            </div>
          ) : null}

          {/* Tabs */}
          <Tabs defaultValue="businesses" className="space-y-6" onValueChange={(value) => {
            if (value === 'subscribers' && allUsers.length === 0) {
              loadUsers();
            }
          }}>
            <TabsList className="bg-slate-800/50 border border-slate-700">
              <TabsTrigger value="businesses" className="data-[state=active]:bg-slate-700">
                Empresas
              </TabsTrigger>
              <TabsTrigger value="coupons" className="data-[state=active]:bg-slate-700">
                Cupons
              </TabsTrigger>
              <TabsTrigger value="subscribers" className="data-[state=active]:bg-slate-700">
                Assinantes
              </TabsTrigger>
            </TabsList>

            {/* Businesses Tab */}
            <TabsContent value="businesses" className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-2xl text-white">Gerenciar Empresas</h2>
                <div className="flex items-center gap-3">
                  <Select value={businessFilter} onValueChange={(value: any) => setBusinessFilter(value)}>
                    <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="PENDING">Pendentes</SelectItem>
                      <SelectItem value="ACTIVE">Ativas</SelectItem>
                      <SelectItem value="SUSPENDED">Suspensas</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Buscar empresas..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>
              </div>

              <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-900/50">
                      <tr>
                        <th className="text-left p-4 text-slate-300">Empresa</th>
                        <th className="text-left p-4 text-slate-300">E-mail</th>
                        <th className="text-left p-4 text-slate-300">Categoria</th>
                        <th className="text-left p-4 text-slate-300">Data</th>
                        <th className="text-left p-4 text-slate-300">Status</th>
                        <th className="text-right p-4 text-slate-300">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoadingBusinesses ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" />
                          </td>
                        </tr>
                      ) : filteredBusinesses.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400">
                            Nenhuma empresa encontrada
                          </td>
                        </tr>
                      ) : (
                        filteredBusinesses
                          .filter((business: any) => 
                            !searchQuery || 
                            business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            business.email.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .map((business: any) => {
                            const getStatusBadge = (status: string) => {
                              switch (status) {
                                case 'PENDING':
                                  return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Pendente</Badge>;
                                case 'ACTIVE':
                                  return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ativa</Badge>;
                                case 'SUSPENDED':
                                  return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Suspensa</Badge>;
                                default:
                                  return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">{status}</Badge>;
                              }
                            };

                            return (
                              <tr key={business.id} className="border-t border-slate-700">
                                <td className="p-4 text-white">{business.name}</td>
                                <td className="p-4 text-slate-400">{business.email}</td>
                                <td className="p-4 text-slate-400">{business.category?.name || 'N/A'}</td>
                                <td className="p-4 text-slate-400">
                                  {new Date(business.createdAt).toLocaleDateString('pt-BR')}
                                </td>
                                <td className="p-4">
                                  {getStatusBadge(business.status)}
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center justify-end gap-2">
                                    {business.status === 'PENDING' && (
                                      <>
                                        <Button 
                                          size="sm" 
                                          className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                                          onClick={() => handleApproveCompany(business.id)}
                                        >
                                          <Check className="w-4 h-4 mr-1" />
                                          Aprovar
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                                          onClick={() => handleRejectCompany(business.id)}
                                        >
                                          <X className="w-4 h-4 mr-1" />
                                          Rejeitar
                                        </Button>
                                      </>
                                    )}
                                    {business.status === 'ACTIVE' && (
                                      <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                                        onClick={() => handleSuspendCompany(business.id)}
                                      >
                                        <X className="w-4 h-4 mr-1" />
                                        Suspender
                                      </Button>
                                    )}
                                    {business.status === 'SUSPENDED' && (
                                      <Button 
                                        size="sm" 
                                        className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                                        onClick={() => handleActivateCompany(business.id)}
                                      >
                                        <Check className="w-4 h-4 mr-1" />
                                        Ativar
                                      </Button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            {/* Coupons Tab */}
            <TabsContent value="coupons" className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-2xl text-white">Gerenciar Cupons</h2>
                <div className="flex items-center gap-3">
                  <Select value={couponFilter} onValueChange={(value: any) => setCouponFilter(value)}>
                    <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="PENDING">Pendentes</SelectItem>
                      <SelectItem value="APPROVED">Aprovados</SelectItem>
                      <SelectItem value="REJECTED">Rejeitados</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Buscar cupons..."
                      className="pl-9 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>
              </div>

              {isLoadingCoupons ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-4 bg-slate-800/50 border-slate-700 animate-pulse">
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 bg-slate-700 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-slate-700 rounded w-32 mb-2"></div>
                          <div className="h-3 bg-slate-700 rounded w-full mb-2"></div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : filteredCoupons.length === 0 ? (
                <div className="text-center py-12">
                  <Ticket className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Nenhum cupom encontrado</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredCoupons.map((coupon) => {
                    const discountText = coupon.discountType === 'PERCENTAGE' 
                      ? `${coupon.discountValue}% OFF`
                      : coupon.discountType === 'FIXED'
                      ? `R$ ${coupon.discountValue} OFF`
                      : 'Grátis';
                    const validUntil = new Date(coupon.validUntil).toLocaleDateString('pt-BR');
                    const validFrom = new Date(coupon.validFrom).toLocaleDateString('pt-BR');
                    const createdAt = new Date(coupon.createdAt).toLocaleDateString('pt-BR');
                    
                    return (
                      <Card key={coupon.id} className="p-4 bg-slate-800/50 border-slate-700">
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={coupon.imageUrl || 'https://via.placeholder.com/80'} 
                              alt={coupon.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-white">{coupon.company?.name || 'Empresa'}</h3>
                                <p className="text-slate-400">{coupon.title}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                  {discountText}
                                </Badge>
                                <Badge className={
                                  coupon.status === 'APPROVED' && coupon.isActive ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                  coupon.status === 'APPROVED' && !coupon.isActive ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                                  coupon.status === 'PENDING' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                  'bg-red-500/20 text-red-400 border-red-500/30'
                                }>
                                  {coupon.status === 'APPROVED' && coupon.isActive ? 'Ativo' :
                                   coupon.status === 'APPROVED' && !coupon.isActive ? 'Pausado' :
                                   coupon.status === 'PENDING' ? 'Pendente' : 'Rejeitado'}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-slate-500 mb-3">{coupon.description}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-slate-500 text-sm">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>Criado: {createdAt}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>Válido: {validFrom} - {validUntil}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                <span>Usos: {coupon.usageCount || 0}</span>
                              </div>
                              {coupon.totalUsesLimit && (
                                <div className="flex items-center gap-1">
                                  <span>Limite: {coupon.totalUsesLimit}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {coupon.category && (
                                  <Badge variant="outline" className="border-slate-600 text-slate-400">
                                    {coupon.category.name}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex gap-2">
                                {coupon.status === 'PENDING' && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                                      onClick={() => handleApproveCoupon(coupon.id)}
                                    >
                                      <Check className="w-4 h-4 mr-1" />
                                      Aprovar
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                                      onClick={() => handleRejectCoupon(coupon.id)}
                                    >
                                      <X className="w-4 h-4 mr-1" />
                                      Rejeitar
                                    </Button>
                                  </>
                                )}
                                {coupon.status === 'REJECTED' && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                                      onClick={() => handleApproveCoupon(coupon.id)}
                                    >
                                      <Check className="w-4 h-4 mr-1" />
                                      Reaprovar
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                                      onClick={() => handleDeleteCoupon(coupon.id)}
                                    >
                                      <Trash2 className="w-4 h-4 mr-1" />
                                      Excluir
                                    </Button>
                                  </>
                                )}
                                {coupon.status === 'APPROVED' && (
                                  <>
                                    {coupon.isActive ? (
                                      <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                                        onClick={() => handleToggleCouponActive(coupon.id)}
                                        title="Pausar cupom"
                                      >
                                        <Pause className="w-4 h-4 mr-1" />
                                        Pausar
                                      </Button>
                                    ) : (
                                      <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                                        onClick={() => handleToggleCouponActive(coupon.id)}
                                        title="Ativar cupom"
                                      >
                                        <Play className="w-4 h-4 mr-1" />
                                        Ativar
                                      </Button>
                                    )}
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                                      onClick={() => handleRejectCoupon(coupon.id)}
                                    >
                                      <X className="w-4 h-4 mr-1" />
                                      Rejeitar
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                                      onClick={() => handleDeleteCoupon(coupon.id)}
                                    >
                                      <Trash2 className="w-4 h-4 mr-1" />
                                      Excluir
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Subscribers Tab */}
            <TabsContent value="subscribers" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl text-white">Assinantes Ativos</h2>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Buscar assinantes..."
                    className="pl-9 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                    onChange={(e) => {
                      // TODO: Implementar busca
                    }}
                  />
                </div>
              </div>

              <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-900/50">
                      <tr>
                        <th className="text-left p-4 text-slate-300">Nome</th>
                        <th className="text-left p-4 text-slate-300">E-mail</th>
                        <th className="text-left p-4 text-slate-300">Plano</th>
                        <th className="text-left p-4 text-slate-300">Desde</th>
                        <th className="text-left p-4 text-slate-300">Cupons Usados</th>
                        <th className="text-left p-4 text-slate-300">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoadingUsers ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" />
                          </td>
                        </tr>
                      ) : allUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400">
                            Nenhum assinante encontrado
                          </td>
                        </tr>
                      ) : (
                        allUsers.map((user) => {
                          const subscription = user.subscriptions?.[0];
                          return (
                            <tr key={user.id} className="border-t border-slate-700">
                              <td className="p-4 text-white">{user.fullName}</td>
                              <td className="p-4 text-slate-400">{user.email}</td>
                              <td className="p-4 text-slate-400 capitalize">
                                {subscription?.planType || 'N/A'}
                              </td>
                              <td className="p-4 text-slate-400">
                                {subscription ? new Date(subscription.startDate).toLocaleDateString('pt-BR') : 'N/A'}
                              </td>
                              <td className="p-4 text-slate-400">{user.stats?.couponsUsed || 0}</td>
                              <td className="p-4">
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                  {subscription?.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                                </Badge>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
