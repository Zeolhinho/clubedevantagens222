import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { signup, login } from '../controllers/authController';

const router = Router();

// Validações para signup
const signupValidation = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .notEmpty()
    .withMessage('Email é obrigatório'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter no mínimo 6 caracteres')
    .notEmpty()
    .withMessage('Senha é obrigatória'),
  body('fullName')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Nome deve ter no mínimo 3 caracteres')
    .notEmpty()
    .withMessage('Nome é obrigatório'),
];

// Validações para login
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .notEmpty()
    .withMessage('Email é obrigatório'),
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória'),
];

// Middleware para verificar erros de validação
const handleValidationErrors = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: errors.array()[0].msg 
    });
  }
  next();
};

// Rotas
router.post('/signup', signupValidation, handleValidationErrors, signup);
router.post('/login', loginValidation, handleValidationErrors, login);

export default router;

