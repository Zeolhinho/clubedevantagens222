import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Heart, Ticket, MapPin, Calendar } from 'lucide-react';
import { Coupon } from '../data/mockData';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CouponCardProps {
  coupon: Coupon;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onUseCoupon: (coupon: Coupon) => void;
}

export function CouponCard({ coupon, isFavorite, onToggleFavorite, onUseCoupon }: CouponCardProps) {
  return (
    <Card className="overflow-hidden bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all group">
      <div className="relative h-40">
        <ImageWithFallback
          src={coupon.image}
          alt={coupon.business}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        <button
          onClick={() => onToggleFavorite(coupon.id)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-slate-900/80 backdrop-blur flex items-center justify-center transition-all hover:scale-110"
        >
          <Heart 
            className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`}
          />
        </button>
        <Badge className="absolute top-3 left-3 bg-amber-500/90 text-white border-0">
          {coupon.discount}
        </Badge>
      </div>
      <div className="p-4">
        <h3 className="text-white mb-1">{coupon.business}</h3>
        <p className="text-slate-400 mb-3">{coupon.title}</p>
        <div className="flex items-center gap-2 text-slate-500 mb-3">
          <MapPin className="w-4 h-4" />
          <span>{coupon.category}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500 mb-4">
          <Calendar className="w-4 h-4" />
          <span>Válido até {coupon.validUntil}</span>
        </div>
        <Button 
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
          onClick={() => onUseCoupon(coupon)}
        >
          <Ticket className="w-4 h-4 mr-2" />
          Usar Cupom
        </Button>
      </div>
    </Card>
  );
}
