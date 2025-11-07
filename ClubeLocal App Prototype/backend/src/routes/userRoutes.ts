import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  getFavorites,
  addFavorite,
  removeFavorite,
  getActiveCoupons,
  getCouponHistory,
} from '../controllers/userController';
import { auth } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { UserRole } from '@prisma/client';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(auth);

// Rotas de perfil
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Rotas de favoritos
router.get('/favorites', getFavorites);
router.post('/favorites', addFavorite);
router.delete('/favorites/:couponId', removeFavorite);

// Cupons ativos e histórico
router.get('/active-coupons', authorize(UserRole.CUSTOMER), getActiveCoupons);
router.get('/history', authorize(UserRole.CUSTOMER), getCouponHistory);

export default router;

