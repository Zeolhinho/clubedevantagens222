import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import couponRoutes from './routes/couponRoutes';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ClubeLocal API está funcionando!',
    timestamp: new Date().toISOString(),
  });
});

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Rotas de cupons
app.use('/api/coupons', couponRoutes);

// Rotas de usuário
app.use('/api/users', userRoutes);

// Rotas de admin
app.use('/api/admin', adminRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});

export default app;

