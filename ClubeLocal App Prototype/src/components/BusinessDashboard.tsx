import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Gift, Bell, Menu, Plus, BarChart3, Edit, Pause, Play, TrendingUp, Users, Ticket, Loader2, Trash2, QrCode, CheckCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { CreateCouponModal } from './CreateCouponModal';
import { useAuth } from '../contexts/AuthContext';
import { couponService } from '../services/couponService';
import { userService } from '../services/userService';
import { toast } from 'sonner';

export function BusinessDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [validateCode, setValidateCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [stats, setStats] = useState({
    active: 0,
    total: 0,
    used: 0,
  });

  useEffect(() => {
    loadCompanyInfo();
    loadCoupons();
  }, []);

  const loadCompanyInfo = async () => {
    try {
      const profile = await userService.getProfile();
      setCompanyInfo(profile.company);
    } catch (error: any) {
      console.error('Erro ao carregar informações da empresa:', error);
    }
  };

  const loadCoupons = async () => {
    setIsLoading(true);
    try {
      // Usar 'current' para buscar cupons da empresa logada
      const response = await couponService.listCoupons({ companyId: 'current' });
      console.log('Cupons carregados:', response);
      const couponsList = response.coupons || [];
      setCoupons(couponsList);
      
      // Calcular estatísticas
      const active = couponsList.filter((c: any) => c.isActive && c.status === 'APPROVED').length;
      const total = couponsList.length;
      const used = couponsList.reduce((sum: number, c: any) => sum + (c.usageCount || 0), 0);
      
      setStats({ active, total, used });
      console.log('Estatísticas calculadas:', { active, total, used });
    } catch (error: any) {
      console.error('Erro ao carregar cupons:', error);
      console.error('Detalhes do erro:', error.response?.data);
      toast.error(error.response?.data?.error || 'Erro ao carregar cupons');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cupom?')) return;
    
    try {
      await couponService.deleteCoupon(id);
      toast.success('Cupom excluído com sucesso');
      loadCoupons();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao excluir cupom');
    }
  };

  const handleToggleActive = async (coupon: any) => {
    try {
      await couponService.updateCoupon(coupon.id, {
        ...coupon,
        isActive: !coupon.isActive,
      });
      toast.success(`Cupom ${coupon.isActive ? 'pausado' : 'ativado'} com sucesso`);
      loadCoupons();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao atualizar cupom');
    }
  };

  const handleValidateCoupon = async () => {
    if (!validateCode.trim()) {
      toast.error('Por favor, insira um código ou QR Code');
      return;
    }

    setIsValidating(true);
    try {
      // Verificar se é QR code (formato CLUBELOCAL:couponId:code) ou código simples
      const isQRCode = validateCode.includes(':');
      const data = isQRCode 
        ? { qrCode: validateCode }
        : { code: validateCode };

      const response = await couponService.validateCouponCode(data);
      toast.success(response.message || 'Cupom validado com sucesso!');
      setValidateCode('');
      setShowValidateModal(false);
      loadCoupons(); // Recarregar para atualizar estatísticas
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao validar cupom');
    } finally {
      setIsValidating(false);
    }
  };

  const getStatusBadge = (coupon: any) => {
    if (coupon.status === 'APPROVED' && coupon.isActive) {
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Aprovado e Ativo</Badge>;
    } else if (coupon.status === 'APPROVED' && !coupon.isActive) {
      return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Aprovado (Pausado)</Badge>;
    } else if (coupon.status === 'PENDING') {
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Aguardando Aprovação</Badge>;
    } else if (coupon.status === 'REJECTED') {
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Rejeitado</Badge>;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-white">{companyInfo?.name || 'Minha Empresa'}</h1>
              <p className="text-slate-400">Painel do Parceiro</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 mb-1">Cupons Ativos</p>
                  <p className="text-3xl text-white">{stats.active}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-slate-700/50 flex items-center justify-center text-blue-400">
                  <Ticket className="w-6 h-6" />
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 mb-1">Cupons Usados</p>
                  <p className="text-3xl text-white">{stats.used}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-slate-700/50 flex items-center justify-center text-green-400">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 mb-1">Total de Cupons</p>
                  <p className="text-3xl text-white">{stats.total}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-slate-700/50 flex items-center justify-center text-amber-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </div>

          {/* Coupons List */}
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <h2 className="text-2xl text-white">Meus Cupons</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                  onClick={() => setShowValidateModal(true)}
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Validar Cupom
                </Button>
                <Button 
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Cupom
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-4 bg-slate-800/50 border-slate-700 animate-pulse">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 bg-slate-700 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-slate-700 rounded w-48 mb-2"></div>
                        <div className="h-3 bg-slate-700 rounded w-full mb-2"></div>
                        <div className="h-3 bg-slate-700 rounded w-32"></div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : coupons.length === 0 ? (
              <div className="text-center py-12">
                <Ticket className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">Você ainda não criou nenhum cupom</p>
                <Button 
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Cupom
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {coupons.map((coupon) => {
                  const validUntil = new Date(coupon.validUntil).toLocaleDateString('pt-BR');
                  const validFrom = new Date(coupon.validFrom).toLocaleDateString('pt-BR');
                  
                  return (
                    <Card key={coupon.id} className="p-4 bg-slate-800/50 border-slate-700">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={coupon.imageUrl || 'https://via.placeholder.com/64'} 
                                alt={coupon.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h3 className="text-white">{coupon.title}</h3>
                                {getStatusBadge(coupon)}
                              </div>
                              <p className="text-slate-400 mb-2">{coupon.description}</p>
                              <div className="flex items-center gap-4 text-slate-500 text-sm flex-wrap">
                                <span>Usos: {coupon.usageCount || 0}</span>
                                <span>•</span>
                                <span>Válido de {validFrom} até {validUntil}</span>
                                {coupon.totalUsesLimit && (
                                  <>
                                    <span>•</span>
                                    <span>Limite: {coupon.totalUsesLimit}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {coupon.status === 'APPROVED' && (
                            <>
                              {coupon.isActive ? (
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="border-slate-600 text-amber-400 hover:bg-slate-800"
                                  onClick={() => handleToggleActive(coupon)}
                                  title="Pausar cupom"
                                >
                                  <Pause className="w-4 h-4" />
                                </Button>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="border-slate-600 text-green-400 hover:bg-slate-800"
                                  onClick={() => handleToggleActive(coupon)}
                                  title="Ativar cupom"
                                >
                                  <Play className="w-4 h-4" />
                                </Button>
                              )}
                            </>
                          )}
                          {coupon.status === 'PENDING' && (
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                              Aguardando aprovação do admin
                            </Badge>
                          )}
                          {coupon.status === 'REJECTED' && (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                              Rejeitado pelo admin
                            </Badge>
                          )}
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="border-slate-600 text-red-400 hover:bg-slate-800"
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            title="Excluir cupom"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <Card className="p-6 bg-slate-800/50 border-slate-700">
            <h3 className="text-white mb-4">Ações Rápidas</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800">
                Ver Estatísticas Detalhadas
              </Button>
              <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800">
                Exportar Relatório
              </Button>
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
          </Card>
        </div>
      </main>

      {/* Create Coupon Modal */}
      {showCreateModal && (
        <CreateCouponModal 
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadCoupons();
          }}
        />
      )}

      {/* Validate Coupon Modal */}
      <Dialog open={showValidateModal} onOpenChange={setShowValidateModal}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Validar Cupom
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Digite o código do cupom ou escaneie o QR Code
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Código ou QR Code</label>
              <Input
                placeholder="Digite o código ou cole o QR Code"
                value={validateCode}
                onChange={(e) => setValidateCode(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleValidateCoupon();
                  }
                }}
                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                autoFocus
              />
              <p className="text-xs text-slate-500 mt-2">
                Você pode digitar o código de 8 caracteres ou colar o QR Code completo
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
                onClick={() => {
                  setShowValidateModal(false);
                  setValidateCode('');
                }}
                disabled={isValidating}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                onClick={handleValidateCoupon}
                disabled={isValidating || !validateCode.trim()}
              >
                {isValidating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Validando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Validar
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
