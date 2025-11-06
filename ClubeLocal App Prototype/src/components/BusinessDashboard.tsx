import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Gift, Bell, Menu, Plus, BarChart3, Edit, Pause, Play, TrendingUp, Users, Ticket } from 'lucide-react';
import { CreateCouponModal } from './CreateCouponModal';
import { mockCoupons } from '../data/mockData';

interface BusinessDashboardProps {
  onLogout: () => void;
}

export function BusinessDashboard({ onLogout }: BusinessDashboardProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [coupons] = useState(mockCoupons.slice(0, 4)); // Business's coupons

  const stats = [
    { label: 'Cupons Ativos', value: '3', icon: Ticket, color: 'text-blue-400' },
    { label: 'Cupons Usados', value: '156', icon: Users, color: 'text-green-400' },
    { label: 'Taxa de Conversão', value: '68%', icon: TrendingUp, color: 'text-amber-400' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ativo</Badge>;
      case 'paused':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Pausado</Badge>;
      case 'pending':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Pendente</Badge>;
      default:
        return null;
    }
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
              <h1 className="text-white">Restaurante Sabor Local</h1>
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
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 bg-slate-800/50 border-slate-700">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-400 mb-1">{stat.label}</p>
                    <p className="text-3xl text-white">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-slate-700/50 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Coupons List */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl text-white">Meus Cupons</h2>
              <Button 
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Cupom
              </Button>
            </div>

            <div className="space-y-3">
              {coupons.map((coupon) => (
                <Card key={coupon.id} className="p-4 bg-slate-800/50 border-slate-700">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={coupon.image} 
                            alt={coupon.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="text-white">{coupon.title}</h3>
                            {getStatusBadge(coupon.status || 'active')}
                          </div>
                          <p className="text-slate-400 mb-2">{coupon.description}</p>
                          <div className="flex items-center gap-4 text-slate-500">
                            <span>Código: {coupon.code}</span>
                            <span>•</span>
                            <span>Usos: {coupon.usageCount || 0}</span>
                            <span>•</span>
                            <span>Válido até {coupon.validUntil}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                        <Edit className="w-4 h-4" />
                      </Button>
                      {coupon.status === 'active' ? (
                        <Button variant="outline" size="icon" className="border-slate-600 text-amber-400 hover:bg-slate-800">
                          <Pause className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button variant="outline" size="icon" className="border-slate-600 text-green-400 hover:bg-slate-800">
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="outline" size="icon" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
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
                onClick={onLogout}
              >
                Sair
              </Button>
            </div>
          </Card>
        </div>
      </main>

      {/* Create Coupon Modal */}
      {showCreateModal && (
        <CreateCouponModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
