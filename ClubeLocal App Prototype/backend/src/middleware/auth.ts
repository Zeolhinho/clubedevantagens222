import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';

// Estender o tipo Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function auth(req: Request, res: Response, next: NextFunction) {
  try {
    // Pegar token do header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Formato: "Bearer <token>"
    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Formato de token inválido' });
    }

    const token = parts[1];

    // Verificar e decodificar token
    const decoded = verifyToken(token);

    // Adicionar dados do usuário na requisição
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

// Autenticação opcional - não falha se não houver token
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Sem token, continua sem autenticação
      return next();
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      // Formato inválido, continua sem autenticação
      return next();
    }

    const token = parts[1];

    try {
      // Verificar e decodificar token
      const decoded = verifyToken(token);
      req.user = decoded;
    } catch (error) {
      // Token inválido, continua sem autenticação
      // Não retorna erro, apenas não autentica
    }

    next();
  } catch (error) {
    // Qualquer erro, continua sem autenticação
    next();
  }
}

