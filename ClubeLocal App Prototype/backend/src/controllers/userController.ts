import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obter perfil do usuário
export async function getProfile(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        subscriptions: {
          where: {
            status: 'ACTIVE',
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
            status: true,
          },
        },
        _count: {
          select: {
            couponUsages: {
              where: {
                isUsed: true,
              },
            },
            favorites: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Calcular economia total (soma dos valores dos cupons usados)
    const usedCoupons = await prisma.couponUsage.findMany({
      where: {
        userId: req.user.userId,
        isUsed: true,
      },
      include: {
        coupon: {
          select: {
            discountType: true,
            discountValue: true,
          },
        },
      },
    });

    let totalSavings = 0;
    // Nota: Em produção, você calcularia a economia real baseada nas compras
    // Aqui é uma estimativa baseada nos descontos
    usedCoupons.forEach((usage) => {
      if (usage.coupon.discountValue) {
        totalSavings += usage.coupon.discountValue;
      }
    });

    res.json({
      ...user,
      stats: {
        couponsUsed: user._count.couponUsages,
        favoritesCount: user._count.favorites,
        totalSavings: totalSavings.toFixed(2),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
}

// Atualizar perfil
export async function updateProfile(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const { fullName, phone, avatarUrl } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        fullName: fullName || undefined,
        phone: phone || undefined,
        avatarUrl: avatarUrl || undefined,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        avatarUrl: true,
        role: true,
      },
    });

    res.json({
      message: 'Perfil atualizado com sucesso',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
}

// Listar favoritos
export async function getFavorites(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: req.user.userId,
      },
      include: {
        coupon: {
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
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      favorites: favorites.map((f) => ({
        id: f.coupon.id,
        title: f.coupon.title,
        description: f.coupon.description,
        discountType: f.coupon.discountType,
        discountValue: f.coupon.discountValue,
        imageUrl: f.coupon.imageUrl,
        validUntil: f.coupon.validUntil,
        company: f.coupon.company,
        category: f.coupon.category,
      })),
    });
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error);
    res.status(500).json({ error: 'Erro ao buscar favoritos' });
  }
}

// Adicionar favorito
export async function addFavorite(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const { couponId } = req.body;

    if (!couponId) {
      return res.status(400).json({ error: 'ID do cupom é obrigatório' });
    }

    // Verificar se cupom existe
    const coupon = await prisma.coupon.findUnique({
      where: { id: couponId },
    });

    if (!coupon) {
      return res.status(404).json({ error: 'Cupom não encontrado' });
    }

    // Verificar se já está favoritado
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_couponId: {
          userId: req.user.userId,
          couponId: couponId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Cupom já está nos favoritos' });
    }

    // Adicionar favorito
    await prisma.favorite.create({
      data: {
        userId: req.user.userId,
        couponId: couponId,
      },
    });

    res.status(201).json({
      message: 'Cupom adicionado aos favoritos',
    });
  } catch (error) {
    console.error('Erro ao adicionar favorito:', error);
    res.status(500).json({ error: 'Erro ao adicionar favorito' });
  }
}

// Remover favorito
export async function removeFavorite(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const { couponId } = req.params;

    // Verificar se favorito existe
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_couponId: {
          userId: req.user.userId,
          couponId: couponId,
        },
      },
    });

    if (!favorite) {
      return res.status(404).json({ error: 'Favorito não encontrado' });
    }

    // Remover favorito
    await prisma.favorite.delete({
      where: {
        userId_couponId: {
          userId: req.user.userId,
          couponId: couponId,
        },
      },
    });

    res.json({
      message: 'Favorito removido com sucesso',
    });
  } catch (error) {
    console.error('Erro ao remover favorito:', error);
    res.status(500).json({ error: 'Erro ao remover favorito' });
  }
}

// Cupons ativados mas não validados (pendentes)
export async function getActiveCoupons(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const couponUsages = await prisma.couponUsage.findMany({
      where: {
        userId: req.user.userId,
        isUsed: false, // Ainda não validados
      },
      include: {
        coupon: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
                address: true,
                city: true,
                phone: true,
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Verificar se cupons ainda são válidos
    const validCoupons = couponUsages.filter((usage) => {
      const now = new Date();
      return now <= usage.coupon.validUntil && now >= usage.coupon.validFrom;
    });

    const activeCoupons = validCoupons.map((usage) => ({
      id: usage.id,
      code: usage.code,
      createdAt: usage.createdAt,
      qrCode: `CLUBELOCAL:${usage.coupon.id}:${usage.code}`,
      coupon: {
        id: usage.coupon.id,
        title: usage.coupon.title,
        description: usage.coupon.description,
        discountType: usage.coupon.discountType,
        discountValue: usage.coupon.discountValue,
        imageUrl: usage.coupon.imageUrl,
        validUntil: usage.coupon.validUntil,
        validFrom: usage.coupon.validFrom,
        company: usage.coupon.company,
        category: usage.coupon.category,
      },
    }));

    res.json({
      activeCoupons,
      total: activeCoupons.length,
    });
  } catch (error) {
    console.error('Erro ao buscar cupons ativos:', error);
    res.status(500).json({ error: 'Erro ao buscar cupons ativos' });
  }
}

// Histórico de cupons usados
export async function getCouponHistory(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const couponUsages = await prisma.couponUsage.findMany({
      where: {
        userId: req.user.userId,
        isUsed: true,
      },
      include: {
        coupon: {
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
          },
        },
      },
      orderBy: {
        usedAt: 'desc',
      },
    });

    const history = couponUsages.map((usage) => ({
      id: usage.id,
      code: usage.code,
      usedAt: usage.usedAt,
      coupon: {
        id: usage.coupon.id,
        title: usage.coupon.title,
        description: usage.coupon.description,
        discountType: usage.coupon.discountType,
        discountValue: usage.coupon.discountValue,
        company: usage.coupon.company,
        category: usage.coupon.category,
      },
    }));

    // Calcular economia total
    let totalSavings = 0;
    history.forEach((item) => {
      if (item.coupon.discountType === 'PERCENTAGE') {
        // Para porcentagem, precisaríamos do valor da compra, mas vamos estimar
        // Por enquanto, vamos apenas contar os cupons validados
      } else if (item.coupon.discountType === 'FIXED') {
        totalSavings += item.coupon.discountValue || 0;
      } else if (item.coupon.discountType === 'FREE') {
        // Para cupons grátis, vamos considerar um valor simbólico
        totalSavings += 10; // Valor estimado
      }
    });

    res.json({
      history,
      total: history.length,
      totalSavings: totalSavings.toFixed(2),
    });
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
}

