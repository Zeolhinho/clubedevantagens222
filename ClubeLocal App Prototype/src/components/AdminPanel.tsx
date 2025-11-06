import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Gift, Users, Building2, Ticket, TrendingUp, Search, Check, X } from 'lucide-react';
import { mockBusinesses, mockCoupons } from '../data/mockData';

interface AdminPanelProps {
  onLogout: () => void;
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Assinantes Ativos', value: '1,234', icon: Users, color: 'text-blue-400' },
    { label: 'Empresas Parceiras', value: '156', icon: Building2, color: 'text-purple-400' },
    { label: 'Cupons Ativos', value: '487', icon: Ticket, color: 'text-green-400' },
    { label: 'Receita Mensal', value: 'R$ 36.8k', icon: TrendingUp, color: 'text-amber-400' },
  ];

  const pendingBusinesses = mockBusinesses.filter(b => b.status === 'pending');
  const pendingCoupons = mockCoupons.filter(c => c.status === 'pending');

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
            onClick={onLogout}
          >
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 bg-slate-800/50 border-slate-700">
                <div className="flex items-start justify-between mb-2">
                  <div className={`w-12 h-12 rounded-lg bg-slate-700/50 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-slate-400">{stat.label}</p>
                <p className="text-3xl text-white mt-1">{stat.value}</p>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="businesses" className="space-y-6">
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
              <div className="flex items-center justify-between">
                <h2 className="text-2xl text-white">Empresas Pendentes de Aprovação</h2>
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
                      {pendingBusinesses.map((business) => (
                        <tr key={business.id} className="border-t border-slate-700">
                          <td className="p-4 text-white">{business.name}</td>
                          <td className="p-4 text-slate-400">{business.email}</td>
                          <td className="p-4 text-slate-400">{business.category}</td>
                          <td className="p-4 text-slate-400">{business.joinedDate}</td>
                          <td className="p-4">
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                              Pendente
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button size="sm" className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30">
                                <Check className="w-4 h-4 mr-1" />
                                Aprovar
                              </Button>
                              <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                                <X className="w-4 h-4 mr-1" />
                                Rejeitar
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            {/* Coupons Tab */}
            <TabsContent value="coupons" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl text-white">Cupons Aguardando Aprovação</h2>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Buscar cupons..."
                    className="pl-9 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {pendingCoupons.map((coupon) => (
                  <Card key={coupon.id} className="p-4 bg-slate-800/50 border-slate-700">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={coupon.image} 
                          alt={coupon.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-white">{coupon.business}</h3>
                            <p className="text-slate-400">{coupon.title}</p>
                          </div>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            {coupon.discount}
                          </Badge>
                        </div>
                        <p className="text-slate-500 mb-3">{coupon.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-slate-500">
                            <span>Código: {coupon.code}</span>
                            <span>•</span>
                            <span>Válido até {coupon.validUntil}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30">
                              <Check className="w-4 h-4 mr-1" />
                              Aprovar
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                              <X className="w-4 h-4 mr-1" />
                              Rejeitar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
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
                      {[
                        { id: 1, name: 'João Silva', email: 'joao@email.com', plan: 'Mensal', since: '15/08/2025', used: 12 },
                        { id: 2, name: 'Maria Santos', email: 'maria@email.com', plan: 'Mensal', since: '20/09/2025', used: 8 },
                        { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', plan: 'Mensal', since: '01/10/2025', used: 5 },
                      ].map((subscriber) => (
                        <tr key={subscriber.id} className="border-t border-slate-700">
                          <td className="p-4 text-white">{subscriber.name}</td>
                          <td className="p-4 text-slate-400">{subscriber.email}</td>
                          <td className="p-4 text-slate-400">{subscriber.plan}</td>
                          <td className="p-4 text-slate-400">{subscriber.since}</td>
                          <td className="p-4 text-slate-400">{subscriber.used}</td>
                          <td className="p-4">
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              Ativo
                            </Badge>
                          </td>
                        </tr>
                      ))}
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
