import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Utensils, Sparkles, Car, ShoppingBag, Heart, Scissors, Coffee, Gift, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Redirecionar se já estiver logado
  if (isAuthenticated && user) {
    if (user.role === 'admin') navigate('/admin');
    else if (user.role === 'business') navigate('/business');
    else navigate('/dashboard');
  }
  const categories = [
    { icon: Utensils, label: 'Alimentação', color: 'text-orange-500' },
    { icon: Scissors, label: 'Beleza', color: 'text-pink-500' },
    { icon: Car, label: 'Serviços', color: 'text-blue-500' },
    { icon: ShoppingBag, label: 'Compras', color: 'text-purple-500' },
    { icon: Heart, label: 'Saúde', color: 'text-red-500' },
    { icon: Coffee, label: 'Lazer', color: 'text-amber-600' },
  ];

  const steps = [
    { number: '1', title: 'Assine o clube', description: 'Por apenas R$29,90/mês' },
    { number: '2', title: 'Escolha seus cupons', description: 'Centenas de ofertas exclusivas' },
    { number: '3', title: 'Use e economize!', description: 'Apresente o QR Code e ganhe desconto' },
  ];

  const benefits = [
    'Descontos exclusivos em centenas de estabelecimentos',
    'Novos cupons adicionados toda semana',
    'Sem limite de uso durante a assinatura',
    'Cancele quando quiser, sem multa',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xl">ClubeLocal</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-slate-200 hover:text-white" onClick={() => navigate('/login')}>
              Entrar
            </Button>
            <Button 
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
              onClick={() => navigate('/signup')}
            >
              Assinar Agora
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 max-w-7xl text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-blue-200">Mais de 500 estabelecimentos parceiros</span>
        </div>
        <h1 className="text-5xl md:text-6xl text-white mb-6 leading-tight">
          Descontos exclusivos<br />
          <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            na sua cidade 🎉
          </span>
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Economize em restaurantes, lojas e serviços locais com cupons digitais exclusivos para assinantes
        </p>
        <Button 
          size="lg"
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-lg px-8 py-6 h-auto"
          onClick={() => navigate('/signup')}
        >
          Assine por R$29,90/mês
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        <p className="text-slate-400 mt-4">Cancele quando quiser • Sem taxa de adesão</p>
      </section>

      {/* Como Funciona */}
      <section className="container mx-auto px-4 py-20 max-w-7xl">
        <h2 className="text-3xl text-white text-center mb-12">
          Como Funciona
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur text-center h-full">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center mx-auto mb-4 text-2xl">
                  {step.number}
                </div>
                <h3 className="text-xl text-white mb-2">{step.title}</h3>
                <p className="text-slate-400">{step.description}</p>
              </Card>
              {index < steps.length - 1 && (
                <ArrowRight className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-blue-400 w-8 h-8" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Categorias */}
      <section className="container mx-auto px-4 py-20 max-w-7xl">
        <h2 className="text-3xl text-white text-center mb-12">
          Explore por Categoria
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <Card 
              key={index}
              className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur hover:bg-slate-800 transition-colors cursor-pointer text-center"
            >
              <category.icon className={`w-12 h-12 mx-auto mb-3 ${category.color}`} />
              <p className="text-slate-200">{category.label}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefícios */}
      <section className="container mx-auto px-4 py-20 max-w-4xl">
        <Card className="p-8 md:p-12 bg-gradient-to-br from-blue-900/50 to-slate-900/50 border-slate-700 backdrop-blur">
          <h2 className="text-3xl text-white text-center mb-8">
            Por que assinar o ClubeLocal?
          </h2>
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-green-400" />
                </div>
                <p className="text-slate-200 text-lg">{benefit}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8"
              onClick={() => navigate('/signup')}
            >
              Começar Agora
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <span className="text-white">ClubeLocal</span>
              </div>
              <p className="text-slate-400">
                Conectando você aos melhores descontos da sua cidade
              </p>
            </div>
            <div>
              <h3 className="text-white mb-4">Para Usuários</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Como funciona</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Planos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white mb-4">Para Empresas</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Cadastre sua empresa</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Como funciona</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2025 ClubeLocal. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
