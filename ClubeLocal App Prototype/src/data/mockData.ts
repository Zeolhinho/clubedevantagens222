export interface Coupon {
  id: string;
  business: string;
  title: string;
  description: string;
  discount: string;
  category: string;
  image: string;
  validUntil: string;
  code: string;
  status?: 'active' | 'paused' | 'pending';
  usageCount?: number;
  companyId?: string; // ID da empresa (para favoritos)
}

export const mockCoupons: Coupon[] = [
  {
    id: '1',
    business: 'Restaurante Sabor Local',
    title: '20% de desconto no rodízio',
    description: 'Válido para rodízio completo de carnes nobres. Não cumulativo com outras promoções.',
    discount: '20% OFF',
    category: 'Alimentação',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    validUntil: '15/12/2025',
    code: 'SABOR20',
    status: 'active',
    usageCount: 45
  },
  {
    id: '2',
    business: 'Salão Beleza & Estilo',
    title: 'Corte + Escova por R$ 59,90',
    description: 'Corte feminino com escova modeladora. Agende com antecedência.',
    discount: '40% OFF',
    category: 'Beleza',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
    validUntil: '30/11/2025',
    code: 'BELEZA40',
    status: 'active',
    usageCount: 28
  },
  {
    id: '3',
    business: 'Auto Center Cidade',
    title: 'Troca de óleo grátis',
    description: 'Na compra de filtros e fluídos, a mão de obra da troca de óleo é grátis.',
    discount: 'Grátis',
    category: 'Serviços',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80',
    validUntil: '20/12/2025',
    code: 'AUTO100',
    status: 'active',
    usageCount: 12
  },
  {
    id: '4',
    business: 'Pizzaria Forno a Lenha',
    title: '2 pizzas grandes por R$ 79,90',
    description: 'Escolha até 3 sabores em cada pizza. Bebidas não inclusas.',
    discount: '35% OFF',
    category: 'Alimentação',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
    validUntil: '31/12/2025',
    code: 'PIZZA35',
    status: 'active',
    usageCount: 67
  },
  {
    id: '5',
    business: 'Academia Vida Ativa',
    title: 'Primeira mensalidade 50% OFF',
    description: 'Válido para novos alunos. Acesso completo a todas as modalidades.',
    discount: '50% OFF',
    category: 'Saúde',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    validUntil: '10/12/2025',
    code: 'FIT50',
    status: 'active',
    usageCount: 34
  },
  {
    id: '6',
    business: 'Café Aromático',
    title: 'Compre 1 café, ganhe 1 doce',
    description: 'Válido para qualquer café expresso e doces da casa.',
    discount: 'Brinde',
    category: 'Alimentação',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    validUntil: '25/11/2025',
    code: 'CAFE2X1',
    status: 'active',
    usageCount: 89
  },
  {
    id: '7',
    business: 'Pet Shop Amigo Fiel',
    title: 'Banho e tosa com 30% OFF',
    description: 'Para cães de pequeno e médio porte. Inclui perfume e laço.',
    discount: '30% OFF',
    category: 'Serviços',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80',
    validUntil: '05/12/2025',
    code: 'PET30',
    status: 'paused',
    usageCount: 23
  },
  {
    id: '8',
    business: 'Boutique Moda Fashion',
    title: 'R$ 50 OFF em compras acima de R$ 200',
    description: 'Válido para toda a loja. Não cumulativo.',
    discount: 'R$ 50 OFF',
    category: 'Compras',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80',
    validUntil: '18/12/2025',
    code: 'MODA50',
    status: 'pending',
    usageCount: 0
  },
];

export interface Business {
  id: string;
  name: string;
  email: string;
  category: string;
  status: 'active' | 'pending' | 'suspended';
  joinedDate: string;
  totalCoupons: number;
}

export const mockBusinesses: Business[] = [
  {
    id: '1',
    name: 'Restaurante Sabor Local',
    email: 'contato@saborlocal.com',
    category: 'Alimentação',
    status: 'active',
    joinedDate: '15/08/2025',
    totalCoupons: 3
  },
  {
    id: '2',
    name: 'Boutique Moda Fashion',
    email: 'loja@modafashion.com',
    category: 'Compras',
    status: 'pending',
    joinedDate: '01/11/2025',
    totalCoupons: 1
  },
  {
    id: '3',
    name: 'Academia Vida Ativa',
    email: 'academia@vidaativa.com',
    category: 'Saúde',
    status: 'active',
    joinedDate: '20/09/2025',
    totalCoupons: 2
  },
];
