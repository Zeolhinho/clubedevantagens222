import { Request, Response } from 'express';
import { PrismaClient, CouponStatus, DiscountType } from '@prisma/client';

const prisma = new PrismaClient();

// Função para gerar código único
function generateUniqueCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removido I, O, 0, 1 para evitar confusão
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Listar cupons com filtros e busca
export async function listCoupons(req: Request, res: Response) {
  try {
    const {
      category,
      search,
      status,
      companyId,
      page = '1',
      limit = '20',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Construir filtros
    const where: any = {
      // Apenas cupons aprovados e ativos para usuários
      status: CouponStatus.APPROVED,
      isActive: true,
      // Cupons válidos (não expirados)
      validUntil: {
        gte: new Date(),
      },
    };

    // Filtro por categoria (buscar categoria pelo nome primeiro)
    if (category) {
      const categoryRecord = await prisma.category.findFirst({
        where: {
          name: {
            contains: category as string,
            mode: 'insensitive',
          },
        },
      });
      
      if (categoryRecord) {
        where.categoryId = categoryRecord.id;
      } else {
        // Se categoria não encontrada, retornar vazio
        return res.json({
          coupons: [],
          pagination: {
            page: pageNumber,
            limit: limitNumber,
            total: 0,
            totalPages: 0,
          },
        });
      }
    }

    // Filtro por empresa
    if (companyId) {
      // Se for 'current', usar empresa do usuário logado
      if (companyId === 'current') {
        if (!req.user || req.user.role !== 'COMPANY') {
          return res.status(401).json({ error: 'Autenticação necessária para usar companyId=current' });
        }
        const company = await prisma.company.findUnique({
          where: { userId: req.user.userId },
        });
        if (!company) {
          return res.status(404).json({ error: 'Empresa não encontrada para este usuário' });
        }
        where.companyId = company.id;
      } else {
        where.companyId = companyId as string;
      }
    } else if (req.user?.role === 'COMPANY') {
      // Se for empresa e não especificou companyId, mostrar apenas seus cupons
      const company = await prisma.company.findUnique({
        where: { userId: req.user.userId },
      });
      if (company) {
        where.companyId = company.id;
      }
    }

    // Filtro por status
    // Se for empresa, mostrar todos os status dos seus cupons (incluindo pendentes e rejeitados)
    // Se for admin, pode filtrar por status
    // Se for cliente, apenas aprovados e ativos (já definido acima)
    if (req.user?.role === 'COMPANY') {
      // Empresas veem todos os status dos seus cupons
      delete where.status;
      delete where.isActive;
      delete where.validUntil; // Empresas veem cupons expirados também
      console.log('Empresa logada - removendo filtros de status. CompanyId:', where.companyId);
    } else if (status && req.user?.role === 'ADMIN') {
      where.status = status as CouponStatus;
      delete where.isActive; // Admin pode ver inativos também
    }

    console.log('Where clause final:', JSON.stringify(where, null, 2));

    // Busca por texto (título ou descrição)
    if (search) {
      where.OR = [
        {
          title: {
            contains: search as string,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search as string,
            mode: 'insensitive',
          },
        },
        {
          company: {
            name: {
              contains: search as string,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    // Ordenação
    const orderBy: any = {};
    if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder;
    } else if (sortBy === 'validUntil') {
      orderBy.validUntil = sortOrder;
    }

    // Buscar cupons
    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
              city: true,
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
        orderBy,
      }),
      prisma.coupon.count({ where }),
    ]);

    // Formatar resposta
    const formattedCoupons = coupons.map((coupon) => ({
      id: coupon.id,
      title: coupon.title,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      imageUrl: coupon.imageUrl,
      termsConditions: coupon.termsConditions,
      validFrom: coupon.validFrom,
      validUntil: coupon.validUntil,
      maxUsesPerUser: coupon.maxUsesPerUser,
      isActive: coupon.isActive,
      status: coupon.status,
      company: coupon.company,
      category: coupon.category,
      usageCount: coupon._count.couponUsages,
    }));

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
    console.error('Erro ao listar cupons:', error);
    res.status(500).json({ error: 'Erro ao buscar cupons' });
  }
}

// Buscar cupom por ID
export async function getCouponById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const coupon = await prisma.coupon.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
            description: true,
            address: true,
            city: true,
            phone: true,
            instagram: true,
            website: true,
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
    });

    if (!coupon) {
      return res.status(404).json({ error: 'Cupom não encontrado' });
    }

    // Verificar se está aprovado e ativo (para usuários não-admin)
    if (req.user?.role !== 'ADMIN' && (coupon.status !== CouponStatus.APPROVED || !coupon.isActive)) {
      return res.status(404).json({ error: 'Cupom não encontrado' });
    }

    res.json({
      ...coupon,
      usageCount: coupon._count.couponUsages,
    });
  } catch (error) {
    console.error('Erro ao buscar cupom:', error);
    res.status(500).json({ error: 'Erro ao buscar cupom' });
  }
}

// Listar categorias
export async function listCategories(req: Request, res: Response) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            coupons: {
              where: {
                status: CouponStatus.APPROVED,
                isActive: true,
                validUntil: {
                  gte: new Date(),
                },
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      icon: category.icon,
      couponCount: category._count.coupons,
    }));

    res.json({ categories: formattedCategories });
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
}

// Criar cupom (apenas empresas)
export async function createCoupon(req: Request, res: Response) {
  try {
    if (!req.user || req.user.role !== 'COMPANY') {
      return res.status(403).json({ error: 'Apenas empresas podem criar cupons' });
    }

    const {
      title,
      description,
      discountType,
      discountValue,
      imageUrl,
      termsConditions,
      validFrom,
      validUntil,
      maxUsesPerUser = 1,
      totalUsesLimit,
      categoryId,
    } = req.body;

    // Validar campos obrigatórios
    if (!title || !description || !discountType || !validFrom || !validUntil) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    // Buscar empresa do usuário
    const company = await prisma.company.findUnique({
      where: { userId: req.user.userId },
    });

    if (!company) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    // Validar datas
    const validFromDate = new Date(validFrom);
    const validUntilDate = new Date(validUntil);

    if (validUntilDate <= validFromDate) {
      return res.status(400).json({ error: 'Data de validade deve ser posterior à data de início' });
    }

    // Criar cupom (status PENDING - precisa aprovação do admin)
    const coupon = await prisma.coupon.create({
      data: {
        companyId: company.id,
        title,
        description,
        discountType: discountType as DiscountType,
        discountValue: discountValue ? parseFloat(discountValue) : null,
        imageUrl: imageUrl || null,
        termsConditions: termsConditions || null,
        validFrom: validFromDate,
        validUntil: validUntilDate,
        maxUsesPerUser: parseInt(maxUsesPerUser, 10) || 1,
        totalUsesLimit: totalUsesLimit ? parseInt(totalUsesLimit, 10) : null,
        categoryId: categoryId || null,
        status: CouponStatus.PENDING, // Precisa aprovação
        isActive: false, // Só fica ativo após aprovação
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

    res.status(201).json({
      message: 'Cupom criado com sucesso! Aguardando aprovação do administrador.',
      coupon,
    });
  } catch (error) {
    console.error('Erro ao criar cupom:', error);
    res.status(500).json({ error: 'Erro ao criar cupom' });
  }
}

// Editar cupom (apenas empresa dona)
export async function updateCoupon(req: Request, res: Response) {
  try {
    if (!req.user || req.user.role !== 'COMPANY') {
      return res.status(403).json({ error: 'Apenas empresas podem editar cupons' });
    }

    const { id } = req.params;
    const {
      title,
      description,
      discountType,
      discountValue,
      imageUrl,
      termsConditions,
      validFrom,
      validUntil,
      maxUsesPerUser,
      totalUsesLimit,
      categoryId,
    } = req.body;

    // Buscar cupom
    const coupon = await prisma.coupon.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });

    if (!coupon) {
      return res.status(404).json({ error: 'Cupom não encontrado' });
    }

    // Verificar se a empresa é dona do cupom
    const company = await prisma.company.findUnique({
      where: { userId: req.user.userId },
    });

    if (!company || coupon.companyId !== company.id) {
      return res.status(403).json({ error: 'Você não tem permissão para editar este cupom' });
    }

    // Se cupom foi aprovado, volta para PENDING após edição
    const newStatus = coupon.status === CouponStatus.APPROVED 
      ? CouponStatus.PENDING 
      : coupon.status;

    // Atualizar cupom
    const updatedCoupon = await prisma.coupon.update({
      where: { id },
      data: {
        title: title || coupon.title,
        description: description || coupon.description,
        discountType: discountType || coupon.discountType,
        discountValue: discountValue !== undefined ? parseFloat(discountValue) : coupon.discountValue,
        imageUrl: imageUrl !== undefined ? imageUrl : coupon.imageUrl,
        termsConditions: termsConditions !== undefined ? termsConditions : coupon.termsConditions,
        validFrom: validFrom ? new Date(validFrom) : coupon.validFrom,
        validUntil: validUntil ? new Date(validUntil) : coupon.validUntil,
        maxUsesPerUser: maxUsesPerUser ? parseInt(maxUsesPerUser, 10) : coupon.maxUsesPerUser,
        totalUsesLimit: totalUsesLimit !== undefined ? parseInt(totalUsesLimit, 10) : coupon.totalUsesLimit,
        categoryId: categoryId || coupon.categoryId,
        status: newStatus,
        isActive: false, // Desativa até nova aprovação
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
      message: 'Cupom atualizado com sucesso!',
      coupon: updatedCoupon,
    });
  } catch (error) {
    console.error('Erro ao atualizar cupom:', error);
    res.status(500).json({ error: 'Erro ao atualizar cupom' });
  }
}

// Deletar cupom (empresa dona ou admin)
export async function deleteCoupon(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const { id } = req.params;

    // Buscar cupom
    const coupon = await prisma.coupon.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });

    if (!coupon) {
      return res.status(404).json({ error: 'Cupom não encontrado' });
    }

    // Se for admin, pode deletar qualquer cupom
    if (req.user.role === 'ADMIN') {
      await prisma.coupon.delete({
        where: { id },
      });
      return res.json({ message: 'Cupom deletado com sucesso' });
    }

    // Se for empresa, verificar se é dona do cupom
    if (req.user.role === 'COMPANY') {
      const company = await prisma.company.findUnique({
        where: { userId: req.user.userId },
      });

      if (!company || coupon.companyId !== company.id) {
        return res.status(403).json({ error: 'Você não tem permissão para deletar este cupom' });
      }

      await prisma.coupon.delete({
        where: { id },
      });
      return res.json({ message: 'Cupom deletado com sucesso' });
    }

    return res.status(403).json({ error: 'Você não tem permissão para deletar cupons' });
  } catch (error) {
    console.error('Erro ao deletar cupom:', error);
    res.status(500).json({ error: 'Erro ao deletar cupom' });
  }
}

// Usar cupom (gerar código único)
export async function useCoupon(req: Request, res: Response) {
  try {
    if (!req.user || req.user.role !== 'CUSTOMER') {
      return res.status(403).json({ error: 'Apenas clientes podem usar cupons' });
    }

    const { id } = req.params;

    // Buscar cupom
    const coupon = await prisma.coupon.findUnique({
      where: { id },
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
    });

    if (!coupon) {
      return res.status(404).json({ error: 'Cupom não encontrado' });
    }

    // Verificar se cupom está aprovado e ativo
    if (coupon.status !== CouponStatus.APPROVED || !coupon.isActive) {
      return res.status(400).json({ error: 'Cupom não está disponível para uso' });
    }

    // Verificar se cupom ainda é válido
    if (new Date() > coupon.validUntil) {
      return res.status(400).json({ error: 'Cupom expirado' });
    }

    if (new Date() < coupon.validFrom) {
      return res.status(400).json({ error: 'Cupom ainda não está válido' });
    }

    // Verificar limite de usos por usuário
    const userUsages = await prisma.couponUsage.count({
      where: {
        couponId: id,
        userId: req.user.userId,
        isUsed: true,
      },
    });

    if (userUsages >= coupon.maxUsesPerUser) {
      return res.status(400).json({ 
        error: `Você já usou este cupom o máximo de vezes permitido (${coupon.maxUsesPerUser})` 
      });
    }

    // Verificar limite total de usos (se houver)
    if (coupon.totalUsesLimit) {
      const totalUsages = await prisma.couponUsage.count({
        where: {
          couponId: id,
          isUsed: true,
        },
      });

      if (totalUsages >= coupon.totalUsesLimit) {
        return res.status(400).json({ error: 'Cupom atingiu o limite máximo de usos' });
      }
    }

    // Gerar código único
    let code: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      code = generateUniqueCode();
      const existing = await prisma.couponUsage.findUnique({
        where: { code },
      });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({ error: 'Erro ao gerar código único. Tente novamente.' });
    }

    // Criar registro de uso (ainda não usado - será marcado como usado quando validado)
    const couponUsage = await prisma.couponUsage.create({
      data: {
        couponId: id,
        userId: req.user.userId,
        code: code!,
        isUsed: false,
      },
      include: {
        coupon: {
          select: {
            title: true,
            description: true,
            discountType: true,
            discountValue: true,
            validUntil: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Cupom ativado com sucesso!',
      code: code,
      couponUsage: {
        id: couponUsage.id,
        code: couponUsage.code,
        coupon: couponUsage.coupon,
        createdAt: couponUsage.createdAt,
      },
      qrCode: `CLUBELOCAL:${id}:${code}`, // Para gerar QR Code no frontend
    });
  } catch (error) {
    console.error('Erro ao usar cupom:', error);
    res.status(500).json({ error: 'Erro ao usar cupom' });
  }
}

// Validar código de cupom (para empresas validarem) - aceita código ou QR code
export async function validateCouponCode(req: Request, res: Response) {
  try {
    if (!req.user || req.user.role !== 'COMPANY') {
      return res.status(403).json({ error: 'Apenas empresas podem validar cupons' });
    }

    let { code, qrCode } = req.body;

    // Se for QR code, extrair o código
    if (qrCode) {
      // Formato: CLUBELOCAL:couponId:code
      const parts = qrCode.split(':');
      if (parts.length === 3 && parts[0] === 'CLUBELOCAL') {
        code = parts[2]; // Extrair o código
      } else {
        return res.status(400).json({ error: 'QR Code inválido' });
      }
    }

    if (!code) {
      return res.status(400).json({ error: 'Código ou QR Code é obrigatório' });
    }

    // Buscar uso do cupom
    const couponUsage = await prisma.couponUsage.findUnique({
      where: { code },
      include: {
        coupon: {
          include: {
            company: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });

    if (!couponUsage) {
      return res.status(404).json({ error: 'Código inválido ou não encontrado' });
    }

    // Verificar se já foi usado
    if (couponUsage.isUsed) {
      return res.status(400).json({ error: 'Este cupom já foi utilizado' });
    }

    // Verificar se a empresa é dona do cupom
    const company = await prisma.company.findUnique({
      where: { userId: req.user.userId },
    });

    if (!company || couponUsage.coupon.companyId !== company.id) {
      return res.status(403).json({ error: 'Este cupom não pertence à sua empresa' });
    }

    // Verificar se cupom ainda é válido
    const now = new Date();
    if (now > couponUsage.coupon.validUntil) {
      return res.status(400).json({ error: 'Este cupom expirou' });
    }

    if (now < couponUsage.coupon.validFrom) {
      return res.status(400).json({ error: 'Este cupom ainda não está válido' });
    }

    // Marcar como usado
    const updatedUsage = await prisma.couponUsage.update({
      where: { id: couponUsage.id },
      data: {
        isUsed: true,
        usedAt: new Date(),
      },
    });

    // Calcular economia (estimativa)
    let savings = 0;
    if (couponUsage.coupon.discountType === 'FIXED') {
      savings = couponUsage.coupon.discountValue || 0;
    } else if (couponUsage.coupon.discountType === 'PERCENTAGE') {
      // Para porcentagem, precisaríamos do valor da compra
      // Por enquanto, vamos retornar a porcentagem
      savings = couponUsage.coupon.discountValue || 0;
    } else if (couponUsage.coupon.discountType === 'FREE') {
      savings = 10; // Valor estimado para cupons grátis
    }

    res.json({
      message: 'Cupom validado com sucesso!',
      couponUsage: {
        id: updatedUsage.id,
        code: updatedUsage.code,
        usedAt: updatedUsage.usedAt,
        user: couponUsage.user,
        coupon: {
          id: couponUsage.coupon.id,
          title: couponUsage.coupon.title,
          description: couponUsage.coupon.description,
          discountType: couponUsage.coupon.discountType,
          discountValue: couponUsage.coupon.discountValue,
        },
        savings,
      },
    });
  } catch (error) {
    console.error('Erro ao validar código:', error);
    res.status(500).json({ error: 'Erro ao validar código' });
  }
}

