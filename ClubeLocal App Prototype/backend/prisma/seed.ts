import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Limpar dados existentes
  await prisma.couponUsage.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.company.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Criar categorias
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Alimentação', icon: '🍔' } }),
    prisma.category.create({ data: { name: 'Beleza', icon: '💇' } }),
    prisma.category.create({ data: { name: 'Serviços', icon: '🔧' } }),
    prisma.category.create({ data: { name: 'Saúde', icon: '🏥' } }),
    prisma.category.create({ data: { name: 'Compras', icon: '🛍️' } }),
    prisma.category.create({ data: { name: 'Lazer', icon: '🎉' } }),
  ]);

  console.log('✅ Categorias criadas');

  // Criar usuários
  const hashedPassword = await bcrypt.hash('123456', 10);

  // Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@clubelocal.com',
      password: hashedPassword,
      fullName: 'Admin Sistema',
      role: 'ADMIN',
    },
  });

  // Usuário normal
  const user1 = await prisma.user.create({
    data: {
      email: 'joao@teste.com',
      password: hashedPassword,
      fullName: 'João Silva',
      role: 'CUSTOMER',
      subscriptions: {
        create: {
          planType: 'MONTHLY',
          status: 'ACTIVE',
          price: 29.90,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'maria@teste.com',
      password: hashedPassword,
      fullName: 'Maria Santos',
      role: 'CUSTOMER',
      subscriptions: {
        create: {
          planType: 'YEARLY',
          status: 'ACTIVE',
          price: 299.00,
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
      },
    },
  });

  console.log('✅ Usuários criados');

  // Criar empresas
  const company1User = await prisma.user.create({
    data: {
      email: 'pizzaria@clubelocal.com',
      password: hashedPassword,
      fullName: 'Pizzaria Bella',
      role: 'COMPANY',
    },
  });

  const company1 = await prisma.company.create({
    data: {
      userId: company1User.id,
      name: 'Pizzaria Bella',
      description: 'As melhores pizzas da cidade',
      categoryId: categories[0].id,
      address: 'Rua das Pizzas, 123',
      city: 'São Paulo',
      phone: '(11) 98765-4321',
      status: 'ACTIVE',
      isActive: true,
    },
  });

  const company2User = await prisma.user.create({
    data: {
      email: 'salao@clubelocal.com',
      password: hashedPassword,
      fullName: 'Salão Glamour',
      role: 'COMPANY',
    },
  });

  const company2 = await prisma.company.create({
    data: {
      userId: company2User.id,
      name: 'Salão Glamour',
      description: 'Beleza e estilo',
      categoryId: categories[1].id,
      address: 'Av. da Beleza, 456',
      city: 'São Paulo',
      phone: '(11) 91234-5678',
      status: 'ACTIVE',
      isActive: true,
    },
  });

  console.log('✅ Empresas criadas');

  // Criar cupons
  await prisma.coupon.createMany({
    data: [
      {
        companyId: company1.id,
        categoryId: categories[0].id,
        title: '20% de desconto no rodízio',
        description: 'Válido para rodízio completo de carnes nobres. Não cumulativo com outras promoções.',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        maxUsesPerUser: 1,
        isActive: true,
        status: 'APPROVED',
      },
      {
        companyId: company1.id,
        categoryId: categories[0].id,
        title: 'Refrigerante grátis na compra de 2 pizzas',
        description: 'Ganhe um refrigerante 2L na compra de 2 pizzas grandes.',
        discountType: 'FREEBIE',
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        maxUsesPerUser: 2,
        isActive: true,
        status: 'APPROVED',
      },
      {
        companyId: company2.id,
        categoryId: categories[1].id,
        title: 'Corte + Escova por R$ 59,90',
        description: 'Corte feminino com escova modeladora. Agende com antecedência.',
        discountType: 'FIXED',
        discountValue: 59.90,
        imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        maxUsesPerUser: 1,
        isActive: true,
        status: 'APPROVED',
      },
      {
        companyId: company2.id,
        categoryId: categories[1].id,
        title: '30% OFF em serviços de manicure',
        description: 'Desconto válido para todos os serviços de manicure e pedicure.',
        discountType: 'PERCENTAGE',
        discountValue: 30,
        imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        maxUsesPerUser: 1,
        isActive: true,
        status: 'APPROVED',
      },
    ],
  });

  console.log('✅ Cupons criados');

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('\n📧 Contas criadas:');
  console.log('   Admin: admin@clubelocal.com / 123456');
  console.log('   Usuário 1: joao@teste.com / 123456');
  console.log('   Usuário 2: maria@teste.com / 123456');
  console.log('   Empresa 1: pizzaria@clubelocal.com / 123456');
  console.log('   Empresa 2: salao@clubelocal.com / 123456');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

