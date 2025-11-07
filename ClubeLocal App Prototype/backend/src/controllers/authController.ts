import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient, UserRole } from '@prisma/client';
import { generateToken } from '../utils/jwt';

const prisma = new PrismaClient();

export async function signup(req: Request, res: Response) {
  try {
    const { email, password, fullName } = req.body;

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário (role CUSTOMER por padrão)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role: UserRole.CUSTOMER,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        phone: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    // Gerar token JWT
    const token = generateToken(user.id, user.email, user.role);

    res.status(201).json({
      token,
      user,
    });
  } catch (error) {
    console.error('Erro no signup:', error);
    res.status(500).json({ error: 'Erro ao criar conta' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    // Gerar token JWT
    const token = generateToken(user.id, user.email, user.role);

    // Retornar dados do usuário (sem senha)
    const userData = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };

    res.json({
      token,
      user: userData,
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
}

