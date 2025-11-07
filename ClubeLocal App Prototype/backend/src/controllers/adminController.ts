import { Request, Response } from 'express';
import { PrismaClient, CouponStatus, CompanyStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Listar empresas (com filtros)
export async function listCompanies(req: Request, res: Response) {
  try {
    const { status, search, page = '1', limit = '20' } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const where: any = {};

    if (status) {
      where.status = status as CompanyStatus;
    }

    if (search) {
      where.OR = [
        {
          name: {
            contains: search as string,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: search as string,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              coupons: true,
            },
          },
        },
        skip,
        take: limitNumber,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.company.count({ where }),
    ]);

    res.json({
      companies,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error('Erro ao listar empresas:', error);
    res.status(500).json({ error: 'Erro ao buscar empresas' });
  }
}

// Aprovar/Rejeitar empresa
export async function updateCompanyStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!status || !['ACTIVE', 'SUSPENDED'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido. Use ACTIVE ou SUSPENDED' });
    }

    const company = await prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    const updatedCompany = await prisma.company.update({
      where: { id },
      data: {
        status: status as CompanyStatus,
        isActive: status === 'ACTIVE',
      },
      include: {
        user: {
          select: {
            email: true,
            fullName: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json({
      message: `Empresa ${status === 'ACTIVE' ? 'aprovada' : 'suspensa'} com sucesso`,
      company: updatedCompany,
    });
  } catch (error) {
    console.error('Erro ao atualizar status da empresa:', error);
    res.status(500).json({ error: 'Erro ao atualizar empresa' });
  }
}

// Listar cupons (com filtro opcional de status)
export async function listPendingCoupons(req: Request, res: Response) {
  try {
    const { page = '1', limit = '20', status } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const where: any = {};
    
    // Se status for fornecido, filtrar por status, senão retornar todos
    if (status && status !== 'all') {
      where.status = status as CouponStatus;
    }

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              icon: true,
            },
          },
          _count: {
            select: {
              couponUsages: true,
            },
          },
        },
        skip,
        take: limitNumber,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.coupon.count({ where }),
    ]);

    // Formatar resposta com usageCount e remover _count
    const formattedCoupons = coupons.map((coupon) => {
      const { _count, ...couponData } = coupon;
      return {
        ...couponData,
        usageCount: _count.couponUsages,
      };
    });

    res.json({
      coupons: formattedCoupons,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error('Erro ao listar cupons pendentes:', error);
    res.status(500).json({ error: 'Erro ao buscar cupons pendentes' });
  }
}

// Aprovar/Rejeitar cupom
export async function updateCouponStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido. Use APPROVED ou REJECTED' });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!coupon) {
      return res.status(404).json({ error: 'Cupom não encontrado' });
    }

    const updatedCoupon = await prisma.coupon.update({
      where: { id },
      data: {
        status: status as CouponStatus,
        isActive: status === 'APPROVED',
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
    });

    res.json({
      message: `Cupom ${status === 'APPROVED' ? 'aprovado' : 'rejeitado'} com sucesso`,
      coupon: updatedCoupon,
    });
  } catch (error) {
    console.error('Erro ao atualizar status do cupom:', error);
    res.status(500).json({ error: 'Erro ao atualizar cupom' });
  }
}

// Pausar/Ativar cupom (admin)
export async function toggleCouponActive(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const coupon = await prisma.coupon.findUnique({
      where: { id },
    });

    if (!coupon) {
      return res.status(404).json({ error: 'Cupom não encontrado' });
    }

    if (coupon.status !== 'APPROVED') {
      return res.status(400).json({ error: 'Apenas cupons aprovados podem ser pausados/ativados' });
    }

    const updatedCoupon = await prisma.coupon.update({
      where: { id },
      data: {
        isActive: !coupon.isActive,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
    });

    res.json({
      message: `Cupom ${updatedCoupon.isActive ? 'ativado' : 'pausado'} com sucesso`,
      coupon: updatedCoupon,
    });
  } catch (error) {
    console.error('Erro ao pausar/ativar cupom:', error);
    res.status(500).json({ error: 'Erro ao atualizar cupom' });
  }
}

// Dashboard Admin - Estatísticas gerais
export async function getAdminStats(req: Request, res: Response) {
  try {
    const [
      totalUsers,
      activeSubscriptions,
      totalCompanies,
      activeCompanies,
      totalCoupons,
      approvedCoupons,
      pendingCoupons,
      totalCouponUsages,
      pendingCompanies,
    ] = await Promise.all([
      prisma.user.count({
        where: { role: 'CUSTOMER' },
      }),
      prisma.subscription.count({
        where: { status: 'ACTIVE' },
      }),
      prisma.company.count(),
      prisma.company.count({
        where: { status: 'ACTIVE', isActive: true },
      }),
      prisma.coupon.count(),
      prisma.coupon.count({
        where: { status: 'APPROVED', isActive: true },
      }),
      prisma.coupon.count({
        where: { status: 'PENDING' },
      }),
      prisma.couponUsage.count({
        where: { isUsed: true },
      }),
      prisma.company.count({
        where: { status: 'PENDING' },
      }),
    ]);

    // Calcular receita mensal estimada (assinaturas ativas * R$ 29,90)
    const monthlyRevenue = activeSubscriptions * 29.90;

    res.json({
      users: {
        total: totalUsers,
        activeSubscriptions,
      },
      companies: {
        total: totalCompanies,
        active: activeCompanies,
        pending: pendingCompanies,
      },
      coupons: {
        total: totalCoupons,
        approved: approvedCoupons,
        pending: pendingCoupons,
        totalUsages: totalCouponUsages,
      },
      revenue: {
        monthly: monthlyRevenue.toFixed(2),
        activeSubscriptions,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
}

// Listar usuários
export async function listUsers(req: Request, res: Response) {
  try {
    const { role, search, page = '1', limit = '20' } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const where: any = {};

    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        {
          email: {
            contains: search as string,
            mode: 'insensitive',
          },
        },
        {
          fullName: {
            contains: search as string,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              subscriptions: true,
              couponUsages: true,
            },
          },
        },
        skip,
        take: limitNumber,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      users,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
}

