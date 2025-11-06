import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { UserDashboard } from './components/UserDashboard';
import { BusinessDashboard } from './components/BusinessDashboard';
import { AdminPanel } from './components/AdminPanel';

export type UserRole = 'guest' | 'user' | 'business' | 'admin';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'signup' | 'user' | 'business' | 'admin'>('landing');
  const [userRole, setUserRole] = useState<UserRole>('guest');

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    if (role === 'user') setCurrentView('user');
    else if (role === 'business') setCurrentView('business');
    else if (role === 'admin') setCurrentView('admin');
  };

  const handleLogout = () => {
    setUserRole('guest');
    setCurrentView('landing');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {currentView === 'landing' && (
        <LandingPage 
          onLogin={() => setCurrentView('login')} 
          onSignup={() => setCurrentView('signup')}
        />
      )}
      {(currentView === 'login' || currentView === 'signup') && (
        <LoginPage 
          isSignup={currentView === 'signup'}
          onLogin={handleLogin}
          onBack={() => setCurrentView('landing')}
        />
      )}
      {currentView === 'user' && (
        <UserDashboard onLogout={handleLogout} />
      )}
      {currentView === 'business' && (
        <BusinessDashboard onLogout={handleLogout} />
      )}
      {currentView === 'admin' && (
        <AdminPanel onLogout={handleLogout} />
      )}
    </div>
  );
}
