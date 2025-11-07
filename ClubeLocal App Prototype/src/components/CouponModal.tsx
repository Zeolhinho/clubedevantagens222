import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Calendar, AlertCircle, Copy, Check, Loader2 } from 'lucide-react';
import { Coupon } from '../data/mockData';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { couponService } from '../services/couponService';

interface CouponModalProps {
  coupon: Coupon;
  onClose: () => void;
}

export function CouponModal({ coupon, onClose }: CouponModalProps) {
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState<string | null>(coupon.code || null);
  const [isUsing, setIsUsing] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  
  const handleUseCoupon = async () => {
    if (code) {
      // Já foi usado, apenas copiar
      handleCopy();
      return;
    }

    setIsUsing(true);
    try {
      const response = await couponService.useCoupon(coupon.id);
      setCode(response.code);
      setQrCodeData(response.qrCode || `CLUBELOCAL:${coupon.id}:${response.code}`);
      toast.success('Cupom ativado com sucesso! 🎉');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao usar cupom';
      toast.error(errorMessage);
    } finally {
      setIsUsing(false);
    }
  };
  
  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Código copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-slate-900 pb-4 z-10">
          <DialogTitle className="text-2xl">{coupon.business}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pb-4">
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

          {/* QR Code Real */}
          {code && qrCodeData ? (
            <div className="bg-white p-4 md:p-6 rounded-xl flex items-center justify-center">
              <QRCodeSVG
                value={qrCodeData}
                size={180}
                level="H"
                includeMargin={true}
                bgColor="#FFFFFF"
                fgColor="#000000"
              />
            </div>
          ) : (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 flex items-center justify-center">
              <p className="text-slate-400 text-center">
                Clique em "Usar Cupom" para gerar o código e QR Code
              </p>
            </div>
          )}

          {/* Coupon Code */}
          {code && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-slate-400 mb-1 text-sm">Código do cupom</p>
                  <p className="text-xl md:text-2xl tracking-wider text-white break-all">{code}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  className="text-slate-400 hover:text-white flex-shrink-0"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 md:p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-200 text-sm md:text-base">
                Apresente este QR Code ou código no estabelecimento antes do pagamento. 
                Uso único por assinante.
              </p>
            </div>
          </div>

          {!code ? (
            <Button 
              onClick={handleUseCoupon}
              disabled={isUsing}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white sticky bottom-0 shadow-lg"
            >
              {isUsing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Ativando...
                </>
              ) : (
                'Usar Cupom'
              )}
            </Button>
          ) : (
            <Button 
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white sticky bottom-0 shadow-lg"
            >
              Fechar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
