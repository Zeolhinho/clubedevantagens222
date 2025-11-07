import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { UserDashboard } from './components/UserDashboard';
import { BusinessDashboard } from './components/BusinessDashboard';
import { AdminPanel } from './components/AdminPanel';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <div className="min-h-screen bg-slate-50">
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage isSignup={false} />} />
              <Route path="/signup" element={<LoginPage isSignup={true} />} />

              {/* Rotas protegidas - Usuário */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <UserDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Rotas protegidas - Empresa */}
              <Route 
                path="/business" 
                element={
                  <ProtectedRoute allowedRoles={['business']}>
                    <BusinessDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Rotas protegidas - Admin */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />

              {/* Rota 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          {/* Toast Notifications */}
          <Toaster 
            position="top-right" 
            richColors 
            closeButton
            theme="dark"
            duration={4000}
            toastOptions={{
              style: {
                background: '#1e293b',
                border: '1px solid #334155',
                color: '#f1f5f9',
              },
            }}
          />
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
