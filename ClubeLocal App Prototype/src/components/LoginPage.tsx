import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Gift, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { loginSchema, signupSchema, LoginFormData, SignupFormData } from '../schemas/authSchemas';

interface LoginPageProps {
  isSignup: boolean;
}

export function LoginPage({ isSignup }: LoginPageProps) {
  const navigate = useNavigate();
  const { login, signup, isLoading, user, isAuthenticated } = useAuth();

  // Redirecionar se já estiver logado
  if (isAuthenticated && user) {
    if (user.role === 'admin') navigate('/admin', { replace: true });
    else if (user.role === 'business') navigate('/business', { replace: true });
    else navigate('/dashboard', { replace: true });
  }

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      // Toast e navegação são tratados pelo AuthContext
    } catch (error) {
      // Erro já é tratado pelo AuthContext com toast
      console.error('Erro no login:', error);
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    try {
      await signup(data.name, data.email, data.password);
      // Toast e navegação são tratados pelo AuthContext
    } catch (error) {
      // Erro já é tratado pelo AuthContext com toast
      console.error('Erro no signup:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          className="text-slate-200 hover:text-white mb-6"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        
        <Card className="p-8 bg-slate-800/50 border-slate-700 backdrop-blur">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Gift className="w-7 h-7 text-white" />
            </div>
            <span className="text-white text-2xl">ClubeLocal</span>
          </div>

          <h2 className="text-2xl text-white text-center mb-2">
            {isSignup ? 'Criar Conta' : 'Bem-vindo de volta'}
          </h2>
          <p className="text-slate-400 text-center mb-8">
            {isSignup ? 'Comece a economizar hoje' : 'Entre para acessar seus cupons'}
          </p>

          {isSignup ? (
            <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-200">Nome completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  {...signupForm.register('name')}
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                />
                {signupForm.formState.errors.name && (
                  <p className="text-red-400 text-sm">{signupForm.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...signupForm.register('email')}
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                />
                {signupForm.formState.errors.email && (
                  <p className="text-red-400 text-sm">{signupForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...signupForm.register('password')}
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                />
                {signupForm.formState.errors.password && (
                  <p className="text-red-400 text-sm">{signupForm.formState.errors.password.message}</p>
                )}
              </div>

              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Criar conta'
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...loginForm.register('email')}
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                />
                {loginForm.formState.errors.email && (
                  <p className="text-red-400 text-sm">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...loginForm.register('password')}
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                />
                {loginForm.formState.errors.password && (
                  <p className="text-red-400 text-sm">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <div className="text-right">
                <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">
                  Esqueceu sua senha?
                </a>
              </div>

              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800/50 text-slate-400">ou continue com</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="bg-slate-900/50 border-slate-600 text-slate-200 hover:bg-slate-900 hover:text-white"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            <Button 
              variant="outline"
              className="bg-slate-900/50 border-slate-600 text-slate-200 hover:bg-slate-900 hover:text-white"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Apple
            </Button>
          </div>

          <p className="text-slate-400 text-center mt-6 text-sm">
            Dica: use "admin@teste.com" para painel admin, "empresa@teste.com" para painel empresa, ou qualquer outro email para dashboard do usuário
          </p>
        </Card>
      </div>
    </div>
  );
}
