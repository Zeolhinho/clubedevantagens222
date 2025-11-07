import { Router } from 'express';
import {
  listCompanies,
  updateCompanyStatus,
  listPendingCoupons,
  updateCouponStatus,
  toggleCouponActive,
  getAdminStats,
  listUsers,
} from '../controllers/adminController';
import { auth } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { UserRole } from '@prisma/client';

const router = Router();

// Todas as rotas precisam ser admin
router.use(auth);
router.use(authorize(UserRole.ADMIN));

// Dashboard
router.get('/stats', getAdminStats);

// Empresas
router.get('/companies', listCompanies);
router.put('/companies/:id/status', updateCompanyStatus);

// Cupons
router.get('/coupons/pending', listPendingCoupons);
router.put('/coupons/:id/status', updateCouponStatus);
router.put('/coupons/:id/toggle-active', toggleCouponActive);

// Usuários
router.get('/users', listUsers);

export default router;

