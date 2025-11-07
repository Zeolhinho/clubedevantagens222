import { Coupon } from '../data/mockData';
import { Coupon as ApiCoupon } from '../services/couponService';

// Converter cupom da API para o formato usado no frontend
export function adaptCoupon(apiCoupon: ApiCoupon): Coupon {
  // Formatar desconto
  let discount = '';
  if (apiCoupon.discountType === 'PERCENTAGE') {
    discount = `${apiCoupon.discountValue}% OFF`;
  } else if (apiCoupon.discountType === 'FIXED') {
    discount = `R$ ${apiCoupon.discountValue?.toFixed(2)} OFF`;
  } else {
    discount = 'Grátis';
  }

  // Formatar data
  const validUntil = new Date(apiCoupon.validUntil).toLocaleDateString('pt-BR');

  return {
    id: apiCoupon.id,
    business: apiCoupon.company.name,
    title: apiCoupon.title,
    description: apiCoupon.description,
    discount,
    category: apiCoupon.category?.name || 'Outros',
    image: apiCoupon.imageUrl || 'https://via.placeholder.com/400x200',
    validUntil,
    code: '', // Será gerado quando usar o cupom
    status: apiCoupon.isActive ? 'active' : 'paused',
    usageCount: apiCoupon.usageCount || 0,
    companyId: apiCoupon.company.id, // ID da empresa para favoritos
  };
}

