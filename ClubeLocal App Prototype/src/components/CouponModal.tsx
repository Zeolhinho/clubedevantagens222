import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Calendar, AlertCircle, Copy, Check } from 'lucide-react';
import { Coupon } from '../data/mockData';
import { useState } from 'react';

interface CouponModalProps {
  coupon: Coupon;
  onClose: () => void;
}

export function CouponModal({ coupon, onClose }: CouponModalProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">{coupon.business}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-2">
              {coupon.discount}
            </Badge>
            <h3 className="text-xl text-white mb-2">{coupon.title}</h3>
            <p className="text-slate-400">{coupon.description}</p>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{coupon.category}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Válido até {coupon.validUntil}</span>
          </div>

          {/* QR Code */}
          <div className="bg-white p-6 rounded-xl flex items-center justify-center">
            <div className="w-48 h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full p-4">
                <rect x="0" y="0" width="200" height="200" fill="white"/>
                <g fill="black">
                  {/* Simplified QR code pattern */}
                  <rect x="10" y="10" width="60" height="60"/>
                  <rect x="20" y="20" width="40" height="40" fill="white"/>
                  <rect x="30" y="30" width="20" height="20"/>
                  <rect x="130" y="10" width="60" height="60"/>
                  <rect x="140" y="20" width="40" height="40" fill="white"/>
                  <rect x="150" y="30" width="20" height="20"/>
                  <rect x="10" y="130" width="60" height="60"/>
                  <rect x="20" y="140" width="40" height="40" fill="white"/>
                  <rect x="30" y="150" width="20" height="20"/>
                  <rect x="90" y="90" width="20" height="20"/>
                  <rect x="80" y="80" width="10" height="10"/>
                  <rect x="110" y="80" width="10" height="10"/>
                  <rect x="80" y="110" width="10" height="10"/>
                  <rect x="110" y="110" width="10" height="10"/>
                </g>
              </svg>
            </div>
          </div>

          {/* Coupon Code */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 mb-1">Código do cupom</p>
                <p className="text-2xl tracking-wider text-white">{coupon.code}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="text-slate-400 hover:text-white"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-200">
                Apresente este QR Code ou código no estabelecimento antes do pagamento. 
                Uso único por assinante.
              </p>
            </div>
          </div>

          <Button 
            onClick={onClose}
            variant="outline"
            className="w-full border-slate-700 text-slate-200 hover:bg-slate-800"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
