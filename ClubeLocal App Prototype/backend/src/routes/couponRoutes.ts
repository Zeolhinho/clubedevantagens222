import { Router } from 'express';
import { 
  listCoupons, 
  getCouponById, 
  listCategories,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  useCoupon,
  validateCouponCode,
} from '../controllers/couponController';
import { auth, optionalAuth } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { UserRole } from '@prisma/client';

const router = Router();

// Rotas públicas (com autenticação opcional)
router.get('/', optionalAuth, listCoupons); // Listar cupons com filtros
router.get('/categories', listCategories); // Listar categorias
router.get('/:id', optionalAuth, getCouponById); // Detalhes de um cupom

// Rotas protegidas - Empresas
router.post('/', auth, authorize(UserRole.COMPANY), createCoupon); // Criar cupom
router.put('/:id', auth, authorize(UserRole.COMPANY), updateCoupon); // Editar cupom
// Deletar cupom - empresa ou admin
router.delete('/:id', auth, (req, res, next) => {
  if (req.user?.role === 'COMPANY' || req.user?.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ error: 'Acesso negado' });
  }
}, deleteCoupon);
router.post('/validate', auth, authorize(UserRole.COMPANY), validateCouponCode); // Validar código

// Rotas protegidas - Clientes
router.post('/:id/use', auth, authorize(UserRole.CUSTOMER), useCoupon); // Usar cupom (gerar código)

export default router;

